import { Container } from "react-bootstrap";

interface Note {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default async function Home() {
  const res = await fetch("http://localhost:4000/notes");
  const users: Note[] = await res.json();
  return (
    <Container>
      {users.map((user) => (
        <div key={user.id}>{user.title}</div>
      ))}
    </Container>
  );
}
