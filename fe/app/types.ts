export interface Note {
  id: string;
  title: string;
  createdAt: string;
  textDetail: string;
  state: "checked" | "unchecked";
}

// note with optional properties
export interface NoteDto {
  id?: string;
  title?: string;
  createdAt?: string;
  textDetail?: string;
  state?: "checked" | "unchecked";
}

// all possible methods for API calls
export type Method = "get" | "post" | "put" | "delete";

export type noteState = "checked" | "unchecked";