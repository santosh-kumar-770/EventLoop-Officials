function EventCard({ title }) {
  return (
    <div style={{
      border: "1px solid #444",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "8px",
      background: "#1f1f1f"
    }}>
      {title}
    </div>
  );
}

export default EventCard;