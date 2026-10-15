const DEFAULT_API_URL = "http://localhost:3000/api/analyze";

function normalizeApiUrl(rawUrl) {
  const value = String(rawUrl || "").trim();
  if (!value) return DEFAULT_API_URL;

  // Migrate legacy endpoint used by older extension versions.
  if (/\/analyze\/?$/i.test(value) && !/\/api\/analyze\/?$/i.test(value)) {
    return value.replace(/\/analyze\/?$/i, "/api/analyze");
  }

  if (/^https?:\/\/[^/]+\/?$/i.test(value)) {
    return value.replace(/\/?$/i, "/api/analyze");
  }

  return value;
}

function getApiUrlFromStorage() {
  return new Promise((resolve) => {
    try {
      chrome.storage.sync.get(["decisionxApiUrl"], (result) => {
        const stored = typeof result?.decisionxApiUrl === "string" ? result.decisionxApiUrl.trim() : "";
        resolve(normalizeApiUrl(stored || DEFAULT_API_URL));
      });
    } catch (error) {
      resolve(DEFAULT_API_URL);
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "DECISIONX_ANALYZE") {
    return false;
  }

  const text = typeof message.text === "string" ? message.text.trim() : "";
  if (text.length < 5) {
    sendResponse({ ok: false, error: "Response text too short to analyze." });
    return true;
  }

  const messageUrl = typeof message.apiUrl === "string" ? message.apiUrl.trim() : "";

  (messageUrl ? Promise.resolve(messageUrl) : getApiUrlFromStorage())
    .then((endpoint) =>
      fetch(normalizeApiUrl(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Evaluate this AI assistant response for factual risk, hallucinations, and bias.",
          output: text,
        }),
      })
    )
    .then(async (res) => {
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = payload?.error || `Request failed (${res.status})`;
        throw new Error(err);
      }
      sendResponse({ ok: true, data: payload });
    })
    .catch((error) => {
      sendResponse({ ok: false, error: error?.message || "Analyze request failed." });
    });

  return true;
});
