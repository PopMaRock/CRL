import { redirect } from '@sveltejs/kit';

export async function load({ locals, cookies }: { locals: any; cookies:any }) {
	try {
		return { user: locals.user }
	} catch (e) {
		console.error(e);
		cookies.delete('token', { path: '/' });
		cookies.delete('session', { path: "/" });
		return redirect(307, "/login"); //Will go here if an ERROR is thrown
	}
}
