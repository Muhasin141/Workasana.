import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";

export default function TaskList() {
  const { token } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [owners, setOwners] = useState([]);
  const [tags, setTags] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = async () => {
    try {
      const q = searchParams.toString();

      const tasksRes = await fetch(
        `https://workasana-gamma.vercel.app/tasks?${q}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(await tasksRes.json());

      const [teamsRes, projectsRes, userRes, tagsRes] = await Promise.all([
        fetch("https://workasana-gamma.vercel.app/teams", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://workasana-gamma.vercel.app/projects", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://workasana-gamma.vercel.app/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://workasana-gamma.vercel.app/tags", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setTeams(await teamsRes.json());
      setProjects(await projectsRes.json());

      const user = await userRes.json();
      setOwners(user ? [user] : []);

      setTags(await tagsRes.json());
    } catch (err) {
      console.error("Failed to load task list data", err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [searchParams, token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (!value) searchParams.delete(name);
    else searchParams.set(name, value);

    setSearchParams(searchParams);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Tasks</h2>

      <Link to="/tasks/new" className="btn btn-success mb-4">
        New Task
      </Link>

      {/* Filters */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Team",
            name: "team",
            options: teams.map((t) => ({ id: t._id, name: t.name })),
          },
          {
            label: "Project",
            name: "project",
            options: projects.map((p) => ({ id: p._id, name: p.name })),
          },
          {
            label: "Status",
            name: "status",
            options: ["To Do", "In Progress", "Completed", "Blocked"].map(
              (s) => ({
                id: s,
                name: s,
              })
            ),
          },
          {
            label: "Tag",
            name: "tags",
            options: tags.map((t) => ({ id: t._id, name: t.name })),
          },
          {
            label: "Owner",
            name: "owner",
            options: owners.map((o) => ({ id: o._id, name: o.name })),
          },
        ].map(({ label, name, options }) => (
          <div className="col-12 col-md-6 col-lg-3" key={name}>
            <label htmlFor={name} className="form-label">
              Filter by {label}
            </label>
            <select
              id={name}
              name={name}
              className="form-select"
              onChange={handleFilterChange}
              value={searchParams.get(name) || ""}
            >
              <option value="">{`All ${label}s`}</option>
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Responsive table wrapper */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Project</th>
              <th>Team</th>
              <th>Owners</th>
              <th>Tags</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No tasks found
                </td>
              </tr>
            )}
            {tasks.map((t) => (
              <tr key={t._id}>
                <td>
                  <Link to={`/tasks/${t._id}`}>{t.name}</Link>
                </td>
                <td>{t.project?.name || "-"}</td>
                <td>{t.team?.name || "-"}</td>
                <td>{t.owners?.map((o) => o.name).join(", ") || "-"}</td>
                <td>{t.tags?.map((tag) => tag.name).join(", ") || "-"}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
