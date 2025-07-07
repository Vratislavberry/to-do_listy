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

export const NoteListContext = createContext<NoteListDto | undefined>(undefined);

interface NotesProviderProps {
  children: ReactNode;
}

const NotesProvider = ({ children }: NotesProviderProps) => {
  const [noteListDto, setNoteListDto] = useState<NoteListDto>({
    state: "ready",
    data: null,
    error: null,
  });

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
