function OrganizerStep({ data, update }) {
  return (
    <div>
      <h3>Organizer Information</h3>
      <input placeholder="Organization Name" value={data.org_name || ""} onChange={(e) => update({...data, org_name: e.target.value})} style={{ width: "100%", padding: "10px", margin: "10px 0" }} />
      <input placeholder="Contact Email" value={data.contact_email || ""} onChange={(e) => update({...data, contact_email: e.target.value})} style={{ width: "100%", padding: "10px", margin: "10px 0" }} />
      <input placeholder="LinkedIn Profile" value={data.linkedin || ""} onChange={(e) => update({...data, linkedin: e.target.value})} style={{ width: "100%", padding: "10px", margin: "10px 0" }} />
    </div>
  );
}
export default OrganizerStep;