export default function FinalizationStep({ data, update }) {
  return (
    <>
      <h3>Final Checks & Terms</h3>
      
      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginTop: "12px" }}>
        <input 
          type="checkbox" 
          checked={data.certificates || false} 
          onChange={(e) => update({ ...data, certificates: e.target.checked })} 
          style={{ width: "auto" }}
        />
        Digital Certificates will be provided to attendees
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginTop: "12px" }}>
        <input 
          type="checkbox" 
          checked={data.terms || false} 
          onChange={(e) => update({ ...data, terms: e.target.checked })} 
          style={{ width: "auto" }}
        />
        I accept the Terms & Conditions and Privacy Policy *
      </label>
    </>
  );
}