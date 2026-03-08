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
        <h2 style={{ margin: 0 }}>UniVoice</h2>

        <div style={{ display: "flex", gap: "30px" }}>
          <a href="/">Dashboard</a>
          <a href="/discover">Discover</a>
          <a href="/events">Events</a>
          <a href="/profile">Profile</a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;