import { useDB } from "react-pouchdb";

function MyComponent({ title }) {
    const db = useDB();
    return <button onClick={() => db.post({ title })}>Add</button>;
}