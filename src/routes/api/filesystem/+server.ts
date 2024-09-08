import type { RequestHandler } from './$types';
import { readdir } from 'fs/promises';
import { join } from 'path';

export const GET: RequestHandler = async ({ url }) => {
    const path = url.searchParams.get('path');

    if (!path || !path.startsWith('/static/crl-images')) {
        return new Response(JSON.stringify({ error: 'Invalid path' }), { status: 400 });
    }

    try {
        const fullPath = join(process.cwd(), path);
        const files = await readdir(fullPath);
        const imageFiles = files.filter(file => /\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(file));

        return new Response(JSON.stringify({ images: imageFiles }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error reading directory' }), { status: 500 });
    }
};