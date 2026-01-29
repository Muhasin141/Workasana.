import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("https://workasana-gamma.vercel.app/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.token);
      navigate("/");
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-lg-4 col-md-6 col-sm-10">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h3 className="fw-bold text-center text-primary mb-4">
                WorkAsana
              </h3>

              <p className="text-center text-muted mb-4">Sign in to continue</p>

              {error && (
                <div className="alert alert-danger text-center">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button className="btn btn-primary btn-lg w-100">Login</button>
              </form>

              <div className="text-center mt-4">
                <span className="text-muted">Don’t have an account?</span>{" "}
                <Link to="/signup" className="fw-semibold">
                  Sign up
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-muted mt-3 small">
            © {new Date().getFullYear()} WorkAsana
          </p>
        </div>
      </div>
    </div>
  );
}
