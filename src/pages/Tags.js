import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Tags() {
  const { token } = useAuth();
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("https://workasana-gamma.vercel.app/tags")
      .then((res) => res.json())
      .then(setTags);
  }, []);

  const addTag = async () => {
    const res = await fetch("https://workasana-gamma.vercel.app/tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    setTags([...tags, await res.json()]);
    setName("");
  };

  return (
    <div className="container mt-4">
      <h3>Tags</h3>

      <input
        className="form-control mb-2"
        placeholder="Tag name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button className="btn btn-primary mb-3" onClick={addTag}>
        Add Tag
      </button>

      <ul className="list-group">
        {tags.map((t) => (
          <li key={t._id} className="list-group-item">
            {t.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
