import { useEffect, useState } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";

function Dashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("dashboard/")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>UniVoice Dashboard 🚀</h1>

      {!data && <p>Loading dashboard...</p>}

      {data && (
        <>
          <h2>Upcoming Events</h2>

          {data.upcoming_events.map(event => (
            <EventCard key={event.id} title={event.title} />
          ))}

          <h2 style={{ marginTop: "30px" }}>Connections Activity</h2>

          {data.connections_activity.length === 0 && (
            <p>No activity yet</p>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;