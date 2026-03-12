import { sendConnectionRequest } from "../api/connections";

function UserCard({ user }) {

  const sendRequest = async () => {
    try {
      await sendConnectionRequest(user.id);
      alert("Connection request sent!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #444",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h3>{user.username}</h3>

      <button onClick={sendRequest}>
        Connect
      </button>

    </div>
  );
}

export default UserCard;