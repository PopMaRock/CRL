import { redirect } from '@sveltejs/kit';
import cookie from 'cookie';

export const handle = async ({ event, resolve }) => {
	//console.log('Hooks begin');
	let session: any = null;
	let user = null;
	let token = null;
	try {
		token = event.cookies.get('token');
		user = {uid:'0123445', name:'Vince'};
	} catch (e) {
		console.log('error', e);
	}
	if (user !== null) {
		//console.log('token', token);
		try {
			const cookies = cookie.parse(event.request.headers.get('cookie') || '');
			const sessionCookie = cookies.session ? JSON.parse(cookies.session) : null;
			if (!sessionCookie) {
				console.log('no session cookie');
				const userData: any = await getUser(user.uid);
				if (userData) {
					session = { user: { uid: user.uid, name: user.name } };
				} else {
					// remove session cookie if user does not exist
					event.locals = {};
					if (!event.request.url.includes('login')) {
						if (event.params.tenant) {
							throw redirect(307, "/login");
						}
						throw redirect(307, '/login');
					}
				}
			} else {
				console.log('session cookie exists');
				session = sessionCookie;
			}
		} catch (error) {
			console.error('Error verifying ID token:', error);
			//clear cookies
			event.cookies.delete('token', { path: '/' });
			event.cookies.delete('session', { path: "/" }); //delete session cookie
		}
	}

	event.locals = { user: session?.user ?? {} }; // Make session available to server-side components
	const response = await resolve(event);

	if (session) {
		response.headers.set('Set-Cookie', `session=${JSON.stringify(session)}; Path=/; HttpOnly`);
	}

	return response;
};
async function getUser(uid: string) {
	console.log('hitting the database for user...');
	return true;
}
