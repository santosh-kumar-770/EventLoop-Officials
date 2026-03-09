import { useEffect, useState } from "react";
import api from "../api/axios";
import UserCard from "../components/UserCard";

function Discover() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("connections/suggestions/")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>

      <h1>Discover People</h1>

      {users.length === 0 && <p>No suggestions yet</p>}

      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}

    </div>
  );
}

export default Discover;