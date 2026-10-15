const DEFAULT_API_URL = "http://localhost:3000/api/analyze";

function normalizeApiUrl(rawUrl) {
  const value = String(rawUrl || "").trim();
  if (!value) return DEFAULT_API_URL;

  if (/\/analyze\/?$/i.test(value) && !/\/api\/analyze\/?$/i.test(value)) {
    return value.replace(/\/analyze\/?$/i, "/api/analyze");
  }

  if (/^https?:\/\/[^/]+\/?$/i.test(value)) {
    return value.replace(/\/?$/i, "/api/analyze");
  }

  return value;
}

const apiUrlInput = document.getElementById("apiUrl");
const statusEl = document.getElementById("status");
const saveButton = document.getElementById("saveButton");

function setStatus(message) {
  statusEl.textContent = message;
}

function loadSettings() {
  chrome.storage.sync.get(["decisionxApiUrl"], (result) => {
    const stored = typeof result?.decisionxApiUrl === "string" ? result.decisionxApiUrl.trim() : "";
    apiUrlInput.value = normalizeApiUrl(stored || DEFAULT_API_URL);
  });
}

function saveSettings() {
  const value = normalizeApiUrl(String(apiUrlInput.value || "").trim() || DEFAULT_API_URL);
  chrome.storage.sync.set({ decisionxApiUrl: value }, () => {
    setStatus("Saved.");
    setTimeout(() => setStatus(""), 2000);
  });
}

saveButton.addEventListener("click", saveSettings);
loadSettings();
