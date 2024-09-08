import { VITE_OPENAI_API_KEY } from '$env/static/private';
import { resp } from '$utilities/apiHelper';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const apiKey = VITE_OPENAI_API_KEY;
    if (!apiKey) {
        return resp({error:'OpenAI API key is missing'}, 500 );
    }
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                // biome-ignore lint/style/useNamingConvention: <the hell are you on biome? Retard.>
                'Authorization': `Bearer ${apiKey}`
            }
        });
        if (!response.ok) {
            return resp({error:'Failed to connect to OpenAI'}, response.status );
        }
        return resp({content:'OpenAI settings are correct'},  200 );
    } catch (error) {
        return resp({error:'Error connecting to OpenAI'}, 500);
    }
};