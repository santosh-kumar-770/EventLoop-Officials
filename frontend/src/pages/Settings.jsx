import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";
import ImageCropper from "../components/ImageCropper"; // <-- NEW IMPORT

function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [myId, setMyId] = useState(null);
  const [username, setUsername] = useState("");

  const avatarInputRef = useRef(null);
  const backdropInputRef = useRef(null);

  const [avatarFile, setAvatarFile] = useState(null);
  const [backdropFile, setBackdropFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [backdropPreview, setBackdropPreview] = useState(null);

  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [removeBackdrop, setRemoveBackdrop] = useState(false);

  // NEW: State to manage the cropping modal
  const [cropConfig, setCropConfig] = useState({
    isOpen: false,
    imageSrc: null,
    type: null, // "avatar" or "backdrop"
    aspect: 1, // 1 for square (avatar), 3 for rectangle (backdrop)
  });

  const [formData, setFormData] = useState({
    bio: "", college: "", major: "", year: "", skills: "", interests: "",
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        const decodedId = jwtDecode(token).user_id;
        setMyId(decodedId);
        
        api.get(`users/${decodedId}/`)
          .then(res => {
            const { profile } = res.data;
            setUsername(res.data.username);
            setFormData({
              bio: profile.bio || "", college: profile.college || "", major: profile.major || "",
              year: profile.year || "", skills: profile.skills || "", interests: profile.interests || "",
            });
            if (profile.profile_picture) setAvatarPreview(profile.profile_picture);
            if (profile.backdrop) setBackdropPreview(profile.backdrop);
            setLoading(false);
          })
          .catch(() => {
            setMessage({ type: "error", text: "Failed to load profile data." });
            setLoading(false);
          });
      }
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UPDATED: Instead of setting the file directly, open the cropper modal
  const handleFileSelect = (e, type, aspect) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropConfig({ isOpen: true, imageSrc: reader.result, type, aspect });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null; // Reset input so you can select the same file again if needed
  };

  // NEW: Handle the output from the Cropper modal
  const handleCropComplete = (croppedFile) => {
    const previewUrl = URL.createObjectURL(croppedFile);
    
    if (cropConfig.type === "avatar") {
      setAvatarFile(croppedFile);
      setAvatarPreview(previewUrl);
      setRemoveAvatar(false);
    } else {
      setBackdropFile(croppedFile);
      setBackdropPreview(previewUrl);
      setRemoveBackdrop(false);
    }
    
    setCropConfig({ ...cropConfig, isOpen: false }); // Close modal
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation(); 
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
  };

  const handleRemoveBackdrop = (e) => {
    e.stopPropagation(); 
    setBackdropFile(null);
    setBackdropPreview(null);
    setRemoveBackdrop(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));

    if (avatarFile) dataToSend.append("profile_picture", avatarFile);
    if (backdropFile) dataToSend.append("backdrop", backdropFile);

    if (removeAvatar) dataToSend.append("remove_profile_picture", "true");
    if (removeBackdrop) dataToSend.append("remove_backdrop", "true");

    try {
      await api.put("users/profile/update/", dataToSend);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => navigate(`/profile/${myId}`), 1500);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}><div className="spinner" /></div>;

  return (
    <>
      {/* NEW: Render the Cropper Modal if it is open */}
      {cropConfig.isOpen && (
        <ImageCropper 
          imageSrc={cropConfig.imageSrc}
          aspect={cropConfig.aspect}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropConfig({ ...cropConfig, isOpen: false })}
        />
      )}

      <div style={{ maxWidth: "700px", margin: "0 auto", paddingBottom: "60px" }}>
        
        <div className="animate-fadeUp" style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>Edit Profile</h1>
            <p style={{ color: "var(--dim)", fontSize: "15px" }}>Customize how you appear to the campus network.</p>
          </div>
          <button onClick={() => navigate(`/profile/${myId}`)} className="btn btn-outline-blue">
            Cancel
          </button>
        </div>

        {message.text && (
          <div className="animate-fadeUp" style={{ 
            background: message.type === "success" ? "rgba(46, 213, 115, 0.1)" : "rgba(247,95,95,0.1)", 
            border: `1px solid ${message.type === "success" ? "rgba(46, 213, 115, 0.2)" : "rgba(247,95,95,0.2)"}`, 
            borderRadius: "10px", padding: "16px", marginBottom: "24px", fontSize: "14px", 
            color: message.type === "success" ? "var(--green)" : "var(--red)", fontWeight: 600
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="animate-fadeUp-1" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", overflow: "hidden", position: "relative" }}>
            
            {/* Backdrop Area */}
            <div 
              onClick={() => backdropInputRef.current.click()}
              style={{ 
                height: "120px", 
                background: backdropPreview ? `url(${backdropPreview}) center/cover` : "linear-gradient(135deg, var(--blue), var(--indigo))", 
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative"
              }}
            >
               <div style={{ background: "rgba(0,0,0,0.5)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", color: "white", fontWeight: 600 }}>
                 Click to change banner
               </div>
               
               {backdropPreview && (
                 <button 
                   type="button" onClick={handleRemoveBackdrop}
                   style={{
                     position: "absolute", top: "12px", right: "12px", background: "rgba(247,95,95,0.9)",
                     color: "white", border: "none", borderRadius: "8px", padding: "4px 12px", fontSize: "12px", fontWeight: 700, cursor: "pointer"
                   }}
                 >Remove</button>
               )}
            </div>
            {/* UPDATED: onChange uses the new handleFileSelect */}
            <input type="file" ref={backdropInputRef} style={{ display: "none" }} accept="image/*" onChange={(e) => handleFileSelect(e, "backdrop", 3)} />

            {/* Avatar Area */}
            <div style={{ padding: "0 32px 32px 32px", display: "flex", alignItems: "flex-end", marginTop: "-40px", position: "relative", zIndex: 10 }}>
              
              <div style={{ position: "relative" }}>
                <div 
                  onClick={() => avatarInputRef.current.click()}
                  style={{ 
                    width: "100px", height: "100px", borderRadius: "24px", background: avatarPreview ? `url(${avatarPreview}) center/cover` : "var(--surface)", 
                    border: "4px solid var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", 
                    fontSize: "36px", fontWeight: 800, color: "var(--blue)", cursor: "pointer", position: "relative", overflow: "hidden"
                  }}
                >
                  {!avatarPreview && username && username[0].toUpperCase()}
                  <div style={{ position: "absolute", bottom: 0, background: "rgba(0,0,0,0.6)", width: "100%", textAlign: "center", padding: "4px 0", fontSize: "10px", color: "white" }}>
                    Edit
                  </div>
                </div>
                
                {avatarPreview && (
                  <button
                    type="button" onClick={handleRemoveAvatar}
                    style={{
                      position: "absolute", top: "-5px", right: "-5px", width: "24px", height: "24px", background: "var(--red)", color: "white", 
                      border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                    }}
                  >×</button>
                )}
              </div>
              {/* UPDATED: onChange uses the new handleFileSelect */}
              <input type="file" ref={avatarInputRef} style={{ display: "none" }} accept="image/*" onChange={(e) => handleFileSelect(e, "avatar", 1)} />
            </div>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "32px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--dim)", display: "block", marginBottom: "8px" }}>BIO</label>
            <textarea className="input" name="bio" value={formData.bio} onChange={handleChange} style={{ minHeight: "100px", resize: "vertical" }} />
          </div>

          <button 
            type="submit" disabled={saving}
            style={{
              width: "100%", padding: "16px", borderRadius: "12px", border: "none", background: saving ? "var(--surface2)" : "linear-gradient(135deg, var(--blue), var(--indigo))", color: saving ? "var(--dim)" : "white", fontSize: "16px", fontWeight: 700, cursor: saving ? "default" : "pointer"
            }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </>
  );
}

export default Settings;