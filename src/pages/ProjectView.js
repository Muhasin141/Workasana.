import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://workasana-gamma.vercel.app";

const ProjectView = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [statusFilter, setStatusFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    Promise.all([
      fetch(`${API_BASE}/projects`).then((res) => res.json()),
      fetch(`${API_BASE}/tasks`).then((res) => res.json()),
      fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([projectsData, tasksData, usersData]) => {
        setProjects(projectsData);
        setTasks(tasksData);
        setUsers(usersData);
      })
      .catch(console.error);
  }, []);

  const tasksByProject = projects.reduce((acc, project) => {
    let projectTasks = tasks.filter(
      (task) => task.project && task.project._id === project._id
    );

    if (statusFilter) {
      projectTasks = projectTasks.filter(
        (task) => task.status === statusFilter
      );
    }

    if (ownerFilter) {
      projectTasks = projectTasks.filter((task) =>
        task.owners.some((o) => o._id === ownerFilter)
      );
    }

    acc[project._id] = projectTasks;
    return acc;
  }, {});

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">📁 Project View</h4>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/projects/new")}
        >
          + Add New Project
        </button>
      </div>

      {/* FILTERS */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">Filter by Status</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Blocked</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Filter by Owner</label>
          <select
            className="form-select"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
          >
            <option value="">All</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PROJECT LIST */}
      {projects.map((project) => (
        <div key={project._id} className="card shadow-sm mb-4">
          <div className="card-header fw-semibold">{project.name}</div>

          <div className="card-body">
            {tasksByProject[project._id]?.length === 0 ? (
              <p className="text-muted">No tasks in this project</p>
            ) : (
              <ul className="list-group list-group-flush">
                {tasksByProject[project._id].map((task) => (
                  <li key={task._id} className="list-group-item">
                    <strong>{task.name}</strong>
                    <div className="small text-muted">
                      Status: {task.status} | ⏱ {task.timeToComplete} days
                    </div>
                    <div className="small">Team: {task.team?.name}</div>
                    <div className="small">
                      Owners: {task.owners.map((o) => o.name).join(", ")}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectView;
