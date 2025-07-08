import { Col, ButtonGroup, Button } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiRadioboxBlank, mdiRadioboxMarked } from "@mdi/js";

import { NoteDto, noteState } from "../types";

import { useContext } from "react";
import { NoteListContext } from "./notesProvider";


interface NoteUIProps {
  note: NoteDto;
  setNoteFormData: (note: NoteDto) => void;
}

const NoteUI = ({ note, setNoteFormData }: NoteUIProps) => {
    const context = useContext(NoteListContext);
    const { handlerMap } = context ?? {
      state: "pending",
      data: [],
    };

  return (
    <Col sm="12" className="d-flex justify-content-center my-2" key={note.id}>
      <ButtonGroup key={note.id} className="w-100">
        <Button
          className="flex-grow-1 text-start"
          onClick={() => setNoteFormData(note)}
        >
          {note.title}
        </Button>
        <Button
          onClick={() => {
            let newState: noteState =
              note.state === "unchecked" ? "checked" : "unchecked";
            handlerMap?.handleUpdate({ ...note, state: newState });
          }}
          className="flex-grow-0"
        >
          <Icon
            path={
              note.state === "unchecked" ? mdiRadioboxBlank : mdiRadioboxMarked
            }
            size={1}
          />
        </Button>
      </ButtonGroup>
    </Col>
  );
};

export default NoteUI;
