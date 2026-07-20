import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) { setError("Please fill in all fields"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("auth/login/", { username, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      navigate("/");
    } catch (err) {
      // Catch specific backend error message (e.g. unverified email check)
      const errorMsg = err.response?.data?.error || "Invalid username or password";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
    }}>
      {/* Background orbs */}
      <div style={{ position: "fixed", top: "15%", left: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "15%", right: "10%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,106,247,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="animate-fadeUp" style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, var(--blue), var(--indigo))", marginBottom: "16px", boxShadow: "0 0 32px rgba(79,142,247,0.3)" }}>
            <span style={{ fontSize: "22px" }}>⟳</span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "6px" }}>
            Event<span style={{ background: "linear-gradient(135deg, var(--blue), var(--indigo))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Loop</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>Connect before the event starts</p>
        </div>

        {/* Card */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "36px", boxShadow: "0 8px 48px rgba(0,0,0,0.4)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>Welcome back</h2>

          {error && (
            <div style={{ background: "rgba(247,95,95,0.1)", border: "1px solid rgba(247,95,95,0.2)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "var(--red)", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--dim)", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>USERNAME</label>
            <input
              className="input"
              type="text"
              placeholder="your_username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--dim)", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>PASSWORD</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "10px",
              border: "none",
              background: loading ? "var(--surface2)" : "linear-gradient(135deg, var(--blue), var(--indigo))",
              color: loading ? "var(--dim)" : "white",
              fontSize: "15px",
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              fontFamily: "DM Sans, sans-serif",
              transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 20px rgba(79,142,247,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? <><div className="spinner" />Signing in...</> : "Sign In →"}
          </button>

          <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--muted)" }}>
            New to EventLoop?{" "}
            <Link to="/register" style={{ color: "var(--blue)", fontWeight: 600 }}>Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;