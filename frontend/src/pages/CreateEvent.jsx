import { useState } from "react";
import api from "../api/axios";
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
import "./CreateEvent.css";

function CreateEvent() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "", description: "", location_data: {}, schedule: [], speakers: [], prizes: []
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
    try {
      await api.post("events/create/", formData);
      alert("Event Published Successfully!");
    } catch (err) { console.error("Error publishing event:", err); }
  };

  return (
    <div className="create-event-container">
      <div className="step-header">
        <h1>Host an Event</h1>
        <p>Section {step} of 16</p>
      </div>

      <div className="form-group">
        {renderStep()}
      </div>

      <div className="nav-buttons">
        <button className="btn-back" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</button>
        {step < 16 ? (
          <button className="btn-next" onClick={() => setStep(step + 1)}>Next</button>
        ) : (
          <button className="btn-submit" onClick={handleSubmit}>Publish</button>
        )}
      </div>
    </div>
  );
}

export default CreateEvent;