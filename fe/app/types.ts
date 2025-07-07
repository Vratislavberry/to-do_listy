export interface Note {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// note with optional properties
export interface NoteDto {
  id?: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

// all possible methods for API calls
export type Method = "get" | "post" | "put" | "delete";