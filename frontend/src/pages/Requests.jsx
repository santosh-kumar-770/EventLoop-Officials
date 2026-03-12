import { useEffect, useState } from "react";
import api from "../api/axios";
import { acceptConnection, rejectConnection } from "../api/connections";

function Requests() {

  const [requests, setRequests] = useState([]);

  // Fetch pending requests
  useEffect(() => {
    api.get("connections/pending/")
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Accept request
  const handleAccept = async (id) => {
    try {
      await acceptConnection(id);

      // remove request from UI
      setRequests((prev) =>
        prev.filter((req) => req.id !== id)
      );

    } catch (err) {
      console.error(err);
    }
  };

  // Reject request
  const handleReject = async (id) => {
    try {
      await rejectConnection(id);

      setRequests((prev) =>
        prev.filter((req) => req.id !== id)
      );

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      <h1>Connection Requests</h1>

      {requests.length === 0 && <p>No pending requests</p>}

      {requests.map((req) => (
        <div
          key={req.id}
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
          <h3>{req.sender.username}</h3>

          <div style={{ display: "flex", gap: "10px" }}>

            <button onClick={() => handleAccept(req.id)}>
              Accept
            </button>

            <button onClick={() => handleReject(req.id)}>
              Reject
            </button>

          </div>

        </div>
      ))}

    </div>
  );
}

export default Requests;