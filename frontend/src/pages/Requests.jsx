import { useEffect, useState } from "react";
import api from "../api/axios";
import { acceptConnection, rejectConnection } from "../api/connections";

function Requests() {

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get("connections/pending/")
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAccept = async (connectionId) => {
    try {
      await acceptConnection(connectionId);
      setRequests((prev) =>
        prev.filter((req) => req.connection_id !== connectionId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await rejectConnection(connectionId);
      setRequests((prev) =>
        prev.filter((req) => req.connection_id !== connectionId)
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
          key={req.connection_id}
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
          <h3>@{req.username}</h3>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => handleAccept(req.connection_id)}>
              Accept
            </button>
            <button onClick={() => handleReject(req.connection_id)}>
              Reject
            </button>
          </div>

        </div>
      ))}

    </div>
  );
}

export default Requests;