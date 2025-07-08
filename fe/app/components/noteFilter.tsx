import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { ButtonGroup } from "react-bootstrap";
import { useState, useContext } from "react";
import { NoteListContext } from "./notesProvider";
import { NoteDto } from "../types";

interface NoteFilterProps {
  onClose: () => void;
}

function NoteFilter({ onClose }: NoteFilterProps) {
  const context = useContext(NoteListContext);
  const { handlerMap, sort, filter } = context ?? {
    state: "pending",
    data: [],
  };
  //const [sortOption, setSortOption] = useState<"asc" | "desc">("desc");

  return (
    <Offcanvas onHide={onClose} show={true} placement="bottom" className="p-3">
      <h3>Sorting</h3>
      <ButtonGroup>
        <Button
          onClick={() => {
            handlerMap?.handleSortByDate("asc");
            //setSortOption("asc");
          }}
          disabled={sort === "asc"}
        >
          Oldest to newest
        </Button>

        <Button
          onClick={() => {
            handlerMap?.handleSortByDate("desc");
            //setSortOption("desc");
          }}
          disabled={sort === "desc"}
        >
          Newest to Oldest
        </Button>
      </ButtonGroup>

      <h3 className="mt-3">Filter</h3>
      <ButtonGroup>
        <Button
          variant={filter?.checked ? "primary" : "secondary"}
          onClick={() =>
            handlerMap?.handleFilterChange("checked", !filter?.checked)
          }
        >
          Checked
        </Button>
        <Button
          variant={filter?.unchecked ? "primary" : "secondary"}
          onClick={() =>
            handlerMap?.handleFilterChange("unchecked", !filter?.unchecked)
          }
        >
          Unchecked
        </Button>
      </ButtonGroup>
    </Offcanvas>
  );
}

export default NoteFilter;
