import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { logout, user } = React.useContext(AuthContext);

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* MAIN CONTENT */}
      <div className="flex-grow-1 d-flex flex-column flex-md-row overflow-auto">
        {/* SIDEBAR */}
        <nav
          className="bg-light p-3 col-12 col-md-2"
          style={{ minHeight: "100%" }}
        >
          <h5>WorkAsana</h5>
          <p>Hi, {user?.name}</p>
          <ul className="nav flex-row flex-md-column">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/projects" className="nav-link">
                Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/teams" className="nav-link">
                Teams
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reports" className="nav-link">
                Reports
              </Link>
            </li>
            <li className="nav-item mt-2">
              <button className="btn btn-danger" onClick={logout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>

        {/* MAIN PAGE CONTENT */}
        <main
          className="p-3 col-12 col-md-10"
          style={{ paddingBottom: "60px" }} // prevent content behind footer
        >
          <Outlet />
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-dark text-white py-3 text-center">
        &copy; {new Date().getFullYear()} WorkAsana. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
