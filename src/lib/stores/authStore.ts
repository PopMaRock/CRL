import { writable } from 'svelte/store';
import cookie from 'cookie';
import { browser } from '$app/environment';
//import { lStorage } from '$utilities/lStorage';
import { goto } from '$app/navigation';
//https://steveolensky.medium.com/persist-your-svelte-store-between-page-refreshes-in-a-few-lines-of-code-8dc36fc926a6

const boilerUser = {
	name:  'McGee',
	password: '',
	isGuest: true,
	lastLogin: Date.now(),
};
interface AuthStoreValue {
	isLoading: boolean;
	currentUser: any;
}
export const authStore = writable<AuthStoreValue>({
	isLoading: true,
	currentUser: null
});

/*
const unsubscribe = auth.onAuthStateChanged((user) => {
	if (user) {
		authStore.update((curr: any) => {
			return {
				isLoading: false,
				currentUser: user
			};
		});
	} else {
		authStore.update(() => {
			return { isLoading: false, currentUser: null };
		});
	}
});*/

export const authHandlers = {
	login: async (email: string, password: string) => {
		try {
			//fetch data api for user
			const user= null;
			//const user = userCredential.user;
			if (user) {
				authStore.update((store: any) => {
					return {
						...store,
						currentUser: user
					};
				});
			}
			else {
				throw new Error("auth/user-not-found");
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	register: async (email: string, password: string) => {
		try {
			const user= null;
			const userCredential = ''; //create user
			//const user = userCredential.user;
			await authStore.update((store: any) => {
				return {
					...store,
					currentUser: user
				};
			});
			const mbp = boilerUser;
			//await authHandlers.setProfile(user.uid, mbp); //go set the profile pal
			return user;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	logout: async (tenant: string) => {
		try {
			//await signOut(auth); api/data/user - signout
			authStore.update((store: any) => {
				//Get all the local storage tae fuck man. Nae fuckin aboot.
				//lStorage.clear();
				return {
					...store,
					currentUser: null
				};
			});
			goto("/login", { invalidateAll: true });
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	logoutAndRedirect: async (tenant: string) => {
		try {
			//await signOut(auth); api/data/user - signout
			authStore.update((store: any) => {
				//Get all the local storage tae fuck man. Nae fuckin aboot.
				//lStorage.clear();
				return {
					...store,
					currentUser: null
				};
			});
			goto("/login", { invalidateAll: true });
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
	updatePassword: async (password: string) => {
		try {
			const user= null;
			//const user = auth.currentUser;
			if (user) {
				//await updatePassword(auth.currentUser, password);
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	updateUserProfileImage: async (file: string) => {
		try {
			const user= null;
			//const user = auth.currentUser;
			if (user) {
				//await updateProfile(user, {
				//	photoURL: file
				//});
				//await user.reload();
				authStore.update((store: any) => {
					return {
						...store,
						currentUser: user
					};
				});
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
};

if (browser) {
	/*auth.onIdTokenChanged(async (newUser) => {
		const tokenCurrentlySet = cookie.parse(document.cookie).token !== undefined;
		const token = newUser ? await newUser?.getIdToken() : undefined;
		document.cookie = cookie.serialize('token', token ?? '', {
			path: '/',
			maxAge: token ? undefined : 0
		});
		authStore.set({
			isLoading: false,
			currentUser: newUser
		});

		if (!tokenCurrentlySet && token) {
			await fetch('/', {
				headers: {
					'Cache-Control': 'no-cache'
				}
			});
		}
	});
	
	// refresh the ID token every 10 minutes
	setInterval(async () => {
		if (auth.currentUser) {
			await auth.currentUser.getIdToken(true);
		}
	}, 10 * 60 * 1000);*/
}
