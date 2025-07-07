"use client";
import { useState, useEffect } from "react";
import FetchHelper from "../fetch-helper";
import { Row, Col } from "react-bootstrap";

interface Note {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const NotesUI = () => {
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

  useEffect(() => {
    const fetchNotes = async () => {
      const result = await FetchHelper.note.list();
      if (result.ok) {
        setNoteList(result.data); // Update state with fetched notes
      } else {
        console.error("Error:", result.status);
      }
    };
    fetchNotes();
  }, []);

  return (
    <Row>
      {noteList.map((note) => (
        <Col sm="4" key={note.id}>
          {note.title}
        </Col>
      ))}
    </Row>
  );
};

export default NotesUI;
