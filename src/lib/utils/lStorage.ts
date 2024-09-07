import { browser } from '$app/environment';
import { PUBLIC_ALLOW_CACHE } from '$env/static/public';

function set(key: string, value: any, ttl = 300, force=false) {
	if(PUBLIC_ALLOW_CACHE === 'false' && !force) return;
	//default to 5 minutes
	const now = new Date().getTime();
	const expiry = now + ttl * 1000; // convert ttl to milliseconds
	const item = {
		value: value,
		expiry: expiry
	};
	if (browser) {
		window.localStorage.setItem(key, JSON.stringify(item));
	}
}
function get(key: string, force=false) {
	if(PUBLIC_ALLOW_CACHE === 'false' && !force) return null;
	let item: any;

	if (browser) {
		//clean up expired items
		cleanStorage(); // clean up storage.
		const itemStr = window.localStorage.getItem(key);
		// if the item doesn't exist, return null
		if (!itemStr) {
			return null;
		}
		item = JSON.parse(itemStr);
		const now = new Date().getTime();
		// compare the expiry time of the item with the current time
		if (now > item.expiry) {
			console.log(`${now} > ${item.expiry}`);
			// If the item is expired, delete the item from storage
			// and return null
			window.localStorage.removeItem(key);
			return null;
		}
		//console.log('item.value', item.value);
	}

	return item?.value || {};
}
function cleanStorage() {
	// Get the current time
	const now = new Date().getTime();
	// Iterate over all items in the localStorage
	for (let i = 0; i < localStorage.length; i++) {
		// Get key for the current item
		const key = localStorage.key(i);
		if (key) {
			// Get the item from the localStorage
			const itemStr = localStorage.getItem(key);
			if (itemStr) {
				// Parse the item
				const item = JSON.parse(itemStr);
				if(!item.expiry) continue;
				// If the item is expired, remove it from the localStorage
				if (now > item.expiry) {
					console.log(`EXPIRED ${key}. Removing....`);
					localStorage.removeItem(key);
				}
			}
		}
	}
}
function clear() {
	if(PUBLIC_ALLOW_CACHE === 'false') return;
	if (browser) {
		window.localStorage.clear();
	}
}
function remove(key: string, force=false) {
	if(PUBLIC_ALLOW_CACHE === 'false' && !force) return;
	if (browser) {
		window.localStorage.removeItem(key);
	}
}
export const lStorage = {
	set,
	get,
	remove,
	clear
};
