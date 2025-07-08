import { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { NoteListContext } from "./notesProvider";
import { NoteDto } from "../types";

interface NoteDeleteFormProps {
  item: NoteDto;
  onClose: () => void;
}

function NoteDeleteForm({ item, onClose }: NoteDeleteFormProps) {
  const [errorState, setErrorState] = useState<any>();
  const context = useContext(NoteListContext);
  const { state, handlerMap } = context ?? { state: "pending", data: [] };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!errorState?.message ? (
          <Alert variant={"danger"}>{errorState.message}</Alert>
        ) : null}
        Do you really want to delete note <b>{item.title}</b>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={state === "pending"}
        >
          Close
        </Button>
        <Button
          variant="danger"
          disabled={state === "pending"}
          onClick={async () => {
            const result = await handlerMap?.handleDelete({ id: item.id });
            onClose();
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NoteDeleteForm;
