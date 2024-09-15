import type { RequestHandler } from './$types';
import module from '../../../../transformers';
import { resp } from '$utilities/apiHelper';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { text } = await request.json();
        if (!text) {
            return resp({ error: 'Text is required'},400);
        }
        const sentiment = await getTransformersSentiment(text);
        return resp({ sentiment }, 200);
    } catch (error) {
        console.error("/api/transformers/sentiment",error);
        return resp({ error: 'Failed to process request'},500);
    }
};

/**
 * Gets the vectorized text in form of an array of numbers.
 * @param {string} text - The text to vectorize
 * @returns {Promise<number[]>} - The vectorized text in form of an array of numbers
 */
async function getTransformersSentiment(text:string):Promise<number[]> {
    const pipe = await module.getPipeline('text-classification');
    //Throw shit at the pipe and see what sticks....
    const result = await pipe(text, { topk: 5 });
    result.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);
    //const vector = Array.from(result.data as number[]);
    return result;
}