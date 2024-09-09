import type { RequestHandler } from './$types';
import module from '../../../../../transformers';
import { sanitizeFilename } from '$utilities/apiHelper';
import { LocalIndex } from 'vectra';
import { join } from 'path';
const TASK = 'feature-extraction';

export const POST: RequestHandler = async ({ request }) => {
    console.log('POST /api/transformers/embeddings');
    try {
        const { text } = await request.json();
        if(!text) {
            return new Response(JSON.stringify({ error: 'Text is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const vector = await getTransformersVector(text);
        if(vector.length === 0) {
            return new Response(JSON.stringify({ error: 'Failed to vectorize text' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }); 
        }
        //Else we got some mother-fuckin vectors.
        console.log("Got some mother-fuckin vectors")
        return new Response(JSON.stringify({ vector }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to process request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

/**
 * Gets the vectorized text in form of an array of numbers.
 * @param {string} text - The text to vectorize
 * @returns {Promise<number[]>} - The vectorized text in form of an array of numbers
 */
async function getTransformersVector(text:string):Promise<number[]> {
    const pipe = await module.getPipeline(TASK);
    const result = await pipe(text, { pooling: 'mean', normalize: true });
    const vector = Array.from(result.data as number[]);
    return vector;
}

/**
 * Gets the vectorized texts in form of an array of arrays of numbers.
 * @param {string[]} texts - The texts to vectorize
 * @returns {Promise<number[][]>} - The vectorized texts in form of an array of arrays of numbers
 */
async function getTransformersBatchVector(texts: any) {
    const result = [];
    for (const text of texts) {
        result.push(await getTransformersVector(text));
    }
    return result;
}
//##############################################################################################

/**
 * Gets the vector for the given text from the given source.
 * @param {string} source - The source of the vector
 * @param {Object} sourceSettings - Settings for the source, if it needs any
 * @param {string} text - The text to get the vector for
 * @param {boolean} isQuery - If the text is a query for embedding search
 * @param {import('../users').UserDirectoryList} directories - The directories object for the user
 * @returns {Promise<number[]>} - The vector for the text
 */
async function getVector(source: string, sourceSettings: object, text: string, isQuery: boolean, directories: any) {
    switch (source) {
        case 'openai':
           // return require('../vectors/openai-vectors').getOpenAIVector(text, source, directories, sourceSettings.model);
        case 'transformers':
            return getTransformersVector(text);
    }
    throw new Error(`Unknown vector source ${source}`);
}
// Don't forget to add new sources to the SOURCES array
const SOURCES = [
    'transformers',
];

/**
 * Gets the vector for the given text batch from the given source.
 * @param {string} source - The source of the vector
 * @param {Object} sourceSettings - Settings for the source, if it needs any
 * @param {string[]} texts - The array of texts to get the vector for
 * @param {boolean} isQuery - If the text is a query for embedding search
 * @param {import('../users').UserDirectoryList} directories - The directories object for the user
 * @returns {Promise<number[][]>} - The array of vectors for the texts
 */
async function getBatchVector(source: string, sourceSettings: object, texts: string | any[], isQuery: boolean, directories: any) {
    const batchSize = 10;
    const batches = Array(Math.ceil(texts.length / batchSize)).fill(undefined).map((_, i) => texts.slice(i * batchSize, i * batchSize + batchSize));

    let results = [];
    for (let batch of batches) {
        switch (source) {
            case 'transformers':
                results.push(...await getTransformersBatchVector(batch));
                break;
            default:
                throw new Error(`Unknown vector source ${source}`);
        }
    }

    return results;
}

/**
 * Gets the index for the vector collection
 * @param {import('../users').UserDirectoryList} directories - User directories
 * @param {string} collectionId - The collection ID
 * @param {string} source - The source of the vector
 * @param {boolean} create - Whether to create the index if it doesn't exist
 * @returns {Promise<vectra.LocalIndex>} - The index for the collection
 */
async function getIndex(directories: { vectors: any; }, collectionId: string, source: string, create = true) {
    const pathToFile = join(directories.vectors, sanitizeFilename(source, true) as string, sanitizeFilename(collectionId) as string);
    const store = new LocalIndex(pathToFile);

    if (create && !await store.isIndexCreated()) {
        await store.createIndex();
    }

    return store;
}

/**
 * Inserts items into the vector collection
 * @param {import('../users').UserDirectoryList} directories - User directories
 * @param {string} collectionId - The collection ID
 * @param {string} source - The source of the vector
 * @param {Object} sourceSettings - Settings for the source, if it needs any
 * @param {{ hash: number; text: string; index: number; }[]} items - The items to insert
 */
async function insertVectorItems(directories: any, collectionId: string, source: string, sourceSettings: object, items: any[]) {
    const store = await getIndex(directories, collectionId, source);

    await store.beginUpdate();

    const vectors = await getBatchVector(source, sourceSettings, items.map(x => x.text), false, directories);

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const vector = vectors[i];
        await store.upsertItem({ vector: vector, metadata: { hash: item.hash, text: item.text, index: item.index } });
    }

    await store.endUpdate();
}

/**
 * Gets the hashes of the items in the vector collection
 * @param {import('../users').UserDirectoryList} directories - User directories
 * @param {string} collectionId - The collection ID
 * @param {string} source - The source of the vector
 * @returns {Promise<number[]>} - The hashes of the items in the collection
 */
async function getSavedHashes(directories: any, collectionId: string, source: string) {
    const store = await getIndex(directories, collectionId, source);

    const items = await store.listItems();
    //@ts-ignore
    const hashes = items.map((x) => Number(x.metadata.hash));

    return hashes;
}

/**
 * Deletes items from the vector collection by hash
 * @param {import('../users').UserDirectoryList} directories - User directories
 * @param {string} collectionId - The collection ID
 * @param {string} source - The source of the vector
 * @param {number[]} hashes - The hashes of the items to delete
 */
async function deleteVectorItems(directories: any, collectionId: string, source: string, hashes: number[]) {
    const store = await getIndex(directories, collectionId, source);
    const items = await store.listItemsByMetadata({ hash: { '$in': hashes } });

    await store.beginUpdate();

    for (const item of items) {
        await store.deleteItem(item.id);
    }

    await store.endUpdate();
}

/**
 * Gets the hashes of the items in the vector collection that match the search text
 * @param {import('../users').UserDirectoryList} directories - User directories
 * @param {string} collectionId - The collection ID
 * @param {string} source - The source of the vector
 * @param {Object} sourceSettings - Settings for the source, if it needs any
 * @param {string} searchText - The text to search for
 * @param {number} topK - The number of results to return
 * @param {number} threshold - The threshold for the search
 * @returns {Promise<{hashes: number[], metadata: object[]}>} - The metadata of the items that match the search text
 */
async function queryCollection(directories: any, collectionId: string, source: string, sourceSettings: object, searchText: string, topK: number, threshold: number) {
    const store = await getIndex(directories, collectionId, source);
    const vector = await getVector(source, sourceSettings, searchText, true, directories);

    const result = await store.queryItems(vector, topK);
    const metadata = result.filter((x: { score: number; }) => x.score >= threshold).map(x => x.item.metadata);
    const hashes = result.map((x) => Number(x.item.metadata.hash));
    return { metadata, hashes };
}

/**
 * Queries multiple collections for the given search queries. Returns the overall top K results.
 * @param {import('../users').UserDirectoryList} directories - User directories
 * @param {string[]} collectionIds - The collection IDs to query
 * @param {string} source - The source of the vector
 * @param {Object} sourceSettings - Settings for the source, if it needs any
 * @param {string} searchText - The text to search for
 * @param {number} topK - The number of results to return
 * @param {number} threshold - The threshold for the search
 *
 * @returns {Promise<Record<string, { hashes: number[], metadata: object[] }>>} - The top K results from each collection
 */
async function multiQueryCollection(directories: any, collectionIds: any, source: any, sourceSettings: any, searchText: any, topK: number | undefined, threshold: number) {
    const vector = await getVector(source, sourceSettings, searchText, true, directories);
    const results = [];

    for (const collectionId of collectionIds) {
        const store = await getIndex(directories, collectionId, source);
        const result = await store.queryItems(vector, topK as number);
        results.push(...result.map((result: any) => ({ collectionId, result })));
    }

    // Sort results by descending similarity, apply threshold, and take top K
    const sortedResults = results
        .sort((a, b) => b.result.score - a.result.score)
        .filter(x => x.result.score >= threshold)
        .slice(0, topK);

    /**
     * Group the results by collection ID
     * @type {Record<string, { hashes: number[], metadata: object[] }>}
     */
    const groupedResults: Record<string, { hashes: number[], metadata: object[] }> = {};
    for (const result of sortedResults) {
        if (!groupedResults[result.collectionId]) {
            groupedResults[result.collectionId] = { hashes: [], metadata: [] };
        }

        groupedResults[result.collectionId].hashes.push(Number(result.result.item.metadata.hash));
        groupedResults[result.collectionId].metadata.push(result.result.item.metadata);
    }

    return groupedResults;
}

/**
 * Performs a request to regenerate the index if it is corrupted.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {Error} error Error object
 * @returns {Promise<any>} Promise
 */
async function regenerateCorruptedIndexErrorHandler(req:any, res:any, error:any) {
    if (error instanceof SyntaxError && !req.query.regenerated) {
        const collectionId = String(req.body.collectionId);
        const source = String(req.body.source) || 'transformers';

        if (collectionId && source) {
            const index = await getIndex(req.user.directories, collectionId, source, false);
            const exists = await index.isIndexCreated();

            if (exists) {
                const path = index.folderPath;
                console.error(`Corrupted index detected at ${path}, regenerating...`);
                await index.deleteIndex();
                return res.redirect(307, `${req.originalUrl}?regenerated=true`);
            }
        }
    }

    console.error(error);
    return res.sendStatus(500);
}

/*

router.post('/query', jsonParser, async (req, res) => {
    try {
        if (!req.body.collectionId || !req.body.searchText) {
            return res.sendStatus(400);
        }

        const collectionId = String(req.body.collectionId);
        const searchText = String(req.body.searchText);
        const topK = Number(req.body.topK) || 10;
        const threshold = Number(req.body.threshold) || 0.0;
        const source = String(req.body.source) || 'transformers';
        const sourceSettings = getSourceSettings(source, req);

        const results = await queryCollection(req.user.directories, collectionId, source, sourceSettings, searchText, topK, threshold);
        return res.json(results);
    } catch (error) {
        return regenerateCorruptedIndexErrorHandler(req, res, error);
    }
});

async function queryMulti ({collectionIds:any, searchText:any, topK:any, threshold:any, source:any, sourceSettings:any, directories:any}) {
    try {
        if (!Array.isArray(collectionIds) || !searchText) {
            return { error: 'Request item missing or invalid.' };
        }

        const collectionIds = collectionIds.map(x => String(x));
        const searchText = String(searchText);
        const topK = Number(topK) || 10;
        const threshold = Number(threshold) || 0.0;
        const source = String(source) || 'transformers';
        const sourceSettings = getSourceSettings(source, req);

        const results = await multiQueryCollection(directories, collectionIds, source, sourceSettings, searchText, topK, threshold);
        return res.json(results);
    } catch (error) {
        return regenerateCorruptedIndexErrorHandler(req, res, error);
    }
});

router.post('/insert', jsonParser, async (req, res) => {
    try {
        if (!Array.isArray(req.body.items) || !req.body.collectionId) {
            return res.sendStatus(400);
        }

        const collectionId = String(req.body.collectionId);
        const items = req.body.items.map(x => ({ hash: x.hash, text: x.text, index: x.index }));
        const source = String(req.body.source) || 'transformers';
        const sourceSettings = getSourceSettings(source, req);

        await insertVectorItems(req.user.directories, collectionId, source, sourceSettings, items);
        return res.sendStatus(200);
    } catch (error) {
        return regenerateCorruptedIndexErrorHandler(req, res, error);
    }
});

router.post('/list', jsonParser, async (req, res) => {
    try {
        if (!req.body.collectionId) {
            return res.sendStatus(400);
        }

        const collectionId = String(req.body.collectionId);
        const source = String(req.body.source) || 'transformers';

        const hashes = await getSavedHashes(req.user.directories, collectionId, source);
        return res.json(hashes);
    } catch (error) {
        return regenerateCorruptedIndexErrorHandler(req, res, error);
    }
});

router.post('/delete', jsonParser, async (req, res) => {
    try {
        if (!Array.isArray(req.body.hashes) || !req.body.collectionId) {
            return res.sendStatus(400);
        }

        const collectionId = String(req.body.collectionId);
        const hashes = req.body.hashes.map(x => Number(x));
        const source = String(req.body.source) || 'transformers';

        await deleteVectorItems(req.user.directories, collectionId, source, hashes);
        return res.sendStatus(200);
    } catch (error) {
        return regenerateCorruptedIndexErrorHandler(req, res, error);
    }
});

router.post('/purge-all', jsonParser, async (req, res) => {
    try {
        for (const source of SOURCES) {
            const sourcePath = path.join(req.user.directories.vectors, sanitizeFilename(source));
            if (!fs.existsSync(sourcePath)) {
                continue;
            }
            await fs.promises.rm(sourcePath, { recursive: true });
            console.log(`Deleted vector source store at ${sourcePath}`);
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

router.post('/purge', jsonParser, async (req, res) => {
    try {
        if (!req.body.collectionId) {
            return res.sendStatus(400);
        }

        const collectionId = String(req.body.collectionId);

        for (const source of SOURCES) {
            const index = await getIndex(req.user.directories, collectionId, source, false);

            const exists = await index.isIndexCreated();

            if (!exists) {
                continue;
            }

            const path = index.folderPath;
            await index.deleteIndex();
            console.log(`Deleted vector index at ${path}`);
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});*/