function LocationStep({ data, update }) {
  const setLocation = (key, value) => {
    update({
      ...data,
      location_data: { ...(data.location_data || {}), [key]: value }
    });
  };

  return (
    <div>
      <h3>Location</h3>
      <select onChange={(e) => setLocation("type", e.target.value)} style={{ width: "100%", padding: "10px" }}>
        <option value="offline">Offline</option>
        <option value="online">Online</option>
      </select>

      {data.location_data?.type === "online" ? (
        <input placeholder="Meeting Link (Zoom/Meet)" onChange={(e) => setLocation("link", e.target.value)} style={{ width: "100%", padding: "10px", margin: "10px 0" }} />
      ) : (
        <>
          <input placeholder="Venue Name" onChange={(e) => setLocation("venue", e.target.value)} style={{ width: "100%", padding: "10px", margin: "10px 0" }} />
          <input placeholder="City" onChange={(e) => setLocation("city", e.target.value)} style={{ width: "100%", padding: "10px", margin: "10px 0" }} />
        </>
      )}
    </div>
  );
}
export default LocationStep;