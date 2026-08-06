import React, { useRef, useState, useEffect, useMemo } from "react";
import { FiFileText, FiDownload, FiPlay, FiPause } from "react-icons/fi";

const BAR_COUNT = 28;
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, "0")}`;

/* Global tracker — only one audio plays at a time */
let currentlyPlaying = null;

export const pauseAllVoice = () => {
  if (currentlyPlaying) {
    currentlyPlaying.pause();
    currentlyPlaying = null;
  }
};
const seedBars = (url) => {
  let hash = 0;
  for (let i = 0; i < url.length; i++) hash = (hash * 31 + url.charCodeAt(i)) >>> 0;
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const base = 0.15 + ((hash >>> 16) / 65535) * 0.85;
    // make edges shorter for a natural look
    const edge = Math.sin((i / (BAR_COUNT - 1)) * Math.PI);
    return Math.max(0.1, base * (0.5 + edge * 0.5));
  });
};

/* WhatsApp-style voice message player */
const VoiceMessage = ({ fileUrl, isMe }) => {
  const audioRef                = useRef(null);
  const [playing, setPlaying]   = useState(false);
  const [current, setCurrent]   = useState(0);
  const [duration, setDuration] = useState(0);
  const [bars, setBars]         = useState(() => seedBars(fileUrl));

  /* Decode real waveform once */
  useEffect(() => {
    let cancelled = false;
    const decode = async () => {
      try {
        const res  = await fetch(fileUrl);
        const buf  = await res.arrayBuffer();
        const ctx  = new (window.AudioContext || window.webkitAudioContext)();
        const decoded = await ctx.decodeAudioData(buf);
        ctx.close();
        if (cancelled) return;
        const data = decoded.getChannelData(0);
        const step = Math.floor(data.length / BAR_COUNT);
        const raw  = Array.from({ length: BAR_COUNT }, (_, i) => {
          let max = 0;
          for (let j = 0; j < step; j++) max = Math.max(max, Math.abs(data[i * step + j] || 0));
          return max;
        });
        const peak = Math.max(...raw, 0.01);
        setBars(raw.map((v) => Math.max(0.08, v / peak)));
      } catch { /* keep seed bars on error */ }
    };
    decode();
    return () => { cancelled = true; };
  }, [fileUrl]);

  /* Audio event listeners */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime      = () => setCurrent(a.currentTime);
    const onMeta      = () => setDuration(a.duration || 0);
    const onEnded     = () => { setPlaying(false); setCurrent(0); if (currentlyPlaying === a) currentlyPlaying = null; };
    const onForcePause = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnded);
    a.addEventListener("forcepause", onForcePause);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("forcepause", onForcePause);
      a.pause();
      if (currentlyPlaying === a) currentlyPlaying = null;
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
      if (currentlyPlaying === a) currentlyPlaying = null;
    } else {
      // pause any other voice message playing
      if (currentlyPlaying && currentlyPlaying !== a) {
        currentlyPlaying.pause();
        currentlyPlaying.dispatchEvent(new Event("forcepause"));
      }
      currentlyPlaying = a;
      a.play().catch(() => {});
      setPlaying(true);
    }
  };

  const seek = (e) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const progress = duration > 0 ? current / duration : 0;
  const display  = playing ? current : (current > 0 ? current : duration);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl w-[220px] ${
      isMe ? "bg-[#e2ffc7]" : "bg-white border border-gray-100 shadow-sm"
    }`}>
      <audio ref={audioRef} src={fileUrl} preload="metadata" />

      {/* Play / Pause */}
      <button
        onClick={toggle}
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors text-white ${
          isMe ? "bg-green-500 hover:bg-green-600" : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {playing ? <FiPause size={13} /> : <FiPlay size={13} className="ml-0.5" />}
      </button>

      {/* Waveform — clickable to seek */}
      <div
        className="flex items-center gap-[2px] flex-1 h-8 cursor-pointer"
        onClick={seek}
      >
        {bars.map((h, i) => {
          const filled = i / BAR_COUNT < progress;
          return (
            <span
              key={i}
              className={`rounded-full flex-shrink-0 transition-colors duration-75 ${
                filled
                  ? isMe ? "bg-green-600"  : "bg-indigo-500"
                  : isMe ? "bg-green-300"  : "bg-gray-300"
              }`}
              style={{ width: 2, height: `${Math.round(h * 100)}%` }}
            />
          );
        })}
      </div>

      {/* Timer */}
      <span className="text-[11px] tabular-nums text-gray-500 flex-shrink-0 w-8 text-right">
        {fmt(display || 0)}
      </span>
    </div>
  );
};

/* ── Main ChatAttachment ── */
const ChatAttachment = ({ fileUrl, fileType, fileName, isMe }) => {
  if (!fileUrl) return null;

  if (fileType === "image") {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block mt-1 rounded-xl overflow-hidden">
        <img src={fileUrl} alt={fileName || "image"} className="max-w-[220px] max-h-[200px] object-cover w-full" />
      </a>
    );
  }

  if (fileType === "video") {
    return (
      <div className="mt-1 rounded-xl overflow-hidden">
        <video src={fileUrl} controls className="max-w-[260px] w-full" />
      </div>
    );
  }

  if (fileType === "audio") {
    return <div className="mt-1"><VoiceMessage fileUrl={fileUrl} isMe={isMe} /></div>;
  }

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors bg-white hover:bg-gray-50 text-gray-800"
    >
      <FiFileText className="text-base flex-shrink-0 text-indigo-500" />
      <span className="truncate max-w-[160px]">{fileName || "Download file"}</span>
      <FiDownload className="flex-shrink-0 ml-auto text-gray-400" />
    </a>
  );
};

export default ChatAttachment;
