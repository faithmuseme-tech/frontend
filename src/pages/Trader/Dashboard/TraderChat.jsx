import React, { useEffect, useState, useRef, useCallback } from "react";
import { FiMessageCircle, FiShield, FiCornerUpLeft, FiClock, FiAlertCircle } from "react-icons/fi";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import ChatAttachment from "../../../components/Chat/ChatAttachment";
import ChatInput from "../../../components/Chat/ChatInput";

const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("en-UG", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-UG", { day: "numeric", month: "short" });

const ReplyPreview = ({ reply, isMe }) => {
  if (!reply) return null;
  const label = reply.file_type && !reply.body
    ? (reply.file_type === "image" ? "📷 Photo" : reply.file_type === "video" ? "🎥 Video" : `📄 ${reply.file_name || "File"}`)
    : reply.body?.slice(0, 60);
  return (
    <div className={`text-xs px-2 py-1 rounded-lg mb-1 border-l-4 ${isMe ? "bg-indigo-500 border-indigo-300 text-indigo-100" : "bg-gray-200 border-gray-400 text-gray-500"}`}>
      <span className="font-semibold">{reply.sender_name}: </span>{label}
    </div>
  );
};

const TraderChat = () => {
  const { user }            = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const bottomRef           = useRef(null);
  const scrollRef           = useRef(null);
  const pollRef             = useRef(null);
  const initialLoad         = useRef(true);
  const justSent            = useRef(false);

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  const scrollToBottom = (smooth = false) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  };

  const fetchMessages = useCallback(async (silent = false) => {
    try {
      const r = await api.get("/chat/my/");
      setMessages(r.data.messages || []);
      if (!silent) window.dispatchEvent(new Event("chat-unread-cleared"));
    } catch {}
    finally { if (!silent) setLoading(false); }
  }, []);

  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(() => fetchMessages(true), 4000);
    return () => clearInterval(pollRef.current);
  }, [fetchMessages]);

  useEffect(() => {
    if (messages.length === 0) return;
    if (initialLoad.current) {
      scrollToBottom(false);
      initialLoad.current = false;
      return;
    }
    if (justSent.current || isNearBottom()) {
      scrollToBottom(true);
      justSent.current = false;
    }
  }, [messages]);

  const send = async (formData) => {
    if (sending) return false;
    setSending(true);
    const tempId = `temp_${Date.now()}`;
    const body = formData.get("body") || "";
    const file = formData.get("file");
    const replyToId = formData.get("reply_to");
    const tempMsg = {
      id: tempId,
      sender: user?.id,
      sender_name: user?.username || user?.email,
      body,
      file_url: file && file.type?.startsWith("image/") ? URL.createObjectURL(file) : "",
      file_type: file ? (file.type?.startsWith("image/") ? "image" : file.type?.startsWith("video/") ? "video" : file.type?.startsWith("audio/") ? "audio" : "doc") : "",
      file_name: file?.name || "",
      reply_to: replyToId ? messages.find(m => String(m.id) === String(replyToId)) || null : null,
      is_read: false, is_edited: false, is_deleted: false,
      created_at: new Date().toISOString(),
      _pending: true,
    };
    justSent.current = true;
    setMessages((prev) => [...prev, tempMsg]);
    setReplyTo(null);
    try {
      const r = await api.post("/chat/my/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setMessages((prev) => prev.map(m => m.id === tempId ? r.data : m));
      return true;
    } catch {
      setMessages((prev) => prev.map(m => m.id === tempId ? { ...m, _pending: false, _failed: true } : m));
      return false;
    } finally { setSending(false); }
  };

  const retrySend = async (tempMsg) => {
    setMessages((prev) => prev.filter(m => m.id !== tempMsg.id));
    const fd = new FormData();
    if (tempMsg.body) fd.append("body", tempMsg.body);
    if (tempMsg.reply_to) fd.append("reply_to", tempMsg.reply_to.id);
    await send(fd);
  };

  const grouped = messages.reduce((acc, msg) => {
    const day = fmtDate(msg.created_at);
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: "calc(100vh - 160px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <FiShield className="text-indigo-600 text-lg" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">CartPulse Support</p>
          <p className="text-xs text-green-500 font-semibold">● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className="h-10 w-48 bg-gray-100 rounded-2xl animate-pulse" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <FiMessageCircle className="text-5xl text-gray-200 mx-auto" />
            <p className="text-gray-500 font-medium text-sm">No messages yet.</p>
            <p className="text-gray-400 text-xs">Send a message and our team will respond shortly.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([day, msgs]) => (
            <div key={day} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-semibold">{day}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              {msgs.map((msg) => {
                const isMe = msg.sender === user?.id;
                return (
                  <div key={msg.id} className={`flex group ${isMe ? "justify-end" : "justify-start"}`}>
                    {!isMe && (
                      <button
                        onClick={() => setReplyTo({ ...msg, sender_name: msg.sender_name })}
                        className="opacity-0 group-hover:opacity-100 self-center mr-2 text-gray-400 hover:text-indigo-500 transition-all"
                        title="Reply"
                      >
                        <FiCornerUpLeft className="text-base" />
                      </button>
                    )}

                    <div className="max-w-[75%] space-y-1">
                      {!isMe && (
                        <p className="text-xs text-gray-400 font-semibold px-1">
                          {msg.is_admin_msg ? "CartPulse Support" : msg.sender_name}
                        </p>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}>
                        <ReplyPreview reply={msg.reply_to} isMe={isMe} />
                        {msg.body && <p>{msg.body}</p>}
                        <ChatAttachment
                          fileUrl={msg.file_url}
                          fileType={msg.file_type}
                          fileName={msg.file_name}
                          isMe={isMe}
                        />
                      </div>
                      <div className={`flex items-center gap-1 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                        <span className="text-xs text-gray-400">{fmtTime(msg.created_at)}</span>
                        {isMe && (
                          msg._failed ? (
                            <button
                              onClick={() => retrySend(msg)}
                              className="flex items-center gap-0.5 text-red-400 hover:text-red-600"
                              title="Failed — tap to retry"
                            >
                              <FiAlertCircle size={13} />
                              <span className="text-xs">Retry</span>
                            </button>
                          ) : msg._pending ? (
                            <FiClock size={12} className="text-gray-400 flex-shrink-0" />
                          ) : (
                            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="flex-shrink-0">
                              <path d="M1 5.5L4.5 9L10 3" stroke={msg.is_read ? "#3b82f6" : "#9ca3af"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5 5.5L8.5 9L14 3" stroke={msg.is_read ? "#3b82f6" : "#9ca3af"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )
                        )}
                      </div>
                    </div>

                    {isMe && (
                      <button
                        onClick={() => setReplyTo({ ...msg, sender_name: msg.sender_name })}
                        className="opacity-0 group-hover:opacity-100 self-center ml-2 text-gray-400 hover:text-indigo-500 transition-all"
                        title="Reply"
                      >
                        <FiCornerUpLeft className="text-base" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={send}
        sending={sending}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
};

export default TraderChat;
