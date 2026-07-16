import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Discover() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Track if they typed something
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 0) {
        setLoading(true);
        setHasSearched(true);
        api.get(`users/search/?q=${query}`)
          .then(res => {
            setUsers(res.data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      } else {
        setUsers([]);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "16px" }}>Discover People</h1>
        <input 
          type="text" 
          placeholder="Search by name or major..." 
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", padding: "16px", fontSize: "16px", borderRadius: "12px" }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "var(--dim)" }}>Searching...</div>
      ) : (
        <>
          {/* EMPTY STATE: Shown if they searched but found nothing */}
          {hasSearched && users.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", background: "var(--surface)", borderRadius: "20px", border: "1px dashed var(--border)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <h3 style={{ marginBottom: "8px" }}>No results found</h3>
              <p style={{ color: "var(--dim)", fontSize: "14px" }}>We couldn't find anyone matching "{query}". Try a different name or major.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {users.map(user => (
                <div 
                  key={user.id} 
                  onClick={() => navigate(`/profile/${user.id}`)}
                  style={{ 
                    background: "var(--surface)", border: "1px solid var(--border)", 
                    borderRadius: "16px", padding: "24px", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--blue)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <div style={{ 
                    width: "80px", height: "80px", borderRadius: "20px", marginBottom: "16px",
                    background: user.profile_picture ? `url(${user.profile_picture}) center/cover` : "var(--surface2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px", fontWeight: 800, color: "var(--blue)"
                  }}>
                    {!user.profile_picture && user.username[0].toUpperCase()}
                  </div>
                  <h3 style={{ margin: "0 0 4px 0" }}>@{user.username}</h3>
                  <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--dim)" }}>{user.major || "Undeclared"}</p>
                  <button className="btn btn-outline-blue" style={{ width: "100%" }}>View Profile</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Discover;