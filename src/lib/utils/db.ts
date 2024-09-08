//database management
/**
 * Fetches a specific document from a collection in the specified database.
 *
 * @param {string} db - The name of the database.
 * @param {string} collection - The name of the collection within the database.
 * @param {string} id - The ID of the document to fetch.
 * @param {string} url - The base URL to use for the request.
 * @returns {Promise<any>} A promise that resolves to the fetched document data.
 */
export async function dbGet(payload: {
  db: string;
  collection?: string;
  id?: string;
  url?: string;
}): Promise<any> {
  const { db, collection, id, url } = payload;
  const apiUrl = url? new URL('/api/data', url) : new URL('/api/data', window.location.origin);
  apiUrl.searchParams.append('db', db);
  if (collection) {
    apiUrl.searchParams.append('collection', collection);
  }
  if (id) {
    apiUrl.searchParams.append('id', id);
  }

  const response = await fetch(apiUrl.toString());
  return response.json();
}
/**
 * Adds a new document to a collection in the specified database, or directly to the database if no collection is specified.
 *
 * @param {string} db - The name of the database.
 * @param {string} [collection] - The name of the collection within the database. Optional.
 * @param {any} data - The data to be added to the collection or database.
 * @returns {Promise<any>} A promise that resolves to the response from the server.
 */
export async function dbSet(payload: {
  db: string;
  collection?: string;
  data: any;
}): Promise<any> {
  const { db, collection, data } = payload;

  const response = await fetch("/api/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ db, collection, data }),
  });
  return response.json();
}
/**
 * Updates a document in the specified database and collection with the given data.
 *
 * @param {string} db - The name of the database.
 * @param {string} collection - The name of the collection within the database.
 * @param {string} id - The unique identifier of the document to update.
 * @param {any} data - The data to update the document with.
 * @returns {Promise<any>} A promise that resolves to the response of the update operation.
 */
export async function dbUpdate(
  db: string,
  collection: string,
  id: string,
  data: any
): Promise<any> {
  const response = await fetch("/api/data", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ db, collection, id, data }),
  });
  return response.json();
}
/**
 * Fetches a list of documents from a collection in the specified database.
 *
 * @param {string} db - The name of the database.
 * @param {string} collection - The name of the collection within the database.
 * @returns {Promise<any>} A promise that resolves to the list of documents in the collection.
 */
export async function dbList(db: string, collection: string): Promise<any> {
  const response = await fetch(`/api/data?db=${db}&collection=${collection}`);
  return response.json();
}
/**
 * Removes a specific document from a collection in the specified database.
 *
 * @param {string} db - The name of the database.
 * @param {string} collection - The name of the collection within the database.
 * @param {string} id - The ID of the document to remove.
 * @returns {Promise<any>} A promise that resolves to the response from the server.
 */
export async function dbRemove(
  db: string,
  collection: string,
  id: string
): Promise<any> {
  const response = await fetch("/api/data", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ db, collection, id }),
  });
  return response.json();
}
/**
 * Deletes a specified collection from a given database.
 *
 * @param db - The name of the database from which the collection will be deleted.
 * @param collection - The name of the collection to delete.
 * @returns A promise that resolves to the response of the delete operation.
 */
export async function dbDeleteCollection(
  db: string,
  collection: string
): Promise<any> {
  const response = await fetch("/api/data", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ db, collection }),
  });
  return response.json();
}
/**
 * Deletes a database by sending a DELETE request to the server.
 *
 * @param db - The name of the database to delete.
 * @returns A promise that resolves to the response from the server.
 */
export async function dbDeleteDb(db: string): Promise<any> {
  const response = await fetch("/api/data", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ db }),
  });
  return response.json();
}
/**
 * Checks if a document exists in a specified database collection.
 *
 * @param db - The name of the database.
 * @param collection - The name of the collection within the database.
 * @param id - The unique identifier of the document.
 * @returns A promise that resolves to a boolean indicating whether the document exists.
 */
export async function dbExists(
  db: string,
  collection: string,
  id: string
): Promise<any> {
  const response = await fetch(
    `/api/data?db=${db}&collection=${collection}&id=${id}`,
    { method: "HEAD" }
  );
  return response.ok;
}
