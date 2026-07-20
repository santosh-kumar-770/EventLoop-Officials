export default function OrganizerStep({ data, update }) {
  return (
    <>
      <label>Organization Name</label>
      <input 
        type="text" 
        placeholder="UniVoice Community" 
        value={data.org_name || ""} 
        onChange={(e) => update({ ...data, org_name: e.target.value })} 
      />

      <label>Organizer Contact Email *</label>
      <input 
        type="email" 
        placeholder="host@univoice.com" 
        value={data.contact_email || ""} 
        onChange={(e) => update({ ...data, contact_email: e.target.value })} 
      />

      <label>Organizer LinkedIn / Social Profile</label>
      <input 
        type="url" 
        placeholder="https://linkedin.com/in/username" 
        value={data.linkedin || ""} 
        onChange={(e) => update({ ...data, linkedin: e.target.value })} 
      />
    </>
  );
}