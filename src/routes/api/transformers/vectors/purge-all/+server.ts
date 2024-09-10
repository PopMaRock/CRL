import type { RequestHandler } from './$types';
import path from 'path';
import fs from 'fs';
import { sanitizeFilename } from '$utilities/apiHelper';
import { SOURCES } from '../vectorHelper';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { directories } = await request.json();

        for (const source of SOURCES) {
            const sourcePath = path.join(directories.vectors, sanitizeFilename(source,true) as string);
            if (!fs.existsSync(sourcePath)) {
                continue;
            }
            await fs.promises.rm(sourcePath, { recursive: true });
            console.log(`Deleted vector source store at ${sourcePath}`);
        }

        return new Response('All sources purged successfully', { status: 200 });
    } catch (error) {
        console.error('Error purging sources:', error);
        return new Response('Failed to purge sources', { status: 500 });
    }
};