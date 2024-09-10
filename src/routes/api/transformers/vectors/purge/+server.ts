import type { RequestHandler } from './$types';
import { getIndex, SOURCES } from '../vectorHelper';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { directories, collectionId } = await request.json();

        if (!collectionId) {
            return new Response('Bad Request', { status: 400 });
        }

        const validatedCollectionId = String(collectionId);

        for (const source of SOURCES) {
            const index = await getIndex(directories, validatedCollectionId, source, false);

            const exists = await index.isIndexCreated();

            if (!exists) {
                continue;
            }

            const indexPath = index.folderPath;
            await index.deleteIndex();
            console.log(`Deleted vector index at ${indexPath}`);
        }

        return new Response('All indices purged successfully', { status: 200 });
    } catch (error) {
        console.error('Error purging indices:', error);
        return new Response('Failed to purge indices', { status: 500 });
    }
};