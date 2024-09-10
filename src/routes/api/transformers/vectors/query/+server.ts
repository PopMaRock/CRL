import { getIndex, getVector, regenerateCorruptedIndexErrorHandler } from '../vectorHelper';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
    try {
        const { directories, collectionId, source, sourceSettings, searchText, topK, threshold } = await request.json();

        if ((!collectionId || (Array.isArray(collectionId) && collectionId.length === 0)) || !searchText) {
            return new Response('Bad Request', { status: 400 });
        }

        const validatedSearchText = String(searchText);
        const validatedTopK = Number(topK) || 10;
        const validatedThreshold = Number(threshold) || 0.0;
        const validatedSource = String(source) || 'transformers';
        const validatedSourceSettings = sourceSettings || {};

        let result: any;
        if (Array.isArray(collectionId)) {
            // Perform multi-query
            result = await multiQueryCollection(directories, collectionId, validatedSource, validatedSourceSettings, validatedSearchText, validatedTopK, validatedThreshold);
        } else {
            // Perform single query
            result = await queryCollection(directories, String(collectionId), validatedSource, validatedSourceSettings, validatedSearchText, validatedTopK, validatedThreshold);
        }

        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error querying collection:', error);
        //return regenerateCorruptedIndexErrorHandler(collectionId,validatedSource, error);
        return new Response('Failed to query collection', { status: 500 });
    }
};

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