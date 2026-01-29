import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify"; // Import the toast library

const API_BASE = "https://workasana-gamma.vercel.app";

const TaskForm = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    project: "",
    team: "",
    owners: [], // will hold array of user _id
    tags: [], // will hold array of tag _id
    timeToComplete: 1,
    status: "To Do",
  });

  const navigate = useNavigate(); // Use navigate for redirecting

  useEffect(() => {
    const token = localStorage.getItem("token");

    Promise.all([
      fetch(`${API_BASE}/projects`),
      fetch(`${API_BASE}/teams`),
      fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE}/tags`),
    ])
      .then(async ([p, t, u, g]) => {
        setProjects(await p.json());
        setTeams(await t.json());
        setUsers(await u.json());
        setTags(await g.json());
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // React Select returns array of objects, we need to update formData accordingly
  const handleOwnersChange = (selectedOptions) => {
    setFormData({
      ...formData,
      owners: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    });
  };

  const handleTagsChange = (selectedOptions) => {
    setFormData({
      ...formData,
      tags: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        toast.error("Failed to create task: " + (err.error || "Unknown error"));
        return;
      }

      toast.success("Task created successfully!"); // ✅ show toast
      navigate("/"); // ✅ redirect to Tasks page

      // Reset form (optional if redirecting immediately)
      setFormData({
        name: "",
        project: "",
        team: "",
        owners: [],
        tags: [],
        timeToComplete: 1,
        status: "To Do",
      });
    } catch (error) {
      toast.error("Error creating task: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create New Task</h3>

      <form onSubmit={handleSubmit}>
        {/* Task Name */}
        <div className="mb-3">
          <label className="form-label">Task Name</label>
          <input
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Project */}
        <div className="mb-3">
          <label className="form-label">Project</label>
          <select
            className="form-select"
            name="project"
            value={formData.project}
            onChange={handleChange}
            required
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Team */}
        <div className="mb-3">
          <label className="form-label">Team</label>
          <select
            className="form-select"
            name="team"
            value={formData.team}
            onChange={handleChange}
            required
          >
            <option value="">Select Team</option>
            {teams.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Owners */}
        <div className="mb-3">
          <label className="form-label">Owners (Team Members)</label>
          <Select
            isMulti
            options={users.map((u) => ({ label: u.name, value: u._id }))}
            value={users
              .filter((u) => formData.owners.includes(u._id))
              .map((u) => ({ label: u.name, value: u._id }))}
            onChange={handleOwnersChange}
            placeholder="Select owners..."
          />
        </div>

        {/* Tags */}
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <Select
            isMulti
            options={tags.map((tag) => ({ label: tag.name, value: tag._id }))}
            value={tags
              .filter((tag) => formData.tags.includes(tag._id))
              .map((tag) => ({ label: tag.name, value: tag._id }))}
            onChange={handleTagsChange}
            placeholder="Select tags..."
          />
        </div>

        {/* Time to Complete */}
        <div className="mb-3">
          <label className="form-label">Time to Complete (days)</label>
          <input
            type="number"
            className="form-control"
            name="timeToComplete"
            min="1"
            value={formData.timeToComplete}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status */}
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Blocked</option>
          </select>
        </div>

        <button className="btn btn-primary">Create Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
