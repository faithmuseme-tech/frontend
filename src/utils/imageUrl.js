const API_BASE = process.env.REACT_APP_API_URL?.replace("/api/v1", "") || "http://127.0.0.1:8000";

export const toAbsolute = (url) => {
  if (!url) return "";
  if (url.startsWith("http://")) return url.replace("http://", "https://");
  if (url.startsWith("https://")) return url;
  return `${API_BASE}${url}`;
};
