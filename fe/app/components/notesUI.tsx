"use client";
import { useState, useEffect, useContext } from "react";
import FetchHelper from "../fetchHelper";
import { Row, Col, Button } from "react-bootstrap";
import { Note, NoteDto } from "../types";

import { NoteListContext } from "./notesProvider";
import PendingItem from "./pendingItem";

const NotesUI = () => {
  const context = useContext(NoteListContext);
  const { state, data, handlerMap } = context ?? { state: "pending", data: [] };
  const [noteList, setNoteList] = useState<Note[]>([
    {
      id: "1",
      title: "temp",
      createdAt: "2023-10-01T12:00:00Z",
      updatedAt: "2023-10-01T12:00:00Z",
    },
    {
      id: "2",
      title: "dummy",
      createdAt: "2023-10-02T12:00:00Z",
      updatedAt: "2023-10-02T12:00:00Z",
    },
  ]);

  const getNotes = async () => {
    const result = await FetchHelper.note.list();
    if (result.ok) {
      setNoteList(result.data); // Update state with fetched notes
    } else {
      console.error("Error:", result.status);
    }
  };

  const createNote = async (dtoIn: NoteDto) => {
    const result = await FetchHelper.note.create(dtoIn);
    if (result.ok) {
      // Append new note to the list
      setNoteList((current) => [...current, result.data]);
    } else {
      console.error("Error creating note:", result.status);
    }
  };

  const updateNote = async (dtoIn: NoteDto) => {
    const result = await FetchHelper.note.update(dtoIn);
    if (result.ok) {
      // Update the note in the list
      setNoteList((current) =>
        current.map((note) => (note.id === dtoIn?.id ? result.data : note))
      );
    } else {
      console.error("Error updating note:", result.status);
    }
  };

  const deleteNote = async (dtoIn: NoteDto) => {
    const result = await FetchHelper.note.delete(dtoIn);
    if (result.ok) {
      // Remove the note from the list
      setNoteList((current) => current.filter((note) => note.id !== dtoIn.id));
    } else {
      console.error("Error deleting note:", result.status);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      <Row>
        {noteList.map((note) => (
          <Col sm="4" key={note.id}>
            {note.title}
          </Col>
        ))}

        <Button
          onClick={() => {
            createNote({
              title: "Created Note",
              createdAt: "2023-10-02T12:00:00Z",
              updatedAt: "2023-10-02T12:00:00Z",
            });
          }}
        >
          Create
        </Button>

        <Button
          onClick={() => {
            updateNote({
              id: "408c",
              title: "Updated Note 2",
              createdAt: "2023-10-02T12:00:00Z",
              updatedAt: "2023-10-02T12:00:00Z",
            });
          }}
        >
          Update
        </Button>

        <Button
          onClick={() => {
            deleteNote({
              id: "f05f",
              title: "Updated Note 2",
              createdAt: "2023-10-02T12:00:00Z",
              updatedAt: "2023-10-02T12:00:00Z",
            });
          }}
        >
          Delete
        </Button>

        <Button
          onClick={() => {
            console.log("Logging data:", state, data);
          }}
        >
          log data
        </Button>
      </Row>

      <Row>
        <p>Nová data:</p>
        {state === "pending" ? <PendingItem /> : null}

        {state === "ready"
          ? data?.map((note) => (
              <Col sm="4" key={note.id}>
                {note.title}
              </Col>
            ))
          : null}

        <Button
          onClick={() => {
            handlerMap?.handleCreate({
              title: "Created Note",
              createdAt: "2023-10-02T12:00:00Z",
              updatedAt: "2023-10-02T12:00:00Z",
            });
          }}
        >
          Create
        </Button>
      </Row>
    </>
  );
};

export default NotesUI;
