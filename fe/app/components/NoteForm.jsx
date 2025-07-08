import { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { NoteListContext } from "./notesProvider";

function NoteForm({ item, onClose }) {
  const { state, handlerMap } = useContext(NoteListContext);
  const [errorState, setErrorState] = useState();

  return (
    <Modal show={true} onHide={onClose}>
      <Form
        onSubmit={async (e) => {
          // Prevents reloading the page - we handle submit ourselves
          e.preventDefault();
          // stops propagation of submit event to parent components
          // in some cases it can trigger another submit event.
          e.stopPropagation();
          const formData = new FormData(e.target);
          // extracts data from Modal form
          const values = Object.fromEntries(formData);
          let result = null;
          if (item.id) {
            result = await handlerMap.handleUpdate({ ...item, ...values, id: item.id });
          } else {
            result = await handlerMap.handleCreate({
              ...values,
              createdAt: new Date().toISOString(),
              state: "unchecked",
            });
          }

          if (result.ok) {
            onClose();
          } else {
            setErrorState(result.error);
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
            <Alert variant={"danger"}>{errorState.note.message}</Alert>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={state === "pending"}
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
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default NoteForm;
