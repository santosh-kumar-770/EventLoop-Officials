export default function VisibilityStep({ data, update }) {
  return (
    <>
      <label>Event Visibility</label>
      <select 
        value={data.visibility || "public"} 
        onChange={(e) => update({ ...data, visibility: e.target.value })}
      >
        <option value="public">Public (Visible to everyone)</option>
        <option value="private">Private (Link only)</option>
      </select>

      <label>Contact Support Email</label>
      <input 
        type="email" 
        placeholder="support@eventdomain.com" 
        value={data.support_email || ""} 
        onChange={(e) => update({ ...data, support_email: e.target.value })} 
      />
    </>
  );
}