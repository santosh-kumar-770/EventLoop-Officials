export default function BasicInfoStep({ data, update }) {
  return (
    <>
      <label>Event Title *</label>
      <input 
        type="text" 
        placeholder="e.g. Global AI Hackathon 2026" 
        value={data.title || ""} 
        onChange={(e) => update({ ...data, title: e.target.value })} 
      />

      <label>Short Tagline</label>
      <input 
        type="text" 
        placeholder="Build the future of decentralized tech" 
        value={data.tagline || ""} 
        onChange={(e) => update({ ...data, tagline: e.target.value })} 
      />

      <label>Event Description *</label>
      <textarea 
        rows="4" 
        placeholder="Provide complete details about the event..." 
        value={data.description || ""} 
        onChange={(e) => update({ ...data, description: e.target.value })} 
      />

      <label>Event Category</label>
      <select 
        value={data.category || "Hackathon"} 
        onChange={(e) => update({ ...data, category: e.target.value })}
      >
        <option value="Hackathon">Hackathon</option>
        <option value="Workshop">Workshop</option>
        <option value="Webinar">Webinar</option>
        <option value="Tech Talk">Tech Talk</option>
        <option value="Meetup">Meetup</option>
        <option value="Conference">Conference</option>
      </select>
    </>
  );
}