import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // ✅ Import toast
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "https://workasana-gamma.vercel.app";

const TeamView = () => {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/teams`).then((res) => res.json()),
      fetch(`${API_BASE}/tasks`).then((res) => res.json()),
    ])
      .then(([teamsData, tasksData]) => {
        setTeams(teamsData);
        setTasks(tasksData);
      })
      .catch(console.error);
  }, []);

  const tasksByTeam = teams.reduce((acc, team) => {
    let teamTasks = tasks.filter(
      (task) => task.team && task.team._id === team._id
    );

    if (statusFilter) {
      teamTasks = teamTasks.filter((task) => task.status === statusFilter);
    }

    if (sortBy === "status") {
      teamTasks.sort((a, b) => a.status.localeCompare(b.status));
    }

    if (sortBy === "time") {
      teamTasks.sort((a, b) => a.timeToComplete - b.timeToComplete);
    }

    acc[team._id] = teamTasks;
    return acc;
  }, {});

  const handleTeamSubmit = async (e) => {
    e.preventDefault();

    // Check if the team name already exists locally
    if (teams.some((team) => team.name === newTeam.name)) {
      toast.error("Team name already exists. Please choose another name.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTeam),
      });

      if (res.ok) {
        const addedTeam = await res.json();
        setTeams([...teams, addedTeam]); // Add new team to the list
        setNewTeam({ name: "", description: "" }); // Reset form
        setShowForm(false); // Hide form after submission
        toast.success("Team created successfully!"); // ✅ Toast success
      } else {
        const data = await res.json();
        if (data.error && data.error.includes("duplicate key error")) {
          toast.error("Team name already exists. Please choose another name.");
        } else {
          toast.error(data.error || "Failed to add team"); // ✅ Toast error
        }
      }
    } catch (err) {
      toast.error("Error creating team: " + err.message); // ✅ Toast error
    }
  };

  return (
    <div className="container mt-4">
      <h3>Team View</h3>

      <button
        className="btn btn-success mb-3"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Cancel" : "Add New Team"}
      </button>

      {showForm && (
        <form onSubmit={handleTeamSubmit} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Team Name</label>
            <input
              type="text"
              className="form-control"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={newTeam.description}
              onChange={(e) =>
                setNewTeam({ ...newTeam, description: e.target.value })
              }
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create Team
          </button>
        </form>
      )}

      <div className="row mb-3">
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
          <label className="form-label">Sort Tasks</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">None</option>
            <option value="status">By Status</option>
            <option value="time">By Time to Complete</option>
          </select>
        </div>
      </div>

      {teams.map((team) => (
        <div key={team._id} className="mb-4">
          <h5 className="bg-light p-2 rounded">{team.name}</h5>

          {tasksByTeam[team._id]?.length === 0 ? (
            <p className="text-muted ms-2">No tasks for this team</p>
          ) : (
            <ul className="list-group">
              {tasksByTeam[team._id].map((task) => (
                <li key={task._id} className="list-group-item">
                  <strong>{task.name}</strong>
                  <div className="small text-muted">
                    Status: {task.status} | Time: {task.timeToComplete} days
                  </div>
                  <div className="small">
                    Owners: {task.owners.map((o) => o.name).join(", ")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamView;
