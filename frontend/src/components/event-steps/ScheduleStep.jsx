export default function ScheduleStep({ data, update }) {
  const schedule = data.schedule || [];

  const addSession = () => {
    update({ ...data, schedule: [...schedule, { time: "", activity: "" }] });
  };

  const updateSession = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    update({ ...data, schedule: updated });
  };

  return (
    <>
      <h3>Event Agenda & Schedule</h3>
      {schedule.map((item, idx) => (
        <div key={idx} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input 
            type="text" 
            placeholder="Time (e.g. 10:00 AM)" 
            value={item.time} 
            onChange={(e) => updateSession(idx, "time", e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Activity Name" 
            value={item.activity} 
            onChange={(e) => updateSession(idx, "activity", e.target.value)} 
          />
        </div>
      ))}
      <button type="button" onClick={addSession} className="btn-prev" style={{ marginTop: "8px" }}>
        + Add Agenda Session
      </button>
    </>
  );
}