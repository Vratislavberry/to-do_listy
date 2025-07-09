"use client";
import { useState, useContext } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { NoteDto } from "../types";

import Icon from "@mdi/react";
import { mdiSort } from "@mdi/js";

import { NoteListContext } from "./notesProvider";
import PendingItem from "./pendingItem";
import NoteForm from "./noteForm";
import NoteFilter from "./noteFilter";
import NoteDeleteForm from "./noteDeleteForm";
import NoteUI from "./noteUI";

const NotesUI = () => {
  const context = useContext(NoteListContext);
  const { state, data, filter, handlerMap } = context ?? {
    state: "pending",
    data: [],
  };
  const [noteFormData, setNoteFormData] = useState<NoteDto | undefined>(
    undefined
  );
  const [noteFormDeleteData, setNoteFormDeleteData] = useState<
    NoteDto | undefined
  >(undefined);
  const [showConfig, setShowConfig] = useState(false);

  return (
    <>
      <Row>
        {!!showConfig ? (
          <NoteFilter onClose={() => setShowConfig(false)} />
        ) : null}

        {!!noteFormData ? (
          <NoteForm
            item={noteFormData}
            onClose={() => setNoteFormData(undefined)}
            setNoteFormDeleteData={setNoteFormDeleteData}
          />
        ) : null}

        {!!noteFormDeleteData ? (
          <NoteDeleteForm
            item={noteFormDeleteData}
            onClose={() => setNoteFormDeleteData(undefined)}
          />
        ) : null}

        <Col className="d-flex justify-content-end my-2">
          <Button
            variant="success"
            onClick={() => setShowConfig(true)}
            disabled={state === "pending"}
          >
            <Icon path={mdiSort} size={1} />
          </Button>
        </Col>

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
        <hr />
        {state === "pending" ? <PendingItem /> : null}

        {state === "ready" && Array.isArray(data) && data?.length > 0
          ? data?.map((note) =>
              // render if note is allowed by filter
              filter[note.state] ? (
                <NoteUI
                  key={note.id}
                  note={note}
                  setNoteFormData={setNoteFormData}
                />
              ) : null
            )
          : null}

        {state === "ready" && Array.isArray(data) && data?.length === 0 ? (
          <p>There are no notes...</p>
        ) : null}
      </Row>
    </>
  );
};

export default NotesUI;
