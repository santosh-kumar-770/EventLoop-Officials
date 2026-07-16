import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getConversation, sendMessage } from "../api/messaging";
import api from "../api/axios";

function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  let currentUserId = null;
  try {
    const token = localStorage.getItem("access_token");
    if (token) currentUserId = jwtDecode(token).user_id;
  } catch (e) {}

  const fetchMessages = () => {
    getConversation(userId)
      .then(res => setMessages(res.data))
      .catch(err => { if (err.response?.status === 403) navigate("/network"); });
  };

  useEffect(() => {
    api.get(`users/profile/${userId}/`).then(res => setOtherUser(res.data)).catch(() => {});
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    setInput("");
    try {
      const res = await sendMessage(parseInt(userId), content);
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error(err);
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const groupedMessages = [];
  let lastDate = null;
  for (const msg of messages) {
    const dateLabel = formatDate(msg.created_at);
    if (dateLabel !== lastDate) { groupedMessages.push({ type: "date", label: dateLabel }); lastDate = dateLabel; }
    groupedMessages.push({ type: "message", ...msg });
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", height: "calc(100vh - 72px)", display: "flex", flexDirection: "column", padding: "0 16px" }}>

      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "20px 0 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <button onClick={() => navigate("/messages")} style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "20px", padding: "4px" }}>←</button>
        <div onClick={() => navigate(`/profile/${userId}`)} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, var(--blue), var(--indigo))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "15px", color: "white", cursor: "pointer", fontFamily: "Syne, sans-serif", flexShrink: 0 }}>
          {otherUser?.username?.[0]?.toUpperCase() || "?"}
        </div>
        <div onClick={() => navigate(`/profile/${userId}`)} style={{ cursor: "pointer" }}>
          <div style={{ fontWeight: 700, fontSize: "16px" }}>@{otherUser?.username || "..."}</div>
          {otherUser?.profile?.college && <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: "1px" }}>{otherUser.profile.college}</div>}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 0", display: "flex", flexDirection: "column", gap: "4px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>👋</div>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>You're connected with @{otherUser?.username}.<br />Say hello!</p>
          </div>
        )}

        {groupedMessages.map((item, i) => {
          if (item.type === "date") return (
            <div key={`date-${i}`} style={{ textAlign: "center", margin: "16px 0 8px", fontSize: "12px", color: "var(--dim)" }}>{item.label}</div>
          );
          
          const isMine = Number(item.sender) === Number(currentUserId);
          return (
            <div key={item.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: "8px" }}>
              <div style={{ 
                maxWidth: "72%", padding: "10px 14px", 
                borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px", 
                background: isMine ? "var(--blue)" : "var(--surface)", 
                border: isMine ? "none" : "1px solid var(--border)", 
                color: isMine ? "white" : "var(--text)", 
                fontSize: "14px", lineHeight: "1.5", wordBreak: "break-word" 
              }}>
                {item.content}
                <div style={{ fontSize: "10px", opacity: 0.65, marginTop: "4px", textAlign: isMine ? "right" : "left" }}>
                    {formatTime(item.created_at)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: "10px", padding: "16px 0 20px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Type a message..."
          rows={1}
          style={{ flex: 1, padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: "14px", resize: "none", outline: "none" }}
        />
        <button onClick={handleSend} disabled={!input.trim() || sending}
          style={{ padding: "12px 20px", borderRadius: "12px", border: "none", background: input.trim() ? "var(--blue)" : "var(--surface)", color: input.trim() ? "white" : "var(--dim)", fontSize: "14px", fontWeight: 600, cursor: input.trim() ? "pointer" : "default" }}>
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chat;