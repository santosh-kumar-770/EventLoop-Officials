import { useState } from "react";
import api from "../api/axios";
import "./CreateEvent.css";

// Step Component Imports
import BasicInfoStep from "../components/event-steps/BasicInfoStep";
import DateTimeStep from "../components/event-steps/DateTimeStep";
import LocationStep from "../components/event-steps/LocationStep";
import OrganizerStep from "../components/event-steps/OrganizerStep";
import RegistrationStep from "../components/event-steps/RegistrationStep";
import EligibilityStep from "../components/event-steps/EligibilityStep";
import ScheduleStep from "../components/event-steps/ScheduleStep";
import SpeakersStep from "../components/event-steps/SpeakersStep";
import PrizesStep from "../components/event-steps/PrizesStep";
import ResourcesStep from "../components/event-steps/ResourcesStep";
import VisibilityStep from "../components/event-steps/VisibilityStep";
import FinalizationStep from "../components/event-steps/FinalizationStep";

function CreateEvent() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    category: "Hackathon",
    start_date: "",
    end_date: "",
    location_data: { type: "offline" },
    org_name: "",
    contact_email: "",
    linkedin: "",
    registration_required: true,
    max_participants: "",
    target_audience: "students",
    skills: "",
    schedule: [],
    speakers: [],
    prizes: [],
    repo: "",
    social: "",
    visibility: "public",
    support_email: "",
    certificates: false,
    terms: false
  });

  const renderStep = () => {
    switch (step) {
      case 1: return <BasicInfoStep data={formData} update={setFormData} />;
      case 2: return <DateTimeStep data={formData} update={setFormData} />;
      case 3: return <LocationStep data={formData} update={setFormData} />;
      case 4: return <OrganizerStep data={formData} update={setFormData} />;
      case 5: return <RegistrationStep data={formData} update={setFormData} />;
      case 6: return <EligibilityStep data={formData} update={setFormData} />;
      case 7: return <ScheduleStep data={formData} update={setFormData} />;
      case 8: return <SpeakersStep data={formData} update={setFormData} />;
      case 9: return <PrizesStep data={formData} update={setFormData} />;
      case 10: return <ResourcesStep data={formData} update={setFormData} />;
      case 11:
      case 12:
      case 13: return <VisibilityStep data={formData} update={setFormData} />;
      case 14:
      case 15:
      case 16: return <FinalizationStep data={formData} update={setFormData} />;
      default: return <BasicInfoStep data={formData} update={setFormData} />;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("events/create/", formData);
      alert("Event Published Successfully!");
      window.location.href = "/events";
    } catch (err) {
      console.error("Error publishing event:", err);
      alert("Failed to publish event. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate percentage for the animated bar (Step 1 to 16)
  const progressPercentage = (step / 16) * 100;

  return (
    <div className="create-event-wrapper">
      <div className="create-event-card">
        <div className="event-progress-header">
          <h2>Host an Event</h2>
          <span className="step-indicator">Step {step} of 16</span>
        </div>

        {/* Animated Progress Bar */}
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="form-step-content">
          {renderStep()}
        </div>

        <div className="event-nav-actions">
          {step > 1 ? (
            <button className="btn-prev" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : <div />}

          {step < 16 ? (
            <button className="btn-next" onClick={() => setStep(step + 1)}>
              Next Step
            </button>
          ) : (
            <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Publishing..." : "Publish Event"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;