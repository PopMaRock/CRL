import { Config, JsonDB } from 'node-json-db'
// https://www.npmjs.com/package/node-json-db
import type { RequestHandler } from './$types'
import { checkString, er, resp } from '$utilities/apiHelper'

/**
 * GET handler to fetch data from the database.
 *
 * @param {Object} request - The request object containing the parameters.
 * @param {string} request.db - The name of the database.
 * @param {string} request.collection - The collection to fetch data from the database.
 * @returns {Promise<Response>} - The response object with the fetched data or an error message.
 */
export const GET: RequestHandler = async ({ url }: any): Promise<Response> => {
	const db = url.searchParams.get('db')
	const collection = url.searchParams.get('collection')

	if (checkString(db) || checkString(collection)) {
		return resp({ error: er.badRequest.missing }, 400)
	}

	const dbCon = new JsonDB(new Config(`db/${db}`, true, false, '/'))
	if (!dbCon) {
		return resp({ error: er.serverFail.db }, 400)
	}

	if (!(await dbCon.exists(`/${collection}`))) {
		return resp({ error: 'empty' }, 404)
	}
	try {
		const data = await dbCon.getData(`/${collection}`)
		return resp(data, 200)
	} catch (error) {
		console.log('Error in GET: ', error)
		return resp({ error: 'Unable to fetch data' }, 500)
	}
}
/**
 * POST handler to save data to the database.
 *
 * @param {Object} request - The request object containing the parameters.
 * @param {string} request.db - The name of the database.
 * @param {string} request.collection - The collection to save data under in the database.
 * @param {Object} request.payload - The data to be saved in the database.
 * @returns {Promise<Response>} - The response object indicating the result of the operation.
 */
export const POST: RequestHandler = async ({ request }: any): Promise<Response> => {
	const body = await request.json()
	if (!body) return resp({ error: er.badRequest.missing }, 400)
	const { data, db, collection, method } = body

	console.log('POST request: ', body)

	if (checkString(db) || checkString(collection)) {
		return resp({ error: er.badRequest.missing }, 400)
	}

	if (typeof data !== 'object' || data === null || Array.isArray(data)) {
		return resp({ error: er.badRequest.nonObject }, 400)
	}

	const dbCon = new JsonDB(new Config(`db/${db}`, true, false, '/'))
	await dbCon.push(`/${collection}`, data)
	return resp({ status: 'Post complete' }, 200)
}
/**
 * PUT handler to add a new item to an array in the database.
 *
 * @param {Object} request - The request object containing the parameters.
 * @param {string} request.db - The name of the database.
 * @param {string} request.collection - The collection to add the new item under in the database.
 * @param {Object} request.payload - The new item to be added to the array in the database.
 * @returns {Promise<Response>} - The response object indicating the result of the operation.
 */
export const PUT: RequestHandler = async ({ request }: any): Promise<Response> => {
	const { db, collection, payload } = request

	if (checkString(db) || checkString(collection)) {
		return resp({ error: er.badRequest.missing }, 400)
	}

	if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
		return resp({ error: er.badRequest.missing }, 400)
	}

	const dbCon = new JsonDB(new Config(`db/${db}`, true, false, '/'))
	await dbCon.push(`/${collection}[]`, payload, true)
	return resp({ status: 'Item added' }, 200)
}
/**
 * Deletes a collection from the specified database.
 *
 * @param request - The request object containing the database and collection.
 * @returns {Promise<Response>}  A response indicating the success or failure of the delete operation.
 */
export const DELETE: RequestHandler = async ({ request }: any): Promise<Response> => {
	const { db, collection } = request

	if (checkString(db) || checkString(collection)) {
		return resp({ error: er.badRequest.missing }, 400)
	}

	const dbCon = new JsonDB(new Config(`db/${db}`, true, false, '/'))
	try {
		dbCon.delete(`/${collection}`)
		return resp({ status: 'Delete successful' }, 200)
	} catch (error) {
		console.log('Error in DELETE: ', error)
		return resp({ error: 'Unable to delete' }, 500)
	}
}
