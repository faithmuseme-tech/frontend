import React from "react";
import { FiFileText, FiDownload } from "react-icons/fi";

const ChatAttachment = ({ fileUrl, fileType, fileName, isMe }) => {
  if (!fileUrl) return null;

  if (fileType === "image") {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block mt-1 rounded-xl overflow-hidden bg-white">
        <img
          src={fileUrl}
          alt={fileName || "image"}
          className="max-w-[220px] max-h-[200px] object-cover w-full"
        />
      </a>
    );
  }

  if (fileType === "video") {
    return (
      <div className="mt-1 rounded-xl overflow-hidden bg-white">
        <video src={fileUrl} controls className="max-w-[260px] w-full" />
      </div>
    );
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
