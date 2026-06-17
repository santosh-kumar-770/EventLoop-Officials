// frontend/src/components/ImageCropper.jsx
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";

function ImageCropper({ imageSrc, aspect, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedFile);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 1000,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ position: "relative", width: "90%", maxWidth: "600px", height: "400px", background: "#333", borderRadius: "12px", overflow: "hidden" }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
        />
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "16px", background: "var(--surface)", padding: "16px", borderRadius: "12px" }}>
        <button 
          onClick={onCancel}
          style={{ padding: "8px 16px", background: "transparent", color: "var(--dim)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer" }}
        >
          Cancel
        </button>
        <button 
          onClick={handleConfirm}
          style={{ padding: "8px 24px", background: "var(--blue)", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
        >
          Apply Crop
        </button>
      </div>
    </div>
  );
}

export default ImageCropper;