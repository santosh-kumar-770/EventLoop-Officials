import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`users/profile/${id}/`)
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>User not found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        border: "1px solid #444",
        borderRadius: "12px",
        padding: "30px",
        marginBottom: "20px"
      }}>
        <h1 style={{ margin: "0 0 8px 0" }}>@{profile.username}</h1>
        <p style={{ color: "#aaa", margin: 0 }}>
          {profile.connections_count} connection{profile.connections_count !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Mutual Connections */}
      <div style={{
        border: "1px solid #444",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "20px"
      }}>
        <h2 style={{ marginTop: 0 }}>Mutual Connections</h2>
        {profile.mutual_connections.length === 0
          ? <p style={{ color: "#aaa" }}>No mutual connections</p>
          : profile.mutual_connections.map((u) => (
            <p key={u.id} style={{ margin: "6px 0" }}>@{u.username}</p>
          ))
        }
      </div>

      {/* Events Attending */}
      <div style={{
        border: "1px solid #444",
        borderRadius: "12px",
        padding: "24px"
      }}>
        <h2 style={{ marginTop: 0 }}>Events Attending</h2>
        {profile.events_attending.length === 0
          ? <p style={{ color: "#aaa" }}>Not attending any events yet</p>
          : profile.events_attending.map((event) => (
            <div key={event.id} style={{
              background: "#1a1a1a",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "10px"
            }}>
              {event.title}
            </div>
          ))
        }
      </div>

    </div>
  );
}

export default Profile;