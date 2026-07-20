export default function SpeakersStep({ data, update }) {
  const speakers = data.speakers || [];

  const addSpeaker = () => {
    update({ ...data, speakers: [...speakers, { name: "", designation: "" }] });
  };

  const updateSpeaker = (index, field, value) => {
    const updated = [...speakers];
    updated[index][field] = value;
    update({ ...data, speakers: updated });
  };

  return (
    <>
      <h3>Speakers & Mentors</h3>
      {speakers.map((s, idx) => (
        <div key={idx} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input 
            type="text" 
            placeholder="Speaker Name" 
            value={s.name} 
            onChange={(e) => updateSpeaker(idx, "name", e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Designation / Company" 
            value={s.designation} 
            onChange={(e) => updateSpeaker(idx, "designation", e.target.value)} 
          />
        </div>
      ))}
      <button type="button" onClick={addSpeaker} className="btn-prev" style={{ marginTop: "8px" }}>
        + Add Speaker
      </button>
    </>
  );
}