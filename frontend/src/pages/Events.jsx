import { useEffect, useState } from "react";
import api from "../api/axios";

function Events() {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("events/")
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const joinEvent = async (eventId) => {

    console.log("Sending request for event:", eventId);

    try {
      const res = await api.post("events/register/", {
        event: eventId
      });

      console.log(res.data);

      alert("You joined the event!");

    } catch (err) {
      console.error("Registration failed:", err.response?.data);
    }
  };

  return (
    <div>

      <h1>Campus Events</h1>

      {events.length === 0 && <p>No events available</p>}

      {events.map((event) => (
        <div
          key={event.id}
          style={{
            border: "1px solid #444",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "15px"
          }}
        >

          <h2>{event.title}</h2>

          <p>{event.description}</p>

          <p><b>Date:</b> {event.date}</p>

          <button onClick={() => {
            console.log("JOIN CLICKED");
            joinEvent(event.id);
          }}>
            Join Event
          </button>

        </div>
      ))}

    </div>
  );
}

export default Events;