import type { RequestHandler } from './$types';
import module from '../../../../transformers';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { text } = await request.json();

        if (!text) {
            return new Response(JSON.stringify({ error: 'Text is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const summary = await getTransformersSummary(text);
        return new Response(JSON.stringify({ summary }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
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
async function getTransformersSummary(text:string):Promise<number[]> {
    const pipe = await module.getPipeline('summarization');
    // biome-ignore lint/style/useNamingConvention: <explanation>
    const result = await pipe(text, {max_length:250, min_length:100, do_sample:false});
    const vector = Array.from(result.data as number[]);
    return vector;
}