import { useState, useEffect } from "react";
import api from "../api/axios";

function RegisterButton({ eventId }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is already registered on mount
  useEffect(() => {
    api.get("registrations/my/").then(res => {
      const registered = res.data.some(r => r.event_id === eventId);
      setIsRegistered(registered);
    });
  }, [eventId]);

  const toggleRegistration = async () => {
    setLoading(true);
    try {
      if (isRegistered) {
        await api.delete(`registrations/cancel/${eventId}/`);
      } else {
        await api.post(`registrations/register/${eventId}/`);
      }
      setIsRegistered(!isRegistered);
    } catch (err) {
      console.error("Failed to update registration", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleRegistration}
      disabled={loading}
      style={{
        padding: "12px 24px",
        borderRadius: "10px",
        border: isRegistered ? "1px solid var(--border)" : "none",
        background: isRegistered ? "transparent" : "var(--blue)",
        color: isRegistered ? "var(--text)" : "white",
        cursor: "pointer",
        fontWeight: 600,
        transition: "all 0.2s"
      }}
    >
      {loading ? "..." : isRegistered ? "Registered ✓" : "Register Now"}
    </button>
  );
}

export default RegisterButton;