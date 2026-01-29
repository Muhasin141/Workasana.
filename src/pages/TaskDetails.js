import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [newStatus, setNewStatus] = useState(""); // For dropdown selection
  const [saving, setSaving] = useState(false); // Loading state
  const [deleting, setDeleting] = useState(false); // Delete loading state
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`https://workasana-gamma.vercel.app/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTask(data);
        setNewStatus(data.status); // initialize dropdown with current status
      })
      .catch(console.error);
  }, [id, token]);

  const saveStatus = async () => {
    if (newStatus === task.status) return; // No change, do nothing
    setSaving(true);
    try {
      const res = await fetch(
        `https://workasana-gamma.vercel.app/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        const updated = await res.json();
        setTask(updated); // update task state
        alert("Status updated successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating status");
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `https://workasana-gamma.vercel.app/tasks/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("Task deleted successfully!");
        navigate("/"); // Navigate back to task list
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete task");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting task");
    } finally {
      setDeleting(false);
    }
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h3>{task.name}</h3>
      <p>
        <b>Project:</b> {task.project?.name}
      </p>
      <p>
        <b>Team:</b> {task.team?.name}
      </p>
      <p>
        <b>Owners:</b> {task.owners.map((o) => o.name).join(", ")}
      </p>
      <p>
        <b>Tags:</b> {task.tags.map((t) => t.name).join(", ")}
      </p>
      <p>
        <b>Time to Complete:</b> {task.timeToComplete} days
      </p>
      <p>
        <b>Status:</b>
      </p>

      <div className="d-flex align-items-center gap-2 mb-3">
        <select
          className="form-select w-25"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          {["To Do", "In Progress", "Completed", "Blocked"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary"
          onClick={saveStatus}
          disabled={saving || newStatus === task.status}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          className="btn btn-danger"
          onClick={deleteTask}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;
