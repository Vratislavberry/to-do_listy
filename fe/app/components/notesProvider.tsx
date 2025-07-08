"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { Note, NoteDto } from "../types";
import FetchHelper from "../fetchHelper";

interface NoteListDto {
  state: "ready" | "pending" | "error";
  data: Note[] | null;
  error: any;
  sort: "asc" | "desc";
  filter: { checked: boolean; unchecked: boolean };
  handlerMap?: {
    handleLoad: () => Promise<void>;
    handleCreate: (dtoIn: NoteDto) => Promise<{ ok: boolean; error?: any }>;
    handleUpdate: (dtoIn: NoteDto) => Promise<{ ok: boolean; error?: any }>;
    handleDelete: (dtoIn: NoteDto) => Promise<{ ok: boolean; error?: any }>;
    handleSortByDate: (sort: "asc" | "desc") => Promise<void>;
    handleFilterChange: (key: "checked" | "unchecked", value: boolean) => Promise<void>;
  };
}

export const NoteListContext = createContext<NoteListDto | undefined>(
  undefined
);

interface NotesProviderProps {
  children: ReactNode;
}

const NotesProvider = ({ children }: NotesProviderProps) => {
  const [noteListDto, setNoteListDto] = useState<NoteListDto>({
    state: "pending",
    data: null,
    error: null,
    sort: "desc", // default sorting order
    filter: { checked: true, unchecked: true },
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

  async function handleCreate(dtoIn: NoteDto) {
    setNoteListDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.note.create(dtoIn);
    setNoteListDto((current) => {
      if (result.ok) {
        let newData;
        if (current.data) {
          // If sort is "desc", newest first, add to start. If "asc", add to end.
          newData =
            current.sort === "desc"
              ? [result.data, ...current.data]
              : [...current.data, result.data];
        } else {
          newData = [result.data];
        }
        return {
          ...current,
          state: "ready",
          data: newData,
          error: null,
        };
      } else {
        // state needs to be ready on error or no data is shown
        return { ...current, state: "ready", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  async function handleUpdate(dtoIn: NoteDto) {
    setNoteListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.note.update(dtoIn);
    // finding index of updated item in the list
    setNoteListDto((current) => {
      if (result.ok && current.data) {
        const updatedData = current.data.map((item) =>
          item.id === dtoIn.id ? { ...item, ...dtoIn } : item
        );
        return {
          ...current,
          state: "ready",
          data: updatedData,
          error: null,
          pendingId: undefined,
        };
      } else {
        // state needs to be ready on error or no data is shown
        return {
          ...current,
          state: "ready",
          error: result.data,
          pendingId: undefined,
        };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  async function handleDelete(dtoIn: NoteDto) {
    setNoteListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.note.delete(dtoIn);
    setNoteListDto((current) => {
      if (result.ok && current.data) {
        const updatedData = current.data.filter((item) => item.id !== dtoIn.id);
        return {
          ...current,
          state: "ready",
          data: updatedData,
          error: null,
        };
      } else {
        // state needs to be ready on error or no data is shown
        return { ...current, state: "ready", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  // asc = oldest to newest
  // desc = newest to oldest
  async function handleSortByDate(newSort: "asc" | "desc" | null) {
    // used when data sort gets out of sync because of create/update/delete
    if (!newSort) {
      newSort = noteListDto.sort;
    }
    setNoteListDto((current) => {
      if (!current.data) return current;
      const sortedData = [...current.data].sort((a, b) =>
        newSort === "desc"
          ? Date.parse(a.createdAt) > Date.parse(b.createdAt)
            ? -1
            : 1
          : Date.parse(a.createdAt) > Date.parse(b.createdAt)
          ? 1
          : -1
      );
      return {
        ...current,
        data: sortedData,
        sort: newSort,
      };
    });
  }

  async function handleFilterChange(
    key: "checked" | "unchecked",
    value: boolean
  ) {
    setNoteListDto((current) => ({
      ...current,
      filter: { ...current.filter, [key]: value },
    }));
  }

  const value = {
    ...noteListDto,
    handlerMap: {
      handleLoad,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleSortByDate,
      handleFilterChange,
    },
  };

  return (
    <NoteListContext.Provider value={value}>
      {children}
    </NoteListContext.Provider>
  );
};

export default NotesProvider;
