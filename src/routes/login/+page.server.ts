

export async function load({ cookies }) {
    // Delete the 'session' cookie
    cookies.set('session', '', { maxAge: -1, path: '/' });
    //console.log('Cookies:', cookies);
    return {
        props: {}
    };
}