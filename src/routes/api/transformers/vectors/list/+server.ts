import type { RequestHandler } from './$types';
import { getSavedHashes } from '../vectorHelper';

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
    try {
        const { directories, collectionId, source } = await request.json();

        if (!collectionId) {
            return new Response('Bad Request', { status: 400 });
        }

        const validatedCollectionId = String(collectionId);
        const validatedSource = String(source) || 'transformers';

        const hashes = await getSavedHashes(directories, validatedCollectionId, validatedSource);
        return new Response(JSON.stringify(hashes), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error retrieving hashes:', error);
        //return regenerateCorruptedIndexErrorHandler(req, res, error);
        return new Response('Failed to retrieve hashes', { status: 500 });
    }
};