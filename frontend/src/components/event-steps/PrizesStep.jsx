function PrizesStep({ data, update }) {
  const addPrize = () => {
    update({ ...data, prizes: [...(data.prizes || []), { rank: "", reward: "" }] });
  };

  return (
    <div>
      <h3>Prizes</h3>
      {(data.prizes || []).map((prize, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <input placeholder="Rank (e.g., 1st Place)" value={prize.rank} onChange={(e) => {
            const updated = [...data.prizes];
            updated[index].rank = e.target.value;
            update({...data, prizes: updated});
          }} />
          <input placeholder="Reward/Amount" value={prize.reward} onChange={(e) => {
            const updated = [...data.prizes];
            updated[index].reward = e.target.value;
            update({...data, prizes: updated});
          }} />
        </div>
      ))}
      <button onClick={addPrize}>+ Add Prize</button>
    </div>
  );
}
export default PrizesStep;