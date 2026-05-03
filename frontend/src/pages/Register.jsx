import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) { setError("Username and password are required"); return; }
    setError("");
    setLoading(true);
    try {
      await api.post("users/register/", { username, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "USERNAME", key: "username", type: "text", placeholder: "choose_a_username", value: username, set: setUsername },
    { label: "EMAIL", key: "email", type: "email", placeholder: "you@university.edu", value: email, set: setEmail },
    { label: "PASSWORD", key: "password", type: "password", placeholder: "••••••••", value: password, set: setPassword },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
    }}>
      <div style={{ position: "fixed", top: "20%", right: "10%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "20%", left: "10%", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,106,247,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="animate-fadeUp" style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, var(--blue), var(--indigo))", marginBottom: "16px", boxShadow: "0 0 32px rgba(79,142,247,0.3)" }}>
            <span style={{ fontSize: "22px" }}>⟳</span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "6px" }}>
            Event<span style={{ background: "linear-gradient(135deg, var(--blue), var(--indigo))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Loop</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>Your campus networking hub</p>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "36px", boxShadow: "0 8px 48px rgba(0,0,0,0.4)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>Create your account</h2>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "24px" }}>Join your campus community on EventLoop</p>

          {error && (
            <div style={{ background: "rgba(247,95,95,0.1)", border: "1px solid rgba(247,95,95,0.2)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "var(--red)", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚠ {error}
            </div>
          )}

          {fields.map(({ label, key, type, placeholder, value, set }) => (
            <div key={key} style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--dim)", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>{label}</label>
              <input
                className="input"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={e => set(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleRegister()}
              />
            </div>
          ))}

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "8px",
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
            {loading ? <><div className="spinner" />Creating account...</> : "Create Account →"}
          </button>

          <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--blue)", fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;