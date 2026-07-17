function EligibilityStep({ data, update }) {
  return (
    <div>
      <h3>Eligibility</h3>
      <select onChange={(e) => update({...data, target_audience: e.target.value})} style={{ width: "100%", padding: "10px" }}>
        <option value="students">College Students</option>
        <option value="professionals">Professionals</option>
        <option value="everyone">Everyone</option>
      </select>
      <textarea placeholder="Skills Required (comma separated)" onChange={(e) => update({...data, skills: e.target.value})} style={{ width: "100%", padding: "10px", margin: "10px 0" }} />
    </div>
  );
}
export default EligibilityStep;