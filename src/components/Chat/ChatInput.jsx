import React, { useRef, useState } from "react";
import { FiSend, FiPaperclip, FiX, FiFileText, FiFilm, FiCornerUpLeft } from "react-icons/fi";

const ACCEPT = "image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt";

const ChatInput = ({ onSend, sending, placeholder = "Type a message...", replyTo, onCancelReply }) => {
  const [body, setBody]   = useState("");
  const [file, setFile]   = useState(null);
  const [error, setError] = useState("");
  const fileRef           = useRef(null);
  const previewUrl        = file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null;

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("File must be under 20 MB."); return; }
    setError("");
    setFile(f);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if ((!body.trim() && !file) || sending) return;
    const fd = new FormData();
    if (body.trim()) fd.append("body", body.trim());
    if (file) fd.append("file", file);
    if (replyTo) fd.append("reply_to", replyTo.id);
    const ok = await onSend(fd);
    if (ok === false) { setError("Failed to send. Please try again."); }
    else { setBody(""); setFile(null); setError(""); }
  };

  const replyLabel = replyTo
    ? (replyTo.file_type && !replyTo.body
        ? `${replyTo.file_type === "image" ? "Photo" : replyTo.file_type === "video" ? "Video" : replyTo.file_name || "File"}`
        : replyTo.body?.slice(0, 60))
    : "";

  return (
    <div className="border-t border-gray-100 px-4 pt-2 pb-3 flex-shrink-0">
      {/* Reply banner */}
      {replyTo && (
        <div className="flex items-center gap-2 mb-2 bg-indigo-50 border-l-4 border-indigo-400 rounded-lg px-3 py-1.5">
          <FiCornerUpLeft className="text-indigo-400 flex-shrink-0 text-sm" />
          <p className="text-xs text-indigo-700 truncate flex-1">
            <span className="font-semibold">{replyTo.sender_name}</span>: {replyLabel}
          </p>
          <button type="button" onClick={onCancelReply} className="text-gray-400 hover:text-red-500">
            <FiX className="text-sm" />
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mb-1">{error}</p>}

      {/* Input box */}
      <div className="flex items-end gap-2">
        <input ref={fileRef} type="file" accept={ACCEPT} className="hidden" onChange={handleFile} />

        {/* Main input wrapper */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-300 bg-white">

          {/* File preview inside input */}
          {file && (
            <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
              {previewUrl ? (
                <img src={previewUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : file.type.startsWith("video/") ? (
                <FiFilm className="text-indigo-500 text-xl flex-shrink-0" />
              ) : (
                <FiFileText className="text-indigo-500 text-xl flex-shrink-0" />
              )}
              <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
              <button type="button" onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                <FiX className="text-sm" />
              </button>
            </div>
          )}

          {/* Text row with attach icon inside */}
          <div className="flex items-end px-2 py-1.5 gap-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-gray-100"
              title="Attach file"
            >
              <FiPaperclip className="text-base" />
            </button>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
              placeholder={file ? "Add a caption..." : placeholder}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm focus:outline-none py-1 max-h-28 overflow-y-auto"
            />
          </div>
        </form>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={(!body.trim() && !file) || sending}
          className="flex-shrink-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all"
        >
          <FiSend className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
