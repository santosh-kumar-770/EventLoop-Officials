function RegistrationStep({ data, update }) {
  return (
    <div>
      <h3>Registration</h3>
      <label>
        <input type="checkbox" checked={data.registration_required || false} onChange={(e) => update({...data, registration_required: e.target.checked})} />
        Registration Required?
      </label>
      <input type="number" placeholder="Max Participants" onChange={(e) => update({...data, max_participants: e.target.value})} style={{ width: "100%", padding: "10px", margin: "10px 0" }} />
    </div>
  );
}
export default RegistrationStep;