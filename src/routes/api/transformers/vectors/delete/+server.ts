import { getIndex } from '../vectorHelper';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { directories, collectionId, source, hashes } = await request.json();

        if (!Array.isArray(hashes) || !collectionId) {
            return new Response('Bad Request', { status: 400 });
        }

        const validatedCollectionId = String(collectionId);
        const validatedHashes = hashes.map((x: any) => Number(x));
        const validatedSource = String(source) || 'transformers';

        await deleteVectorItems(directories, validatedCollectionId, validatedSource, validatedHashes);

        return new Response('Items deleted successfully', { status: 200 });
    } catch (error) {
        console.error('Error deleting items:', error);
        //return regenerateCorruptedIndexErrorHandler(req, res, error);
        return new Response('Failed to delete items', { status: 500 });
    }
};

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