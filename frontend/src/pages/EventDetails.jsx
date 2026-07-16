import RegisterButton from "../components/RegisterButton";
const handleRegister = async () => {
    try {
        await api.post(`registrations/register/${eventId}/`);
        alert("You are now registered!");
    } catch (err) {
        console.error("Registration failed", err);
    }
};

// Inside your JSX:

<div style={{ marginTop: "20px" }}>
    <button
        onClick={handleRegister}
        className="btn btn-blue"
    >
        Register for Event
    </button>
    <RegisterButton eventId={event.id} />
</div>