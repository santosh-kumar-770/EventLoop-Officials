export default function LocationStep({ data, update }) {
  const loc = data.location_data || { type: "offline" };

  const handleChange = (field, value) => {
    update({
      ...data,
      location_data: { ...loc, [field]: value }
    });
  };

  return (
    <>
      <label>Event Format *</label>
      <select value={loc.type} onChange={(e) => handleChange("type", e.target.value)}>
        <option value="offline">Offline / In-Person</option>
        <option value="online">Online / Virtual</option>
        <option value="hybrid">Hybrid</option>
      </select>

      {loc.type !== "online" && (
        <>
          <label>Venue Name & Address</label>
          <input 
            type="text" 
            placeholder="e.g. Convention Center, Hall 4" 
            value={loc.venue || ""} 
            onChange={(e) => handleChange("venue", e.target.value)} 
          />
        </>
      )}

      {loc.type !== "offline" && (
        <>
          <label>Meeting / Virtual Platform Link</label>
          <input 
            type="url" 
            placeholder="https://zoom.us/j/..." 
            value={loc.link || ""} 
            onChange={(e) => handleChange("link", e.target.value)} 
          />
        </>
      )}
    </>
  );
}