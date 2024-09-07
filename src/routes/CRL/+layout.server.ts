import { redirect } from "@sveltejs/kit";

export async function load({ url, locals }: { url: any; locals: any }) {
  console.log("locals from layout.server.ts", locals.user);
  if (locals.user) {
    const { uid, name } = locals.user; // comes from +layout.server.ts
    if (!uid) {
      //redirect to home page
      console.log("no uid redirecting to login page");
      throw redirect(307, "/login");
    }
    if (!name) {
      //redirect to home page
      console.log("no name redirecting to login page");
      throw redirect(307, "/login");
    }
    return {
      url: url.pathname,
    };
  }
  //redirect to login page
  console.log("no user redirecting to login page");
  throw redirect(307, "/login");
}
function redirectGeeza() {
  //for when the cunts are lost. Try find where they're meant to be or punt them somewhere else.
  //redirect to home page
  throw redirect(307, "/CRL");
}
