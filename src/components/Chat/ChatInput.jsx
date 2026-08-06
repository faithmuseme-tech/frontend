import React, { useRef, useState, useEffect, useCallback } from "react";
import { FiSend, FiPaperclip, FiX, FiFileText, FiFilm, FiCornerUpLeft, FiMic, FiTrash2, FiPlay, FiPause } from "react-icons/fi";
import { pauseAllVoice } from "./ChatAttachment";

const ACCEPT = "image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt";
const LOCK_SWIPE_UP = 60;
const BAR_COUNT = 30;

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/* ── Animated waveform bars (recording) ── */
const LiveWave = () => (
  <div className="flex items-center gap-[2px] h-6">
    {Array.from({ length: BAR_COUNT }).map((_, i) => (
      <span
        key={i}
        className="w-[2px] rounded-full bg-indigo-500 opacity-80"
        style={{
          height: `${20 + Math.sin(i * 0.7) * 10}%`,
          animation: `waveBar 0.8s ease-in-out ${(i * 40) % 800}ms infinite alternate`,
        }}
      />
    ))}
    <style>{`
      @keyframes waveBar {
        from { transform: scaleY(0.3); }
        to   { transform: scaleY(1); }
      }
    `}</style>
  </div>
);

/* ── Static waveform for playback (drawn from blob) ── */
const StaticWave = ({ audioBlob, currentTime, duration, onSeek }) => {
  const [bars, setBars] = useState([]);

  useEffect(() => {
    if (!audioBlob) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioBlob.arrayBuffer().then((buf) => {
      ctx.decodeAudioData(buf, (decoded) => {
        const data = decoded.getChannelData(0);
        const step = Math.floor(data.length / BAR_COUNT);
        const result = [];
        for (let i = 0; i < BAR_COUNT; i++) {
          let max = 0;
          for (let j = 0; j < step; j++) max = Math.max(max, Math.abs(data[i * step + j] || 0));
          result.push(max);
        }
        const peak = Math.max(...result, 0.01);
        setBars(result.map((v) => Math.max(0.08, v / peak)));
        ctx.close();
      });
    }).catch(() => setBars(Array(BAR_COUNT).fill(0.4)));
  }, [audioBlob]);

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div
      className="flex items-center gap-[2px] h-6 cursor-pointer flex-1"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onSeek((e.clientX - rect.left) / rect.width);
      }}
    >
      {(bars.length ? bars : Array(BAR_COUNT).fill(0.4)).map((h, i) => {
        const filled = i / BAR_COUNT < progress;
        return (
          <span
            key={i}
            className={`w-[2px] rounded-full transition-colors ${filled ? "bg-indigo-500" : "bg-gray-300"}`}
            style={{ height: `${Math.round(h * 100)}%` }}
          />
        );
      })}
    </div>
  );
};

/* ── Compact audio player (one line) ── */
const VoicePlayer = ({ audioBlob, duration, onDiscard, onSend, sending }) => {
  const [playing, setPlaying]   = useState(false);
  const [current, setCurrent]   = useState(0);
  const audioRef                = useRef(new Audio());
  const audioUrl                = useRef(URL.createObjectURL(audioBlob)).current;

  useEffect(() => {
    const a = audioRef.current;
    a.src = audioUrl;
    a.ontimeupdate = () => setCurrent(a.currentTime);
    a.onended = () => { setPlaying(false); setCurrent(0); };
    return () => { a.pause(); URL.revokeObjectURL(audioUrl); };
  }, [audioUrl]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  };

  const seek = (ratio) => {
    const a = audioRef.current;
    a.currentTime = ratio * (duration || a.duration || 0);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Discard */}
      <button type="button" onClick={onDiscard} className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors">
        <FiTrash2 size={15} />
      </button>

      {/* Play/Pause */}
      <button type="button" onClick={togglePlay} className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
        {playing ? <FiPause size={13} /> : <FiPlay size={13} className="ml-0.5" />}
      </button>

      {/* Waveform */}
      <StaticWave audioBlob={audioBlob} currentTime={current} duration={duration || audioRef.current.duration || 0} onSeek={seek} />

      {/* Time */}
      <span className="text-xs text-gray-400 tabular-nums flex-shrink-0">{fmt(Math.round(playing ? current : duration))}</span>

      {/* Send */}
      <button
        type="button"
        onClick={onSend}
        disabled={sending}
        className="flex-shrink-0 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-all"
      >
        <FiSend size={13} />
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
const ChatInput = ({ onSend, sending, placeholder = "Type a message...", replyTo, onCancelReply }) => {
  const [body, setBody]           = useState("");
  const [file, setFile]           = useState(null);
  const [error, setError]         = useState("");
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recSecs, setRecSecs]     = useState(0);
  const [swipeY, setSwipeY]       = useState(0);

  const fileRef     = useRef(null);
  const mediaRecRef = useRef(null);
  const chunksRef   = useRef([]);
  const timerRef    = useRef(null);
  const touchStartY = useRef(null);
  const lockedRef   = useRef(false);
  const saveBlobRef  = useRef(true);
  const sendAfterStop = useRef(false);

  const previewUrl = file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null;

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startRecording = useCallback(async () => {
    if (recording) return;
    pauseAllVoice(); // pause any playing voice message
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      saveBlobRef.current = true;
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        if (saveBlobRef.current) {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          if (sendAfterStop.current) {
            // send immediately without going through preview
            sendAfterStop.current = false;
            const fd = new FormData();
            fd.append("file", new File([blob], "voice-message.webm", { type: "audio/webm; codecs=opus" }));
            if (replyTo) fd.append("reply_to", replyTo.id);
            onSend(fd).then((ok) => {
              if (ok === false) setError("Failed to send. Please try again.");
              else { setRecSecs(0); setError(""); }
            });
          } else {
            setAudioBlob(blob);
          }
        }
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mediaRecRef.current = mr;
      setRecording(true);
      setRecSecs(0);
      timerRef.current = setInterval(() => setRecSecs((s) => s + 1), 1000);
    } catch { setError("Microphone access denied."); }
  }, [recording]);

  const stopAndSend = useCallback(() => {
    saveBlobRef.current = true;
    sendAfterStop.current = true;
    mediaRecRef.current?.stop();
    clearInterval(timerRef.current);
    setRecording(false);
    lockedRef.current = false;
    setSwipeY(0);
  }, []);

  const stopRecording = useCallback(() => {
    saveBlobRef.current = true;
    sendAfterStop.current = false;
    mediaRecRef.current?.stop();
    clearInterval(timerRef.current);
    setRecording(false);
    lockedRef.current = false;
    setSwipeY(0);
  }, []);

  const cancelRecording = useCallback(() => {
    saveBlobRef.current = false;
    mediaRecRef.current?.stop();
    clearInterval(timerRef.current);
    setRecording(false);
    lockedRef.current = false;
    setSwipeY(0);
  }, []);

  const discardAudio = () => { setAudioBlob(null); setRecSecs(0); };

  const onMicClick = () => { recording ? stopRecording() : startRecording(); };

  const onMicTouchStart = (e) => {
    e.preventDefault();
    touchStartY.current = e.touches[0].clientY;
    lockedRef.current = false;
    startRecording();
  };
  const onMicTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const dy = touchStartY.current - e.touches[0].clientY;
    setSwipeY(Math.max(0, Math.min(dy, LOCK_SWIPE_UP + 10)));
    if (dy >= LOCK_SWIPE_UP && !lockedRef.current) { lockedRef.current = true; }
  };
  const onMicTouchEnd = () => {
    setSwipeY(0);
    if (!lockedRef.current) stopRecording();
    touchStartY.current = null;
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("File must be under 20 MB."); return; }
    setError(""); setFile(f); e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (sending) return;
    const fd = new FormData();
    if (audioBlob) {
      fd.append("file", new File([audioBlob], "voice-message.webm", { type: "audio/webm; codecs=opus" }));
    } else {
      if (!body.trim() && !file) return;
      if (body.trim()) fd.append("body", body.trim());
      if (file) fd.append("file", file);
    }
    if (replyTo) fd.append("reply_to", replyTo.id);
    const ok = await onSend(fd);
    if (ok === false) setError("Failed to send. Please try again.");
    else { setBody(""); setFile(null); setAudioBlob(null); setRecSecs(0); setError(""); }
  };

  const replyLabel = replyTo
    ? (replyTo.file_type && !replyTo.body
        ? `${replyTo.file_type === "image" ? "Photo" : replyTo.file_type === "video" ? "Video" : replyTo.file_name || "File"}`
        : replyTo.body?.slice(0, 60))
    : "";

  const canSend  = body.trim() || file;
  const showMic  = !body.trim() && !file;
  const micShift = -Math.min(swipeY, LOCK_SWIPE_UP + 10);

  return (
    <div className="border-t border-gray-100 px-3 pt-2 pb-3 flex-shrink-0">
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

      {/* ── Single input row ── */}
      <div className="flex items-end gap-2">
        <input ref={fileRef} type="file" accept={ACCEPT} className="hidden" onChange={handleFile} />

        {/* Main bubble — always visible */}
        <div className="flex-1 flex flex-col border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-300 bg-white">

          {/* File preview */}
          {file && !recording && !audioBlob && (
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

          <div className="flex items-center px-2 py-1.5 gap-1 min-h-[40px]">

            {/* Recording state */}
            {recording && (
              <>
                <button type="button" onClick={cancelRecording} className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600">
                  <FiTrash2 size={14} />
                </button>
                <span className="text-xs font-bold text-red-500 tabular-nums flex-shrink-0">{fmt(recSecs)}</span>
                <div className="flex-1 px-1"><LiveWave /></div>
              </>
            )}

            {/* Audio preview state */}
            {audioBlob && !recording && (
              <VoicePlayer
                audioBlob={audioBlob}
                duration={recSecs}
                onDiscard={discardAudio}
                onSend={handleSubmit}
                sending={sending}
              />
            )}

            {/* Normal text input */}
            {!recording && !audioBlob && (
              <>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <FiPaperclip size={15} />
                </button>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                  placeholder={file ? "Add a caption..." : placeholder}
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm focus:outline-none py-1 max-h-28 overflow-y-auto"
                />
              </>
            )}
          </div>
        </div>

        {/* Right button: mic (when empty) or send (when has text/file) or stop (when recording) */}
        {recording ? (
          <button
            type="button"
            onClick={stopAndSend}
            className="flex-shrink-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-all"
          >
            <FiSend size={15} />
          </button>
        ) : canSend && !audioBlob ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={sending}
            className="flex-shrink-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all"
          >
            <FiSend size={15} />
          </button>
        ) : showMic && !audioBlob ? (
          <button
            type="button"
            onClick={onMicClick}
            onTouchStart={onMicTouchStart}
            onTouchMove={onMicTouchMove}
            onTouchEnd={onMicTouchEnd}
            style={{ transform: `translateY(${micShift}px)`, transition: swipeY === 0 ? "transform 0.2s ease" : "none" }}
            className="flex-shrink-0 w-10 h-10 bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 rounded-xl flex items-center justify-center touch-none transition-colors"
            title="Tap to record · Swipe up to lock"
          >
            <FiMic size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ChatInput;
