import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token found in URL.");
      return;
    }

    const verifyAccount = async () => {
      try {
        await api.post("auth/verify-email/", { token });
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err.response?.data?.error || "Verification failed or token has expired."
        );
      }
    };

    verifyAccount();
  }, [token]);

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "var(--background, #f8f9fa)",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "450px",
        width: "100%",
        background: "var(--surface, #ffffff)",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        border: "1px solid var(--border, #eaeaea)",
        textAlign: "center"
      }}>
        {status === "verifying" && (
          <div>
            <h2 style={{ color: "white", marginBottom: "16px" }}>Verifying your email...</h2>
            <p style={{ color: "var(--dim, #666)" }}>Please wait a moment while we secure your account.</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ color: "white", marginBottom: "16px" }}>Email Verified!</h2>
            <p style={{ color: "var(--dim, #666)", marginBottom: "24px" }}>
              Your account has been successfully verified. You can now log in and start hosting or exploring events.
            </p>
            <button 
              onClick={() => navigate("/login")}
              style={{
                background: "var(--blue, #4f46e5)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                width: "100%"
              }}
            >
              Proceed to Login
            </button>
          </div>
        )}

        {status === "error" && (
          <div>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
            <h2 style={{ color: "#ef4444", marginBottom: "16px" }}>Verification Failed</h2>
            <p style={{ color: "var(--dim, #666)", marginBottom: "24px" }}>
              {errorMessage}
            </p>
            <Link 
              to="/login"
              style={{
                color: "var(--blue, #4f46e5)",
                textDecoration: "none",
                fontWeight: "600"
              }}
            >
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;