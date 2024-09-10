import type { RequestHandler } from './$types';
import module from '../../../../transformers';
import { resp } from '$utilities/apiHelper';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { text } = await request.json();
        if (!text) {
            return resp({ error: 'Text is required'},400);
        }
        const summary = await getTransformersSummary(text);
        return resp({ summary },200);
    } catch (error) {
        console.error("/api/transformers/summarise",error);
        return resp({ error: 'Failed to process request'},500);
    }
};

/**
 * Gets the vectorized text in form of an array of numbers.
 * @param {string} text - The text to vectorize
 * @returns {Promise<number[]>} - The vectorized text in form of an array of numbers
 */
async function getTransformersSummary(text:string):Promise<number[]> {
    const pipe = await module.getPipeline('summarization');
    //Throw shit at the pipe and see what sticks....
    const result = await pipe(text, {
        max_length: 250,          // Maximum length of the summary
        min_length: 150,          // Minimum length of the summary
        do_sample: false,          // Use sampling for diversity
        no_repeat_ngram_size: 3,  // Avoid repeating 3-grams
        num_beams: 6,             // Number of beams for beam search
        early_stopping: true      // Stop early if a good summary is found
    });
    //const vector = Array.from(result.data as number[]);
    return result;
}