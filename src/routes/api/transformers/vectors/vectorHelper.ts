import { sanitizeFilename } from "$utilities/apiHelper";
import { join } from "path";
import { LocalIndex } from "vectra";
import module from '../../../../transformers';
import type { PipelineType } from "sillytavern-transformers";

// Don't forget to add new sources to the SOURCES array
 export const SOURCES = [
     'transformers',
 ];
/**
 * Gets the vector for the given text from the given source.
 * @param {string} source - The source of the vector
 * @param {Object} sourceSettings - Settings for the source, if it needs any
 * @param {string} text - The text to get the vector for
 * @param {boolean} isQuery - If the text is a query for embedding search
 * @param {import('../users').UserDirectoryList} directories - The directories object for the user
 * @returns {Promise<number[]>} - The vector for the text
 */
export async function getVector(source: string, sourceSettings: object, text: string, isQuery: boolean, directories: any) {
    switch (source) {
        case 'openai':
           // return require('../vectors/openai-vectors').getOpenAIVector(text, source, directories, sourceSettings.model);
        case 'transformers':
            return getTransformersVector(text);
    }
    throw new Error(`Unknown vector source ${source}`);
}

/**
 * Gets the index for the vector collection
 * @param {import('../users').UserDirectoryList} directories - User directories
 * @param {string} collectionId - The collection ID
 * @param {string} source - The source of the vector
 * @param {boolean} create - Whether to create the index if it doesn't exist
 * @returns {Promise<vectra.LocalIndex>} - The index for the collection
 */
export async function getIndex(directories: { vectors: any; }, collectionId: string, source: string, create = true) {
    const pathToFile = join(directories.vectors, sanitizeFilename(source, true) as string, sanitizeFilename(collectionId) as string);
    const store = new LocalIndex(pathToFile);

    if (create && !await store.isIndexCreated()) {
        await store.createIndex();
    }

    return store;
}

/**
 * Gets the vector for the given text batch from the given source.
 * @param {string} source - The source of the vector
 * @param {Object} sourceSettings - Settings for the source, if it needs any
 * @param {string[]} texts - The array of texts to get the vector for
 * @param {boolean} isQuery - If the text is a query for embedding search
 * @param {import('../users').UserDirectoryList} directories - The directories object for the user
 * @returns {Promise<number[][]>} - The array of vectors for the texts
 */
export async function getBatchVector(source: string, sourceSettings: object, texts: string | any[], isQuery: boolean, directories: any) {
    const batchSize = 10;
    const batches = Array(Math.ceil(texts.length / batchSize)).fill(undefined).map((_, i) => texts.slice(i * batchSize, i * batchSize + batchSize));

    let results = [];
    for (let batch of batches) {
        switch (source) {
            case 'transformers':
                results.push(...await getTransformersBatchVector(batch,'feature-extraction'));
                break;
            default:
                throw new Error(`Unknown vector source ${source}`);
        }
    }

    return results;
}

/**
 * Gets the vectorized text in form of an array of numbers.
 * @param {string} text - The text to vectorize
 * @returns {Promise<number[]>} - The vectorized text in form of an array of numbers
 */
export async function getTransformersVector(text:string, task:PipelineType='feature-extraction'):Promise<number[]> {
    const pipe = await module.getPipeline(task);
    const result = await pipe(text, { pooling: 'mean', normalize: true });
    const vector = Array.from(result.data as number[]);
    return vector;
}

/**
 * Gets the vectorized texts in form of an array of arrays of numbers.
 * @param {string[]} texts - The texts to vectorize
 * @returns {Promise<number[][]>} - The vectorized texts in form of an array of arrays of numbers
 */
export async function getTransformersBatchVector(texts: any, task:PipelineType='feature-extraction'):Promise<number[][]> {
    const result = [];
    for (const text of texts) {
        result.push(await getTransformersVector(text,task));
    }
    return result;
}

/**
 * Gets the hashes of the items in the vector collection
 * @param {import('../users').UserDirectoryList} directories - User directories
 * @param {string} collectionId - The collection ID
 * @param {string} source - The source of the vector
 * @returns {Promise<number[]>} - The hashes of the items in the collection
 */
export async function getSavedHashes(directories: any, collectionId: string, source: string) {
    const store = await getIndex(directories, collectionId, source);

    const items = await store.listItems();
    //@ts-ignore
    const hashes = items.map((x) => Number(x.metadata.hash));

    return hashes;
}
/**
 * Performs a request to regenerate the index if it is corrupted.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {Error} error Error object
 * @returns {Promise<any>} Promise
 */ //FIXME: Implement this function
export async function regenerateCorruptedIndexErrorHandler(collId:any,sour:any, error:any) {
    /*
    if (error instanceof SyntaxError && !req.query.regenerated) {
        let collectionId = String(collId);
        let source = String(sour) || 'transformers';

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
    */
}