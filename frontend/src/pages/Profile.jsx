import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

const YEAR_LABELS = {
  "1": "First Year", "2": "Second Year", "3": "Third Year",
  "4": "Fourth Year", "5": "Fifth Year+", "alumni": "Alumni"
};

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  let currentUserId = null;
  try {
    const token = localStorage.getItem("access_token");
    if (token) currentUserId = jwtDecode(token).user_id;
  } catch (e) {}

  const isOwnProfile = parseInt(id) === currentUserId;

  useEffect(() => {
    setLoading(true);
    api.get(`users/profile/${id}/`)
      .then(res => {
        setProfile(res.data);
        setForm(res.data.profile || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("users/profile/update/", form);
      setProfile(prev => ({ ...prev, profile: res.data.profile }));
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleConnect = async () => {
    try {
      await api.post("connections/send/", { receiver: profile.id });
      setProfile(prev => ({ ...prev, connection_status: "pending" }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 32px", color: "var(--dim)" }}>Loading...</div>;
  if (!profile) return <div style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 32px", color: "var(--dim)" }}>User not found.</div>;

  const p = profile.profile || {};

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 32px" }}>

      {/* Header card */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>

          {/* Avatar */}
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, var(--blue), var(--indigo))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "24px", color: "white", flexShrink: 0 }}>
            {profile.username[0].toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 4px 0" }}>@{profile.username}</h1>
            <div style={{ fontSize: "13px", color: "var(--dim)", marginBottom: "8px" }}>
              {profile.connections_count} connection{profile.connections_count !== 1 ? "s" : ""}
            </div>

            {/* Major + Year badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {p.major && (
                <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: "rgba(59,130,246,0.1)", color: "var(--blue)", fontWeight: 500 }}>
                  {p.major}
                </span>
              )}
              {p.year && (
                <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: "rgba(99,102,241,0.1)", color: "#818cf8", fontWeight: 500 }}>
                  {YEAR_LABELS[p.year] || p.year}
                </span>
              )}
              {p.college && (
                <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", fontWeight: 500 }}>
                  🏫 {p.college}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            {isOwnProfile ? (
              <button onClick={() => setEditing(!editing)} style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                {editing ? "Cancel" : "✏️ Edit"}
              </button>
            ) : (
              <>
                {profile.connection_status === "accepted" && (
                  <button onClick={() => navigate(`/messages/${profile.id}`)} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, var(--blue), var(--indigo))", color: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                    💬 Message
                  </button>
                )}
                {profile.connection_status === "none" && (
                  <button onClick={handleConnect} style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid var(--blue)", background: "rgba(59,130,246,0.1)", color: "var(--blue)", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                    + Connect
                  </button>
                )}
                {profile.connection_status === "pending" && (
                  <button disabled style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--dim)", fontSize: "13px", fontFamily: "DM Sans, sans-serif" }}>
                    Request Sent
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {p.bio && !editing && (
          <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.7", marginTop: "20px", marginBottom: 0 }}>{p.bio}</p>
        )}

        {/* Socials */}
        {(p.linkedin || p.twitter) && !editing && (
          <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
            {p.linkedin && (
              <a href={p.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: "13px", color: "var(--blue)", textDecoration: "none" }}>
                🔗 LinkedIn
              </a>
            )}
            {p.twitter && (
              <a href={`https://twitter.com/${p.twitter.replace("@", "")}`} target="_blank" rel="noreferrer" style={{ fontSize: "13px", color: "var(--blue)", textDecoration: "none" }}>
                𝕏 @{p.twitter.replace("@", "")}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Edit form */}
      {editing && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginTop: 0, marginBottom: "20px" }}>Edit Profile</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { label: "Bio", key: "bio", type: "textarea", placeholder: "Tell people about yourself..." },
              { label: "College / University", key: "college", placeholder: "e.g. MIT" },
              { label: "Major", key: "major", placeholder: "e.g. Computer Science" },
              { label: "Skills", key: "skills", placeholder: "e.g. Python, React, Design (comma separated)" },
              { label: "Interests", key: "interests", placeholder: "e.g. AI, Startups, Music (comma separated)" },
              { label: "LinkedIn URL", key: "linkedin", placeholder: "https://linkedin.com/in/yourname" },
              { label: "Twitter / X handle", key: "twitter", placeholder: "@yourhandle" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: "12px", color: "var(--dim)", fontWeight: 600, display: "block", marginBottom: "6px" }}>{label}</label>
                {type === "textarea" ? (
                  <textarea
                    value={form[key] || ""}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    rows={3}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: "14px", fontFamily: "DM Sans, sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box" }}
                  />
                ) : (
                  <input
                    value={form[key] || ""}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: "14px", fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }}
                  />
                )}
              </div>
            ))}

            {/* Year dropdown */}
            <div>
              <label style={{ fontSize: "12px", color: "var(--dim)", fontWeight: 600, display: "block", marginBottom: "6px" }}>Year</label>
              <select
                value={form.year || ""}
                onChange={e => setForm(prev => ({ ...prev, year: e.target.value }))}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: "14px", fontFamily: "DM Sans, sans-serif", outline: "none" }}
              >
                <option value="">Select year</option>
                {Object.entries(YEAR_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ marginTop: "20px", padding: "10px 28px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--blue), var(--indigo))", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      )}

      {/* Skills */}
      {p.skills && !editing && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, marginTop: 0, marginBottom: "14px" }}>Skills</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {p.skills.split(",").map((s, i) => (
              <span key={i} style={{ fontSize: "13px", padding: "5px 14px", borderRadius: "20px", background: "rgba(59,130,246,0.1)", color: "var(--blue)", fontWeight: 500 }}>
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {p.interests && !editing && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, marginTop: 0, marginBottom: "14px" }}>Interests</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {p.interests.split(",").map((s, i) => (
              <span key={i} style={{ fontSize: "13px", padding: "5px 14px", borderRadius: "20px", background: "rgba(99,102,241,0.1)", color: "#818cf8", fontWeight: 500 }}>
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mutual connections */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, marginTop: 0, marginBottom: "14px" }}>Mutual Connections</h2>
        {profile.mutual_connections.length === 0
          ? <p style={{ color: "var(--dim)", fontSize: "14px", margin: 0 }}>No mutual connections</p>
          : profile.mutual_connections.map(u => (
            <div key={u.id} onClick={() => navigate(`/profile/${u.id}`)} style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "8px", cursor: "pointer" }}>
              @{u.username}
            </div>
          ))
        }
      </div>

      {/* Events attending */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, marginTop: 0, marginBottom: "14px" }}>Events Attending</h2>
        {profile.events_attending.length === 0
          ? <p style={{ color: "var(--dim)", fontSize: "14px", margin: 0 }}>Not attending any events yet</p>
          : profile.events_attending.map(event => (
            <div key={event.id} onClick={() => navigate(`/events/${event.id}/lobby`)} style={{ background: "var(--bg)", borderRadius: "8px", padding: "12px 16px", marginBottom: "10px", fontSize: "14px", cursor: "pointer", color: "var(--muted)", border: "1px solid var(--border)" }}>
              {event.title} →
            </div>
          ))
        }
      </div>

    </div>
  );
}

export default Profile;