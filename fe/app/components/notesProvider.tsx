"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { Note } from "../types";
import FetchHelper from "../fetchHelper";

interface NoteListDto {
  state: "ready" | "pending" | "error";
  data: any;
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

  // to launch load on visiting the Child component (Dashboard)
  useEffect(() => {
    handleLoad();
  }, []);

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
