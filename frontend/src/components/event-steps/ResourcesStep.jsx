function ResourcesStep({ data, update }) {
  return (
    <div>
      <h3>Resources</h3>
      <input placeholder="GitHub Repo Link" onChange={(e) => update({...data, repo: e.target.value})} style={{ width: "100%", padding: "10px", margin: "10px 0" }} />
      <input placeholder="Discord/WhatsApp Link" onChange={(e) => update({...data, social: e.target.value})} style={{ width: "100%", padding: "10px", margin: "10px 0" }} />
    </div>
  );
}
export default ResourcesStep;