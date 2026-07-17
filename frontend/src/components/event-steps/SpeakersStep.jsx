function SpeakersStep({ data, update }) {
  const addSpeaker = () => {
    update({ ...data, speakers: [...(data.speakers || []), { name: "", designation: "" }] });
  };

  return (
    <div>
      <h3>Speakers / Mentors</h3>
      {(data.speakers || []).map((speaker, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <input placeholder="Speaker Name" value={speaker.name} onChange={(e) => {
            const updated = [...data.speakers];
            updated[index].name = e.target.value;
            update({...data, speakers: updated});
          }} />
          <input placeholder="Designation/Company" value={speaker.designation} onChange={(e) => {
            const updated = [...data.speakers];
            updated[index].designation = e.target.value;
            update({...data, speakers: updated});
          }} />
        </div>
      ))}
      <button onClick={addSpeaker}>+ Add Speaker</button>
    </div>
  );
}
export default SpeakersStep;