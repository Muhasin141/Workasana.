import { useState } from "react";
import { useData } from "../context/DataContext";

export default function Projects() {
  const { projects, addProject } = useData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const submit = () => {
    addProject({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <div className="container mt-4">
      <h3>Projects</h3>

      <input
        className="form-control mb-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="btn btn-primary" onClick={submit}>
        Add Project
      </button>

      <ul className="list-group mt-4">
        {projects.map((p) => (
          <li key={p._id} className="list-group-item">
            <strong>{p.name}</strong> — {p.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
