import { Config, JsonDB } from "node-json-db";
// https://www.npmjs.com/package/node-json-db
import type { RequestHandler } from "./$types";
import { checkString, er, resp } from "$utilities/apiHelper";

/**
 * GET handler to fetch data from the database.
 *
 * @param {Object} request - The request object containing the parameters.
 * @param {string} request.db - The name of the database.
 * @param {string} request.collection - The collection to fetch data from the database.
 * @param {string} request.id - The id of the item to fetch from the collection.
 * @returns {Promise<Response>} - The response object with the fetched data or an error message.
 */
export const GET: RequestHandler = async ({ url }: any): Promise<Response> => {
  const db = url.searchParams.get("db");
  const collection = url.searchParams.get("collection");
  const id = url.searchParams.get("id");
  //console.log("GET: ", db, collection, id);

  if (!db) {
    return resp({ error: `Missing database name ${er.badRequest}` }, 400);
  }

  const dbCon = new JsonDB(new Config(`db/${db}`, true, false, "/"));
  if (!dbCon) {
    return resp({ error: er.serverFail.db }, 400);
  }

  try {
    let data:any;
    if (!collection) {
      // Return all data from the database if no collection is specified
      data = await dbCon.getData("/");
    } else {
      const path = id ? `/${collection}/${id}` : `/${collection}`;
      if (!(await dbCon.exists(path))) {
        return resp({ error: id ? "not found" : "empty" }, 404);
      }
      data = await dbCon.getData(path);
    }
   //console.log("Data: ", data);
    return resp(data, 200);
  } catch (error) {
    console.error("Error in GET: ", error);
    return resp({ error: "Unable to fetch data" }, 500);
  }
};
/**
 * POST handler to save data to the database.
 *
 * @param {Object} request - The request object containing the parameters.
 * @param {string} request.db - The name of the database.
 * @param {string} request.collection - The collection to save data under in the database.
 * @param {Object} request.data - The data to be saved in the database.
 * @returns {Promise<Response>} - The response object indicating the result of the operation.
 */
export const POST: RequestHandler = async ({
  request,
}: any): Promise<Response> => {
  try {
    const body = await request.json();
    if (!body) return resp({ error: er.badRequest.missing }, 400);
    const { data, db, collection } = body;

    if (!db || !data) {
      console.log("missing parameters");
      return resp({ error: "Missing parameters --DB POST" }, 400);
    }

    if (data === null) {
      console.log("data is invalid --DB POST");
      return resp({ error: er.badRequest.nonObject }, 400);
    }

    const dbCon = new JsonDB(new Config(`db/${db}`, true, false, "/"));
    const path = collection ? `/${collection}` : "/";
    await dbCon.push(path, data);
    return resp({ status: "Post complete" }, 200);
  } catch (error) {
    console.log("Error in POST: ", error);
    return resp({ error: "Internal Server Error" }, 500);
  }
};
/**
 * PUT handler to update data in the database.
 *
 * @param {Object} request - The request object containing the parameters.
 * @param {string} request.db - The name of the database.
 * @param {string} request.collection - The collection to update data under in the database.
 * @param {string} request.id - The ID of the document to update.
 * @param {Object} request.data - The data to be updated in the database.
 * @returns {Promise<Response>} - The response object indicating the result of the operation.
 */
export const PUT: RequestHandler = async ({
  request,
}: any): Promise<Response> => {
  const { db, collection, id, data } = await request.json();

  if (!db || !collection || !id || !data) {
    return new Response(JSON.stringify({ error: "Missing parameters" }), {
      status: 400,
    });
  }
  /*if (!checkString(db) || checkString(collection)) {
    return new Response(JSON.stringify({ error: "Invalid parameters" }), {
      status: 400,
    });
  }*/

  const dbCon = new JsonDB(new Config(`db/${db}`, true, false, "/"));
  if (!dbCon) {
    return new Response(
      JSON.stringify({ error: "Database connection failed" }),
      { status: 500 }
    );
  }

  try {
    const path = `/${collection}/${id}`;
    /*if (!(await dbCon.exists(path))) {
      return new Response(JSON.stringify({ error: "Document not found" }), {
        status: 404,
      });
    }*/

    await dbCon.push(path, data, false);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.log("Error in DB PUT: ", error);
    return new Response(JSON.stringify({ error: "Unable to update data" }), {
      status: 500,
    });
  }
};
/**
 * Deletes a collection or a specific item from the specified database.
 *
 * @param request - The request object containing the database, collection, and optional id.
 * @returns {Promise<Response>} A response indicating the success or failure of the delete operation.
 */
export const DELETE: RequestHandler = async ({
  request,
}: any): Promise<Response> => {
  const { db, collection, id } = await request.json();

  if (checkString(db)) {
    return resp({ error: er.badRequest.missing }, 400);
  }

  const dbCon = new JsonDB(new Config(`db/${db}`, true, false, "/"));
  if (!dbCon) {
    return resp({ error: er.serverFail.db }, 500);
  }

  try {
    if (collection && id) {
      // Delete a specific item within the collection
      const path = `/${collection}/${id}`;
      if (!(await dbCon.exists(path))) {
        return resp({ error: "Document not found" }, 404);
      }
      dbCon.delete(path);
      return resp({ status: "Delete successful" }, 200);
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (collection) {
      // Delete the entire collection
      const path = `/${collection}`;
      if (!(await dbCon.exists(path))) {
        return resp({ error: "Collection not found" }, 404);
      }
      dbCon.delete(path);
      return resp({ status: "Delete collection successful" }, 200);
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      // Delete the entire database
      dbCon.delete("/");
      return resp({ status: "Delete database successful" }, 200);
    }
  } catch (error) {
    console.log("Error in DB DELETE: ", error);
    return resp({ error: "Unable to delete" }, 500);
  }
};
/**
 * HEAD handler to check if data exists in the database.
 *
 * @param {Object} request - The request object containing the parameters.
 * @param {string} request.db - The name of the database.
 * @param {string} request.collection - The collection to check data under in the database.
 * @param {string} request.id - The ID of the document to check.
 * @returns {Promise<Response>} - The response object indicating the result of the existence check.
 */
export const HEAD: RequestHandler = async ({ url }: any): Promise<Response> => {
  const db = url.searchParams.get("db");
  const collection = url.searchParams.get("collection");
  const id = url.searchParams.get("id");

  if (checkString(db) || checkString(collection)) {
    return new Response(null, {
      status: 400,
      statusText: "Bad Request: Missing parameters",
    });
  }

  const dbCon = new JsonDB(new Config(`db/${db}`, true, false, "/"));
  if (!dbCon) {
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error: Database connection failed",
    });
  }

  try {
    const path = id ? `/${collection}/${id}` : `/${collection}`;
    if (!(await dbCon.exists(path))) {
      return new Response(null, {
        status: 404,
        statusText: id
          ? "Not Found: Document not found"
          : "Not Found: Collection not found",
      });
    }
    return new Response(null, { status: 200, statusText: "OK" });
  } catch (error) {
    console.log("Error in DB HEAD: ", error);
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error: Unable to check data",
    });
  }
};
