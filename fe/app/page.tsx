import { Container } from "react-bootstrap";
import NotesUI from "./components/notesUI";
import NotesProvider from "./components/notesProvider";

export default async function Home() {
  //const res = await fetch("http://localhost:4000/notes");
  //const users: Note[] = await res.json();
  return (
    <Container>
      <NotesProvider>
        <h1 className="text-center my-3">Notes</h1>
        <NotesUI />
      </NotesProvider>
    </Container>
  );
}
