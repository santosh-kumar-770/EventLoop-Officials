function ScheduleStep({ data, update }) {
  const addSession = () => {
    const newSchedule = [...(data.schedule || []), { time: "", activity: "" }];
    update({ ...data, schedule: newSchedule });
  };

  return (
    <div>
      <h3>Agenda / Schedule</h3>
      {(data.schedule || []).map((session, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <input placeholder="Time (e.g., 10:00 AM)" value={session.time} onChange={(e) => {
            const updated = [...data.schedule];
            updated[index].time = e.target.value;
            update({...data, schedule: updated});
          }} />
          <input placeholder="Activity" value={session.activity} onChange={(e) => {
            const updated = [...data.schedule];
            updated[index].activity = e.target.value;
            update({...data, schedule: updated});
          }} />
        </div>
      ))}
      <button onClick={addSession}>+ Add Session</button>
    </div>
  );
}
export default ScheduleStep;