export default function RegistrationStep({ data, update }) {
  return (
    <>
      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
        <input 
          type="checkbox" 
          checked={data.registration_required ?? true} 
          onChange={(e) => update({ ...data, registration_required: e.target.checked })} 
          style={{ width: "auto" }}
        />
        Registration Required for this Event
      </label>

      <label>Maximum Participants Allowed</label>
      <input 
        type="number" 
        placeholder="500" 
        value={data.max_participants || ""} 
        onChange={(e) => update({ ...data, max_participants: e.target.value })} 
      />
    </>
  );
}