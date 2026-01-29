import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast

const API_BASE = "https://workasana-gamma.vercel.app";

const AddProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]); // To store existing projects

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all existing projects to check for duplicates
    fetch(`${API_BASE}/projects`)
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if the project name already exists
    if (projects.some((project) => project.name === name)) {
      toast.error("Project name already exists. Please choose another name.");
      return;
    }

    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      toast.success("Project created successfully");
      navigate("/projects");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create project");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="fw-bold mb-3">➕ Add New Project</h4>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Project Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/projects")}
                  >
                    Cancel
                  </button>

                  <button className="btn btn-primary">Create Project</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
