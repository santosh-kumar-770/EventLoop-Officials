function VisibilityStep({ data, update }) {
  return (
    <div>
      <h3>Visibility & Support</h3>
      <select onChange={(e) => update({...data, visibility: e.target.value})} style={{ width: "100%", padding: "10px" }}>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
      <input placeholder="Support Email" onChange={(e) => update({...data, support_email: e.target.value})} style={{ width: "100%", padding: "10px", margin: "10px 0" }} />
    </div>
  );
}
export default VisibilityStep;