import { resp } from '$utilities/apiHelper';
import type { RequestHandler } from '@sveltejs/kit';
import pkg from 'american-british-english-translator'; //fuckin massive
const {Translator} = pkg;

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
    // Get JSON string from request
    const json = await request.json();
    // Extract the string to be translated
    const str = json.str;
    // Translate the string
    const translatedStr = Translator.translate(str, { British: true });
    // Return the translated string in the response
    return resp(translatedStr, 200 );
};