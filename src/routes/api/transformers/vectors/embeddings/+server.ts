import type { RequestHandler } from './$types';
import { getTransformersVector } from '../vectorHelper';
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


//##############################################################################################
