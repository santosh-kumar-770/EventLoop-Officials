import { useEffect, useState } from "react";
import api from "../api/axios";

function Network() {

  const [connections, setConnections] = useState([]);

  useEffect(() => {
    api.get("connections/my/")
      .then((res) => {
        setConnections(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>

      <h1>My Network</h1>

      {connections.length === 0 && <p>No connections yet</p>}

      {connections.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid #444",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "15px"
          }}
        >
          <h3>{user.username}</h3>
        </div>
      ))}

    </div>
  );
}

export default Network;