function DateTimeStep({ data, update }) {
  return (
    <div>
      <h3>Date & Time</h3>
      <label>Start Date & Time</label>
      <input type="datetime-local" 
        value={data.start_date || ""}
        onChange={(e) => update({...data, start_date: e.target.value})}
        style={{ display: "block", width: "100%", padding: "10px", margin: "10px 0" }}
      />
      
      <label>End Date & Time</label>
      <input type="datetime-local" 
        value={data.end_date || ""}
        onChange={(e) => update({...data, end_date: e.target.value})}
        style={{ display: "block", width: "100%", padding: "10px", margin: "10px 0" }}
      />
    </div>
  );
}
export default DateTimeStep;