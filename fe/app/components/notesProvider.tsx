"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { Note, NoteDto} from "../types";
import FetchHelper from "../fetchHelper";

interface NoteListDto {
  state: "ready" | "pending" | "error";
  data: Note[] | null;
  error: any;
  // handlerMap?: { ... }
}

export const NoteListContext = createContext<NoteListDto | undefined>(
  undefined
);

interface NotesProviderProps {
  children: ReactNode;
}

const NotesProvider = ({ children }: NotesProviderProps) => {
  const [noteListDto, setNoteListDto] = useState<NoteListDto>({
    state: "ready",
    data: null,
    error: null,
  });

  async function handleLoad() {
    setNoteListDto((current) => {
      return { ...current, state: "pending" };
    });
    let result = await FetchHelper.note.list();

    // sorts data from newest to oldest
    const sortedResultData = result?.data?.sort((a: Note, b: Note) =>
      Date.parse(a.createdAt) > Date.parse(b.createdAt) ? -1 : 1
    );
    result.data = sortedResultData;

    setNoteListDto((current) => {
      if (result.ok) {
        return { ...current, state: "ready", data: result.data, error: null };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  // to launch load on visiting the Child component (notesUI)
  useEffect(() => {
    handleLoad();
  }, []);

/*
async function handleCreate(dtoIn: NoteDto) {
    setNoteListDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.note.create(dtoIn);
    setNoteListDto((current) => {
      if (result.ok) {
        current.data.itemList.push(result.data);
        // returns deep copy of current
        return {
          ...current, // Keeps all existing properties
          state: "ready", // Updates the state property
          // Updates the data property
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null, // Resets the error property
        };
      } else {
        // state needs to be ready on error or no data is shown
        return { ...current, state: "ready", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }
*/


  const value = {
    ...noteListDto,
    // handlerMap: { ... }
  };

  return (
    <NoteListContext.Provider value={value}>
      {children}
    </NoteListContext.Provider>
  );
};

export default NotesProvider;
