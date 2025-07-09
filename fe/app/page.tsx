import { Container } from "react-bootstrap";
import NotesUI from "./components/notesUI";
import NotesProvider from "./components/notesProvider";

export default async function Home() {
  return (
    <Container>
      <NotesProvider>
        <h1 className="text-center my-3">Notes</h1>
        <NotesUI />
      </NotesProvider>
    </Container>
  );
}
