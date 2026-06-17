import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const { id } = useParams(); // Gets the user ID from the URL
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    // Fetch profile data from your existing backend view
    api.get(`users/${id}/`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Profile not found");
        setLoading(false);
      });
  }, [id]);

  const handleConnect = async () => {
    try {
      await api.post(`connections/request/${id}/`);
      // Optimistically update the UI so the button changes immediately
      setData(prev => ({ ...prev, connection_status: "pending" }));
    } catch (err) {
      console.error("Failed to send request", err);
    }
  };

  // Helper to split comma-separated strings into arrays for UI tags
  const renderTags = (tagString) => {
    if (!tagString) return <span style={{ color: "var(--dim)", fontSize: "13px" }}>None specified</span>;
    return tagString.split(",").map((tag, i) => (
      <span key={i} style={{
        background: "var(--surface2)", padding: "4px 12px", borderRadius: "20px",
        fontSize: "12px", fontWeight: 600, color: "var(--blue)", border: "1px solid var(--border)"
      }}>
        {tag.trim()}
      </span>
    ));
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}><div className="spinner" /></div>;
  if (error) return <div style={{ textAlign: "center", padding: "40px", color: "var(--red)" }}>{error}</div>;
  if (!data) return null;

  const { profile } = data;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "40px" }}>

      {/* Banner & Avatar Section */}
      <div className="animate-fadeUp" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "20px", overflow: "hidden", marginBottom: "24px", position: "relative"
      }}>
        
        {/* Decorative Banner - NOW DYNAMIC */}
        <div style={{ 
          height: "120px", 
          background: profile.backdrop ? `url(${profile.backdrop}) center/cover` : "linear-gradient(135deg, var(--blue), var(--indigo))",
          opacity: profile.backdrop ? 1 : 0.8 
        }} />

        <div style={{ padding: "0 32px 32px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "-40px", position: "relative", zIndex: 10 }}>

          {/* FIX APPLIED HERE: Changed alignItems to "flex-start" */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            
            {/* Avatar Profile Picture - NOW DYNAMIC */}
            <div style={{
              width: "100px", height: "100px", borderRadius: "24px", 
              background: profile.profile_picture ? `url(${profile.profile_picture}) center/cover` : "var(--surface)",
              border: "4px solid var(--surface)", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "36px", fontWeight: 800, color: "var(--blue)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
            }}>
              {!profile.profile_picture && data.username[0].toUpperCase()}
            </div>

            {/* FIX APPLIED HERE: Added marginTop to slide text down */}
            <div style={{ marginTop: "32px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>@{data.username}</h1>
              <p style={{ color: "var(--dim)", margin: "4px 0 0 0", fontSize: "14px" }}>
                {profile.major || "Undeclared"} • {profile.college || "University"}
              </p>
            </div>
          </div>

          {/* Action Button based on connection_status */}
          <div style={{ paddingBottom: "8px" }}>
            {data.connection_status === "self" ? (
              <button className="btn btn-outline-blue" onClick={() => navigate('/settings')}>Edit Profile</button>
            ) : data.connection_status === "accepted" ? (
              <button className="btn btn-outline-blue" onClick={() => navigate(`/messages/${data.id}`)}>Message</button>
            ) : data.connection_status === "pending" ? (
              <button disabled style={{ background: "var(--surface2)", border: "none", padding: "10px 16px", borderRadius: "8px", color: "var(--dim)" }}>Request Sent</button>
            ) : (
              <button
                onClick={handleConnect}
                style={{
                  background: "linear-gradient(135deg, var(--blue), var(--indigo))", color: "white",
                  border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: 600, cursor: "pointer"
                }}>
                Connect ⬡
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="animate-fadeUp-1" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>

        {/* Left Column: Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Bio */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>About</h3>
            <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
              {profile.bio || "This user hasn't written a bio yet."}
            </p>
          </div>

          {/* Skills & Interests */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "28px" }}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {renderTags(profile.skills)}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>Interests</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {renderTags(profile.interests)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Network & Events */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Network Stats */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Network</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ fontSize: "24px", color: "var(--blue)" }}>⬡</div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 800 }}>{data.connections_count}</div>
                <div style={{ fontSize: "12px", color: "var(--dim)" }}>Connections</div>
              </div>
            </div>

            {data.mutual_connections?.length > 0 && (
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--dim)", marginBottom: "8px" }}>MUTUALS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {data.mutual_connections.map(m => (
                    <span key={m.id} onClick={() => navigate(`/profile/${m.id}`)} style={{
                      fontSize: "12px", color: "var(--blue)", cursor: "pointer"
                    }}>@{m.username}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Events Attending */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Attending</h3>
            {data.events_attending?.length === 0 ? (
              <p style={{ color: "var(--dim)", fontSize: "13px" }}>Not registered for any events.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {data.events_attending.map(event => (
                  <div key={event.id} onClick={() => navigate(`/events/${event.id}/lobby`)} style={{
                    padding: "10px 12px", background: "var(--surface2)", borderRadius: "8px",
                    fontSize: "13px", fontWeight: 600, cursor: "pointer", borderLeft: "2px solid var(--indigo)"
                  }}>
                    {event.title}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;