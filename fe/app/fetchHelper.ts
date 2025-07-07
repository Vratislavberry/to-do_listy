import { NoteDto, Method } from "./types";

async function Call(baseUri: string, useCase: string, dtoIn: NoteDto | null, method: Method) {
  // return fetch
  let response;
  // if method is falsy (NaN, undefined) or "GET"
  // clearer: (!method || (method === "get"))
  if (!method || method === "get") {
    response = await fetch(
      `${baseUri}/${useCase}${
        // sends dtoIn if exists && contains keys, else ""
        dtoIn && Object.keys(dtoIn).length 
          ? `?${new URLSearchParams(dtoIn as Record<string, string>)}`
          : ""
      }`
    );
  // if method is "POST", "PUT" or "DELETE"
  } else {
    response = await fetch(`${baseUri}/${useCase}`, {
      method: method.toUpperCase(),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
  }
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}




const baseUri = "http://localhost:4000";
const FetchHelper = {
  note: {
    create: async (dtoIn: NoteDto) => {
      return await Call(baseUri, "notes", dtoIn, "post");
    },
    list: async () => {
      return await Call(baseUri, "notes", null, "get");
    },
    update: async (dtoIn: NoteDto) => {
      return await Call(baseUri, `notes/${dtoIn?.id}`, dtoIn, "put");
    },
    delete: async (dtoIn: NoteDto) => {
      return await Call(baseUri, `notes/${dtoIn?.id}`, dtoIn, "delete");
    },

  },

  entry: {
    create: async (dtoIn: NoteDto) => {
      return await Call(baseUri, "group/create", dtoIn, "post");
    },
    listByNoteId: async (dtoIn: NoteDto) => {
      return await Call(baseUri, "entries", null, "get");
    },
    update: async (dtoIn: NoteDto) => {
      return await Call(baseUri, "group/update", dtoIn, "post");
    },
    delete: async (dtoIn: NoteDto) => {
      return await Call(baseUri, "group/delete", dtoIn, "post");
    }
  },
};

export default FetchHelper;
