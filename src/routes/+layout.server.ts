import { redirect } from '@sveltejs/kit';
import { getConfig } from '$lib/config';

export async function load({ locals, cookies }: { locals: any; cookies: any }) {
    try {
        const config = getConfig();

        return { user: locals.user, config };
    } catch (e) {
        console.error(e);
        cookies.delete('token', { path: '/' });
        cookies.delete('session', { path: '/' });
        return redirect(307, '/login'); // Will go here if an ERROR is thrown
    }
}