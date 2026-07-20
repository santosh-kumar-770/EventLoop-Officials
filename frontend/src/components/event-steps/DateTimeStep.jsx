export default function DateTimeStep({ data, update }) {
  return (
    <>
      <label>Start Date & Time *</label>
      <input 
        type="datetime-local" 
        value={data.start_date || ""} 
        onChange={(e) => update({ ...data, start_date: e.target.value })} 
      />

      <label>End Date & Time *</label>
      <input 
        type="datetime-local" 
        value={data.end_date || ""} 
        onChange={(e) => update({ ...data, end_date: e.target.value })} 
      />
    </>
  );
}