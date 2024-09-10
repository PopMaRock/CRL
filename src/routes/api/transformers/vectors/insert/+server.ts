import { getBatchVector, getIndex } from '../vectorHelper';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { directories, collectionId, source, sourceSettings, items } = await request.json();

        if (!Array.isArray(items) || !collectionId) {
            return new Response('Bad Request', { status: 400 });
        }

        const validatedCollectionId = String(collectionId);
        const validatedItems = items.map((x: { hash: number; text: string; index: number; }) => ({ hash: x.hash, text: x.text, index: x.index }));
        const validatedSource = String(source) || 'transformers';
        const validatedSourceSettings = sourceSettings || {};

        await insertVectorItems(directories, validatedCollectionId, validatedSource, validatedSourceSettings, validatedItems);

        return new Response('Items inserted successfully', { status: 200 });
    } catch (error) {
        console.error('Error inserting items:', error);
        //return regenerateCorruptedIndexErrorHandler(req, res, error);
        return new Response('Failed to insert items', { status: 500 });
    }
};

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