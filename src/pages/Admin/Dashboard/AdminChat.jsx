import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FiMessageCircle, FiUser, FiBriefcase, FiSearch, FiCornerUpLeft, FiClock, FiAlertCircle,
  FiUserCheck, FiX, FiChevronDown,
} from "react-icons/fi";
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

/* ── Transfer Modal ─────────────────────────────────────────────────────── */
const TransferModal = ({ room, onClose, onTransferred }) => {
  const [assignees, setAssignees]   = useState([]);
  const [selected, setSelected]     = useState(room.assigned_to_id ?? "");
  const [note, setNote]             = useState("");
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    api.get("/chat/admin/assignees/")
      .then((r) => setAssignees(r.data || []))
      .catch(() => setError("Failed to load staff list."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { assigned_to: selected === "" ? null : Number(selected), note };
      const r = await api.post(`/chat/admin/rooms/${room.id}/transfer/`, payload);
      onTransferred(r.data);
      onClose();
    } catch {
      setError("Transfer failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-gray-900 text-base">Transfer Chat</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX /></button>
        </div>

        <p className="text-xs text-gray-500">
          Assign <span className="font-semibold text-gray-700">{room.user_name}</span>'s chat to another team member.
        </p>

        {loading ? (
          <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <div className="relative">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 pr-8"
            >
              <option value="">— Unassigned (Admin pool) —</option>
              {assignees.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.label})
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional handoff note (visible in chat)..."
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-semibold">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || loading}
            className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl disabled:opacity-50 transition-colors"
          >
            {saving ? "Transferring…" : "Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ─────────────────────────────────────────────────────── */
const AdminChat = () => {
  const { user } = useAuth();
  const [rooms, setRooms]               = useState([]);
  const [activeRoom, setActiveRoom]     = useState(null);
  const [messages, setMessages]         = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMsgs, setLoadingMsgs]   = useState(false);
  const [sending, setSending]           = useState(false);
  const [search, setSearch]             = useState("");
  const [replyTo, setReplyTo]           = useState(null);
  const [transferRoom, setTransferRoom] = useState(null); // room object for modal
  const bottomRef                       = useRef(null);
  const scrollRef                       = useRef(null);
  const pollRef                         = useRef(null);
  const initialLoad                     = useRef(true);
  const justSent                        = useRef(false);

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  const scrollToBottom = (smooth = false) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  };

  const fetchRooms = useCallback(async (silent = false) => {
    try {
      const r = await api.get("/chat/admin/rooms/");
      setRooms(r.data || []);
    } catch {}
    finally { if (!silent) setLoadingRooms(false); }
  }, []);

  const fetchRoom = useCallback(async (roomId, silent = false) => {
    if (!silent) setLoadingMsgs(true);
    try {
      const r = await api.get(`/chat/admin/rooms/${roomId}/`);
      setMessages(r.data.messages || []);
      setRooms((prev) => prev.map((rm) =>
        rm.id === roomId ? { ...rm, unread_by_admin: 0 } : rm
      ));
    } catch {}
    finally { if (!silent) setLoadingMsgs(false); }
  }, []);

  useEffect(() => {
    fetchRooms();
    const roomPoll = setInterval(() => fetchRooms(true), 6000);
    return () => clearInterval(roomPoll);
  }, [fetchRooms]);

  useEffect(() => {
    clearInterval(pollRef.current);
    if (!activeRoom) return;
    setReplyTo(null);
    initialLoad.current = true;
    fetchRoom(activeRoom);
    pollRef.current = setInterval(() => fetchRoom(activeRoom, true), 4000);
    return () => clearInterval(pollRef.current);
  }, [activeRoom, fetchRoom]);

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
    if (sending || !activeRoom) return false;
    setSending(true);
    const tempId = `temp_${Date.now()}`;
    const body = formData.get("body") || "";
    const file = formData.get("file");
    const replyToId = formData.get("reply_to");
    const tempMsg = {
      id: tempId,
      sender: user?.id,
      sender_name: user?.username || user?.email,
      is_admin_msg: true,
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
      const r = await api.post(`/chat/admin/rooms/${activeRoom}/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
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

  const handleTransferred = (updatedRoom) => {
    setRooms((prev) => prev.map((r) => r.id === updatedRoom.id ? { ...r, ...updatedRoom } : r));
    // Refresh messages to show the handoff note
    fetchRoom(updatedRoom.id, true);
  };

  const filteredRooms = rooms.filter((r) =>
    r.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.user_email?.toLowerCase().includes(search.toLowerCase())
  );

  const activeRoomData = rooms.find((r) => r.id === activeRoom);

  const grouped = messages.reduce((acc, msg) => {
    const day = fmtDate(msg.created_at);
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl border border-gray-100 overflow-hidden">

      {/* Sidebar */}
      <div className={`flex flex-col border-r border-gray-100 ${activeRoom ? "hidden sm:flex" : "flex"} w-full sm:w-72 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900 text-base mb-3">Support Chats</h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingRooms ? (
            <div className="space-y-2 p-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FiMessageCircle className="text-3xl mx-auto mb-2 opacity-30" />
              <p className="text-xs">No conversations yet.</p>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50 ${
                  activeRoom === room.id ? "bg-indigo-50" : "hover:bg-gray-50"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  room.role === "trader" ? "bg-amber-100" : "bg-indigo-100"
                }`}>
                  {room.role === "trader"
                    ? <FiBriefcase className="text-amber-600 text-sm" />
                    : <FiUser className="text-indigo-600 text-sm" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{room.user_name}</p>
                    {room.unread_by_admin > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {room.unread_by_admin}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{room.last_message?.body || "No messages yet"}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-xs font-semibold capitalize ${room.role === "trader" ? "text-amber-600" : "text-indigo-500"}`}>
                      {room.role}
                    </span>
                    {room.assigned_to_name && (
                      <span className="text-xs text-gray-400 truncate">· {room.assigned_to_name}</span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col min-w-0 ${!activeRoom ? "hidden sm:flex" : "flex"}`}>
        {!activeRoom ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
            <FiMessageCircle className="text-5xl opacity-20" />
            <p className="font-medium text-sm">Select a conversation to start replying</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <button
                onClick={() => setActiveRoom(null)}
                className="sm:hidden text-gray-500 hover:text-gray-700 font-bold text-sm mr-1"
              >
                ← Back
              </button>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                activeRoomData?.role === "trader" ? "bg-amber-100" : "bg-indigo-100"
              }`}>
                {activeRoomData?.role === "trader"
                  ? <FiBriefcase className="text-amber-600 text-sm" />
                  : <FiUser className="text-indigo-600 text-sm" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{activeRoomData?.user_name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {activeRoomData?.user_email} · <span className="capitalize">{activeRoomData?.role}</span>
                  {activeRoomData?.assigned_to_name && (
                    <span className="ml-1 text-indigo-500 font-semibold">· {activeRoomData.assigned_to_name}</span>
                  )}
                </p>
              </div>
              {/* Transfer button — full admin only */}
              {user?.is_admin && (
                <button
                  onClick={() => setTransferRoom(activeRoomData)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-3 py-1.5 rounded-xl transition-colors flex-shrink-0"
                  title="Transfer chat to another team member"
                >
                  <FiUserCheck size={13} /> Transfer
                </button>
              )}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {loadingMsgs ? (
                <div className="space-y-3">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                      <div className="h-10 w-48 bg-gray-100 rounded-2xl animate-pulse" />
                    </div>
                  ))}
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
                      const isAdminMsg = msg.is_admin_msg;
                      const isTransferNote = msg.body?.startsWith("🔁 Transferred:");
                      if (isTransferNote) {
                        return (
                          <div key={msg.id} className="flex justify-center">
                            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{msg.body}</span>
                          </div>
                        );
                      }
                      return (
                        <div key={msg.id} className={`flex group ${isAdminMsg ? "justify-end" : "justify-start"}`}>
                          {!isAdminMsg && (
                            <button
                              onClick={() => setReplyTo({ ...msg, sender_name: msg.sender_name })}
                              className="opacity-0 group-hover:opacity-100 self-center mr-2 text-gray-400 hover:text-indigo-500 transition-all"
                              title="Reply"
                            >
                              <FiCornerUpLeft className="text-base" />
                            </button>
                          )}

                          <div className="max-w-[75%] space-y-1">
                            {!isAdminMsg && (
                              <p className="text-xs text-gray-400 font-semibold px-1">{msg.sender_name}</p>
                            )}
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isAdminMsg
                                ? "bg-indigo-600 text-white rounded-br-sm"
                                : "bg-gray-100 text-gray-800 rounded-bl-sm"
                            }`}>
                              <ReplyPreview reply={msg.reply_to} isMe={isAdminMsg} />
                              {msg.body && <p>{msg.body}</p>}
                              <ChatAttachment
                                fileUrl={msg.file_url}
                                fileType={msg.file_type}
                                fileName={msg.file_name}
                                isMe={isAdminMsg}
                              />
                            </div>
                            <div className={`flex items-center gap-1 px-1 ${isAdminMsg ? "justify-end" : "justify-start"}`}>
                              <span className="text-xs text-gray-400">{fmtTime(msg.created_at)}</span>
                              {isAdminMsg && (
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

                          {isAdminMsg && (
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
              placeholder="Reply..."
              replyTo={replyTo}
              onCancelReply={() => setReplyTo(null)}
            />
          </>
        )}
      </div>

      {/* Transfer modal */}
      {transferRoom && (
        <TransferModal
          room={transferRoom}
          onClose={() => setTransferRoom(null)}
          onTransferred={handleTransferred}
        />
      )}
    </div>
  );
};

export default AdminChat;
