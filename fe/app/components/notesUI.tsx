"use client";
import { useState, useEffect, useContext } from "react";
import FetchHelper from "../fetchHelper";
import { Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { Note, NoteDto } from "../types";

import Icon from "@mdi/react";
import { mdiRadioboxBlank, mdiRadioboxMarked } from "@mdi/js";

import { NoteListContext } from "./notesProvider";
import PendingItem from "./pendingItem";
import NoteForm from "./NoteForm";

const NotesUI = () => {
  const context = useContext(NoteListContext);
  const { state, data, handlerMap } = context ?? { state: "pending", data: [] };
  const [noteFormData, setNoteFormData] = useState<NoteDto | undefined>(
    undefined
  );

  return (
    <>
      <Row>
        {!!noteFormData ? (
          <NoteForm
            item={noteFormData}
            onClose={() => setNoteFormData(undefined)}
          />
        ) : null}

        <h1 className="text-center my-3">Notes</h1>
        <Col sm="12" className="my-2">
          <Button
            variant="success"
            className="w-100 text-start"
            disabled={state === "pending"}
            onClick={() => setNoteFormData({})}
          >
            Create new note
          </Button>
        </Col>
        {state === "pending" ? <PendingItem /> : null}

        {state === "ready"
          ? data?.map((note) => (
              <Col
                sm="12"
                className="d-flex justify-content-center my-2"
                key={note.id}
              >
                <ButtonGroup key={note.id} className="w-100">
                  <Button
                    className="flex-grow-1 text-start"
                    onClick={() => setNoteFormData(note)}
                  >
                    {note.title}
                  </Button>
                  <Button
                    onClick={() =>
                      handlerMap?.handleUpdate({ ...note, state: "checked" })
                    }
                    className="flex-grow-0"
                  >
                    <Icon path={note.state === "unchecked" ? mdiRadioboxBlank : mdiRadioboxMarked} size={1} />
                  </Button>
                </ButtonGroup>
              </Col>
            ))
          : null}
      </Row>
    </>
  );
};

export default NotesUI;
