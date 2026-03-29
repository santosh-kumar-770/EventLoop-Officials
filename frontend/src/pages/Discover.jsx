import { useEffect, useState } from "react";
import api from "../api/axios";
import UserCard from "../components/UserCard";

function Discover() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("connections/suggestions/")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 32px" }}>

      <div style={{ marginBottom: "36px" }}>
        <div style={{ fontSize: "13px", color: "var(--blue)", marginBottom: "8px", fontWeight: 500 }}>
          PEOPLE
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: 800 }}>Discover</h1>
        <p style={{ color: "var(--muted)", marginTop: "8px", fontSize: "15px" }}>
          Connect with students who share your interests
        </p>
      </div>

      {users.length === 0 && (
        <p style={{ color: "var(--dim)" }}>No suggestions yet</p>
      )}

      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

export default Discover;