import { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";

import { NoteListContext } from "./notesProvider";
import { NoteDto } from "../types";

interface NoteFormProps {
  onClose: () => void;
  item: NoteDto;
  setNoteFormDeleteData: (item: NoteDto | undefined) => void;
}

function NoteForm({ item, onClose, setNoteFormDeleteData }: NoteFormProps) {
  const context = useContext(NoteListContext);
  const { state, handlerMap } = context ?? { state: "pending", data: [] };
  const [errorState, setErrorState] = useState<any>();

  return (
    <Modal show={true} onHide={onClose}>
      <Form
        onSubmit={async (e) => {
          // Prevents reloading the page - we handle submit ourselves
          e.preventDefault();
          // stops propagation of submit event to parent components
          // in some cases it can trigger another submit event.
          e.stopPropagation();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          // extracts data from Modal form
          const values = Object.fromEntries(formData);
          let result = null;
          if (item.id) {
            result = await handlerMap?.handleUpdate({
              ...item,
              ...values,
              id: item.id,
            });
          } else {
            result = await handlerMap?.handleCreate({
              ...values,
              createdAt: new Date().toISOString(),
              state: "unchecked",
            });
          }

          if (result?.ok) {
            onClose();
          } else {
            setErrorState(result?.error);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{item.id ? "Edit" : "Create"} Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Title *</Form.Label>
          <Form.Control
            type="text"
            name="title"
            disabled={state === "pending"}
            defaultValue={item.title}
            required
            maxLength={50}
          />

          <Form.Label>Details</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="textDetail"
            disabled={state === "pending"}
            defaultValue={item.textDetail}
            maxLength={250}
          />

          {!!errorState?.note?.message ? (
            <Alert variant={"danger"}>{errorState?.note?.message}</Alert>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Col>
            {item.id ? (
              <Button
                className="self-align-start"
                variant="danger"
                onClick={() => {
                  setNoteFormDeleteData(item);
                  onClose();
                  
                }}
                disabled={state === "pending"}
              >
                Delete
              </Button>
            ) : null}
          </Col>
          <Col className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={state === "pending"}
              className="mx-2"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={state === "pending"}
            >
              {item.id ? "Edit" : "Create"}
            </Button>
          </Col>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default NoteForm;
