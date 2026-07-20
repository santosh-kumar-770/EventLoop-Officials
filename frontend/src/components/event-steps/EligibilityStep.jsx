export default function EligibilityStep({ data, update }) {
  return (
    <>
      <label>Target Audience / Who Can Participate?</label>
      <select 
        value={data.target_audience || "students"} 
        onChange={(e) => update({ ...data, target_audience: e.target.value })}
      >
        <option value="students">College Students</option>
        <option value="professionals">Working Professionals</option>
        <option value="everyone">Everyone</option>
      </select>

      <label>Required Skills or Prerequisites</label>
      <textarea 
        rows="3" 
        placeholder="Basic Python, React, or system design knowledge..." 
        value={data.skills || ""} 
        onChange={(e) => update({ ...data, skills: e.target.value })} 
      />
    </>
  );
}