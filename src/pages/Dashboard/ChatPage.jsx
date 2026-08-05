import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiMessageCircle, FiShield, FiCornerUpLeft, FiChevronDown, FiEdit2, FiTrash2, FiCheckSquare, FiX, FiCheck } from "react-icons/fi";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ChatAttachment from "../../components/Chat/ChatAttachment";
import ChatInput from "../../components/Chat/ChatInput";

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
    <div className={`text-xs px-2 py-1 rounded-lg mb-1 border-l-4 ${isMe ? "bg-[#c5f0a4] border-green-400 text-gray-600" : "bg-gray-100 border-gray-300 text-gray-500"}`}>
      <span className="font-semibold">{reply.sender_name}: </span>{label}
    </div>
  );
};

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [sending, setSending]             = useState(false);
  const [replyTo, setReplyTo]             = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [contextMenu, setContextMenu]     = useState(null); // { msgId, x, y }
  const [editingId, setEditingId]         = useState(null);
  const [editBody, setEditBody]           = useState("");
  const [selected, setSelected]           = useState(new Set());
  const [selectMode, setSelectMode]       = useState(false);
  const bottomRef                         = useRef(null);
  const scrollRef                         = useRef(null);
  const initialLoad                       = useRef(true);
  const justSent                          = useRef(false);
  const editRef                           = useRef(null);

  // close context menu on outside click
  useEffect(() => {
    const close = () => setContextMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // focus edit textarea
  useEffect(() => {
    if (editingId) editRef.current?.focus();
  }, [editingId]);

  const openContextMenu = (e, msg) => {
    if (msg.sender !== user.id) return;
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ msgId: msg.id, msg, x: e.clientX, y: e.clientY });
  };

  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditBody(msg.body);
    setContextMenu(null);
  };

  const submitEdit = async (msgId) => {
    if (!editBody.trim()) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/chat/messages/${msgId}/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ body: editBody.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => prev.map(m => m.id === msgId ? data : m));
      }
    } catch {}
    setEditingId(null);
  };

  const deleteMsg = async (msgId) => {
    setContextMenu(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/chat/messages/${msgId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => prev.map(m => m.id === msgId ? data : m));
      }
    } catch {}
  };

  const bulkDelete = async () => {
    if (!selected.size) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/chat/messages/bulk-delete/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selected] }),
      });
      if (res.ok) {
        const { deleted } = await res.json();
        setMessages(prev => prev.map(m => deleted.includes(m.id) ? { ...m, is_deleted: true, body: "", file_url: "", file_type: "", file_name: "" } : m));
      }
    } catch {}
    setSelected(new Set());
    setSelectMode(false);
  };

  const toggleSelect = (msgId) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(msgId) ? next.delete(msgId) : next.add(msgId);
      return next;
    });
  };

  const exitSelectMode = () => { setSelectMode(false); setSelected(new Set()); };

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const scrollToBottom = (smooth = false) => {
    const el = scrollRef.current;
    if (!el) return;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  };

  const handleScroll = () => {
    setShowScrollBtn(!isNearBottom());
  };

  const fetchMessages = useCallback(async (silent = false) => {
    try {
      const r = await api.get("/chat/my/");
      setMessages(r.data.messages || []);
      if (!silent) setLoading(false);
    } catch {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchMessages();

    let interval;
    let inactivityTimer;
    let active = true;

    const startPolling = () => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (document.visibilityState === "visible") fetchMessages(true);
      }, 12000);
    };

    const resetInactivity = () => {
      clearTimeout(inactivityTimer);
      if (!active) { active = true; startPolling(); }
      inactivityTimer = setTimeout(() => {
        active = false;
        clearInterval(interval);
      }, 5 * 60 * 1000); // stop after 5min no interaction
    };

    startPolling();
    resetInactivity();

    const onVisible = () => { if (active) fetchMessages(true); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("mousemove", resetInactivity);
    window.addEventListener("keydown", resetInactivity);

    return () => {
      clearInterval(interval);
      clearTimeout(inactivityTimer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("mousemove", resetInactivity);
      window.removeEventListener("keydown", resetInactivity);
    };
  }, [user, fetchMessages]);

  useEffect(() => {
    if (messages.length === 0) return;
    if (initialLoad.current) {
      scrollToBottom(false);
      initialLoad.current = false;
      setShowScrollBtn(false);
      return;
    }
    if (justSent.current) {
      scrollToBottom(true);
      justSent.current = false;
      setShowScrollBtn(false);
    } else if (isNearBottom()) {
      scrollToBottom(false);
    }
  }, [messages]);

  const send = async (formData) => {
    if (sending) return false;
    setSending(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/chat/my/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Send failed:", err);
        return false;
      }
      const data = await res.json();
      justSent.current = true;
      setMessages((prev) => [...prev, data]);
      setReplyTo(null);
      return true;
    } catch (err) {
      console.error("Send failed:", err.message);
      return false;
    } finally { setSending(false); }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <FiMessageCircle className="text-5xl text-indigo-300" />
        <h2 className="text-xl font-extrabold text-gray-900">Sign in to Chat</h2>
        <p className="text-gray-500 text-sm">You need an account to message CartPulse support.</p>
        <div className="flex gap-3">
          <Link to="/login" className="bg-primary-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm">Sign In</Link>
          <Link to="/register" className="border border-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl text-sm">Register</Link>
        </div>
      </div>
    );
  }

  const grouped = messages.reduce((acc, msg) => {
    const day = fmtDate(msg.created_at);
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col" style={{ zIndex: 40 }}>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <FiChevronRight className="text-xs" />
          <Link to="/inbox" className="hover:text-primary-600">Inbox</Link>
          <FiChevronRight className="text-xs" />
          <span className="text-gray-800 font-semibold">Chat Support</span>
        </div>
      </div>

      {/* Chat header */}
      <div className="bg-white border-b border-gray-100 flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FiShield className="text-indigo-600 text-lg" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">CartPulse Support</p>
            <p className="text-xs text-green-500 font-semibold">● Online</p>
          </div>
        </div>
      </div>

      {/* Messages — fills remaining space between header and input */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-none min-h-0"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-1">
          {loading ? (
            <div className="space-y-3">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <div className="h-10 w-48 bg-gray-200 rounded-2xl animate-pulse" />
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
              <div key={day} className="space-y-1">
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-semibold px-2">{day}</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                {msgs.map((msg) => {
                  const isMe = msg.sender === user.id;
                  const isSelected = selected.has(msg.id);
                  return (
                    <div
                      key={msg.id}
                      className={`flex group items-end ${
                        isMe ? "justify-end" : "justify-start"
                      } ${isSelected ? "bg-indigo-50 rounded-xl" : ""}`}
                      onClick={() => selectMode && isMe && toggleSelect(msg.id)}
                    >
                      {/* Select checkbox */}
                      {selectMode && isMe && (
                        <div className={`self-center mr-2 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300 bg-white"
                        }`}>
                          {isSelected && <FiCheck className="text-white text-xs" />}
                        </div>
                      )}

                      {/* Reply button */}
                      {!isMe && !selectMode && (
                        <button
                          onClick={() => setReplyTo({ ...msg, sender_name: msg.sender_name })}
                          className="opacity-0 group-hover:opacity-100 self-center mr-2 text-gray-400 hover:text-indigo-500 transition-all"
                        >
                          <FiCornerUpLeft className="text-base" />
                        </button>
                      )}

                      <div className="max-w-[75%] space-y-0.5">
                        {!isMe && (
                          <p className="text-xs text-gray-400 font-semibold px-1">
                            {msg.is_admin_msg ? "CartPulse Support" : msg.sender_name}
                          </p>
                        )}

                        {/* Bubble */}
                        <div
                          onContextMenu={(e) => isMe && !msg.is_deleted && openContextMenu(e, msg)}
                          onTouchStart={(e) => {
                            if (!isMe || msg.is_deleted) return;
                            const t = setTimeout(() => openContextMenu(e.touches[0], msg), 500);
                            e.currentTarget._longPress = t;
                          }}
                          onTouchEnd={(e) => clearTimeout(e.currentTarget._longPress)}
                          onTouchMove={(e) => clearTimeout(e.currentTarget._longPress)}
                          className={`rounded-2xl text-sm leading-relaxed overflow-hidden select-none ${
                            isMe ? "bg-[#e2ffc7] text-gray-800 rounded-br-sm" : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
                          }`}
                        >
                          {msg.is_deleted ? (
                            <p className="px-4 py-2.5 italic text-sm opacity-60">🚫 This message was deleted</p>
                          ) : editingId === msg.id ? (
                            <div className="px-3 py-2 flex items-end gap-2">
                              <textarea
                                ref={editRef}
                                value={editBody}
                                onChange={e => setEditBody(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitEdit(msg.id); } if (e.key === "Escape") setEditingId(null); }}
                                rows={1}
                                className="flex-1 resize-none bg-[#c5f0a4] text-gray-800 placeholder-gray-400 rounded-lg px-2 py-1 text-sm focus:outline-none max-h-24 overflow-y-auto"
                              />
                              <button onClick={() => submitEdit(msg.id)} className="text-gray-600 hover:text-green-600"><FiCheck /></button>
                              <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-red-500"><FiX /></button>
                            </div>
                          ) : (
                            <>
                              {msg.reply_to && <div className="px-4 pt-2.5"><ReplyPreview reply={msg.reply_to} isMe={isMe} /></div>}
                              <ChatAttachment fileUrl={msg.file_url} fileType={msg.file_type} fileName={msg.file_name} isMe={isMe} />
                              {msg.body ? <p className="px-4 py-2">{msg.body}</p> : !msg.file_url && <div className="px-4 py-2.5" />}
                            </>
                          )}
                        </div>

                        {/* Timestamp + edited */}
                        <div className={`flex items-center gap-1 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                          {msg.is_edited && !msg.is_deleted && <span className="text-xs text-gray-400 italic">edited</span>}
                          <span className="text-xs text-gray-400">{fmtTime(msg.created_at)}</span>
                          {isMe && !msg.is_deleted && (
                            <svg width="18" height="11" viewBox="0 0 18 11" fill="none" className="flex-shrink-0">
                              {/* first tick */}
                              <path d="M1 5.5L4 8.5L9 3" stroke={msg.is_read ? "#4fc3f7" : "#9ca3af"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              {/* second tick — offset right so they sit side by side like ✓✓ */}
                              <path d="M6 5.5L9 8.5L14 3" stroke={msg.is_read ? "#4fc3f7" : "#9ca3af"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Reply / select button on right for own messages */}
                      {isMe && !selectMode && (
                        <button
                          onClick={() => setReplyTo({ ...msg, sender_name: msg.sender_name })}
                          className="opacity-0 group-hover:opacity-100 self-center ml-2 text-gray-400 hover:text-indigo-500 transition-all"
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
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 min-w-[160px]"
          style={{ top: Math.min(contextMenu.y, window.innerHeight - 120), left: Math.min(contextMenu.x, window.innerWidth - 180) }}
          onClick={e => e.stopPropagation()}
        >
          {contextMenu.msg.body && (
            <button onClick={() => startEdit(contextMenu.msg)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              <FiEdit2 className="text-indigo-500" /> Edit
            </button>
          )}
          <button onClick={() => { setSelectMode(true); toggleSelect(contextMenu.msgId); setContextMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
            <FiCheckSquare className="text-indigo-500" /> Select
          </button>
          <button onClick={() => deleteMsg(contextMenu.msgId)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
            <FiTrash2 /> Delete
          </button>
        </div>
      )}

      {/* Select-mode toolbar */}
      {selectMode && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between max-w-3xl mx-auto">
          <button onClick={exitSelectMode} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <FiX /> Cancel
          </button>
          <span className="text-sm font-semibold text-gray-700">{selected.size} selected</span>
          <button
            onClick={bulkDelete}
            disabled={!selected.size}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 disabled:opacity-40"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      )}

      {/* Scroll-to-bottom button */}
      {showScrollBtn && (
        <button
          onClick={() => { scrollToBottom(true); setShowScrollBtn(false); }}
          className="fixed bottom-28 right-6 z-50 w-10 h-10 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-all"
        >
          <FiChevronDown className="text-lg" />
        </button>
      )}

      {/* Input — fixed to bottom */}
      <div className="bg-white border-t border-gray-100 flex-shrink-0 safe-area-bottom">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={send}
            sending={sending}
            placeholder="Type a message..."
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
          <p className="text-xs text-gray-400 pb-3 text-center">
            Our team typically replies within a few hours · 0794 448 439
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
