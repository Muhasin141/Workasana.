import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/projects">
        WorkAsana
      </Link>
      <div>
        <Link className="btn btn-outline-light me-2" to="/tasks">
          Tasks
        </Link>
        <Link className="btn btn-outline-light me-2" to="/reports">
          Reports
        </Link>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
