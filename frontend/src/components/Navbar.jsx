import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{ background: "#000", width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px"
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <h2 style={{ margin: 0 }}>EventLoop</h2>
        </Link>

        <div style={{ display: "flex", gap: "30px" }}>
          <Link to="/">Dashboard</Link>
          <Link to="/discover">Discover</Link>
          <Link to="/events">Events</Link>
          <Link to="/network">Network</Link>
          <Link to="/requests">Requests</Link>
          <Link to="/profile/1">Profile</Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;