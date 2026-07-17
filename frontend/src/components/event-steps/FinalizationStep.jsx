function FinalizationStep({ data, update }) {
  return (
    <div>
      <h3>Certificates & Terms</h3>
      <label>
        <input type="checkbox" onChange={(e) => update({...data, certificates: e.target.checked})} />
        Provide Certificates?
      </label>
      <br/>
      <label>
        <input type="checkbox" required onChange={(e) => update({...data, terms: e.target.checked})} />
        Accept Terms & Privacy Policy
      </label>
    </div>
  );
}
export default FinalizationStep;