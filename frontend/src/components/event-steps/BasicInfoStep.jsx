function BasicInfoStep({ data, update }) {
  return (
    <div>
      <input 
        placeholder="Event Title" 
        value={data.title}
        onChange={(e) => update({...data, title: e.target.value})}
        style={{ width: "100%", padding: "10px", margin: "10px 0" }}
      />
      <textarea 
        placeholder="Event Description" 
        value={data.description}
        onChange={(e) => update({...data, description: e.target.value})}
        style={{ width: "100%", padding: "10px", margin: "10px 0" }}
      />
    </div>
  );
}
export default BasicInfoStep;