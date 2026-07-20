export default function ResourcesStep({ data, update }) {
  return (
    <>
      <label>GitHub Repository / Problem Statement Link</label>
      <input 
        type="url" 
        placeholder="https://github.com/organization/repo" 
        value={data.repo || ""} 
        onChange={(e) => update({ ...data, repo: e.target.value })} 
      />

      <label>Community Group (Discord / WhatsApp / Telegram)</label>
      <input 
        type="url" 
        placeholder="https://discord.gg/invitecode" 
        value={data.social || ""} 
        onChange={(e) => update({ ...data, social: e.target.value })} 
      />
    </>
  );
}