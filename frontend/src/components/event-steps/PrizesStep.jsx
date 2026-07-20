export default function PrizesStep({ data, update }) {
  const prizes = data.prizes || [];

  const addPrize = () => {
    update({ ...data, prizes: [...prizes, { rank: "", reward: "" }] });
  };

  const updatePrize = (index, field, value) => {
    const updated = [...prizes];
    updated[index][field] = value;
    update({ ...data, prizes: updated });
  };

  return (
    <>
      <h3>Prizes & Rewards</h3>
      {prizes.map((p, idx) => (
        <div key={idx} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input 
            type="text" 
            placeholder="Rank (e.g. 1st Place)" 
            value={p.rank} 
            onChange={(e) => updatePrize(idx, "rank", e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Reward (e.g. $1,000 + Swags)" 
            value={p.reward} 
            onChange={(e) => updatePrize(idx, "reward", e.target.value)} 
          />
        </div>
      ))}
      <button type="button" onClick={addPrize} className="btn-prev" style={{ marginTop: "8px" }}>
        + Add Prize Tier
      </button>
    </>
  );
}