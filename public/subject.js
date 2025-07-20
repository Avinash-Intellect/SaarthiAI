

const subject = sessionStorage.getItem("selectedSubject");
document.getElementById("subject-title").textContent = subject || "Loading...";

fetch("/api/resources")
  .then(res => res.json())
  .then(data => {
    const filtered = data.filter(r => r.subject === subject);

    const chapters = {};
    filtered.forEach(r => {
      if (!chapters[r.chapter]) chapters[r.chapter] = [];
      chapters[r.chapter].push(r);
    });

    const chapterButtons = document.getElementById("chapter-buttons");
    Object.keys(chapters).forEach(chap => {
      const btn = document.createElement("button");
      btn.textContent = chap;
      btn.className = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition";
      btn.onclick = () => showVideos(chapters[chap]);
      chapterButtons.appendChild(btn);
    });

    // ✅ Load personalized recommendations initially
    loadRecommendations(subject);
  });

function showVideos(videos) {
  const container = document.getElementById("video-cards");
  container.innerHTML = "";
  videos.forEach(video => {
    const card = document.createElement("div");
    card.className = "bg-white border rounded shadow p-4 cursor-pointer hover:shadow-md transition";
   card.onclick = () => {
  sessionStorage.setItem("selectedVideo", JSON.stringify(video)); // ✅ This is important
  sessionStorage.setItem("returningFromVideo", "yes"); // Optional for refreshing recommendations
  const videoId = video._id;
  const subject = video.subject;
  window.location.href = `video.html?videoId=${videoId}&subject=${subject}`;
};


    card.innerHTML = `
      <h3 class="text-lg font-semibold mb-2">${video.title}</h3>
      <p class="text-sm text-gray-500">${video.language} • ${video.level}</p>
    `;
    container.appendChild(card);
  });
}

// Toggle chatbot popup
function toggleChatbot() {
  document.getElementById("chatbot-popup").classList.toggle("hidden");
}

document.getElementById("chatbot-button").addEventListener("click", toggleChatbot);

// Send message to Ollama
async function sendToOllama() {
  const input = document.getElementById("user-input");
  const chatWindow = document.getElementById("chat-window");
  const prompt = input.value.trim();
  if (!prompt) return;

  chatWindow.innerHTML += `<div class="mb-2"><strong>You:</strong> ${prompt}</div>`;

  const thinkingMsg = document.createElement("div");
  thinkingMsg.className = "mb-2 text-gray-500";
  thinkingMsg.id = "thinking-msg";
  thinkingMsg.innerText = "🤖 Bot is thinking...";
  chatWindow.appendChild(thinkingMsg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  input.value = "";

  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt,
        stream: false
      })
    });

    const data = await res.json();
    thinkingMsg.remove();
    const reply = data.response.trim();
    chatWindow.innerHTML += `<div class="mb-2 text-blue-700"><strong>Bot:</strong> ${reply}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (err) {
    thinkingMsg.remove();
    chatWindow.innerHTML += `<div class="text-red-600">⚠️ Failed to contact local AI.</div>`;
    console.error(err);
  }
}

// Load personalized video recommendations
async function loadRecommendations(subjectName) {
  const key = `saarthi-progress-${subjectName}`;
  const completedIds = JSON.parse(localStorage.getItem(key)) || [];

  if (completedIds.length === 0) return;

  const res = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject: subjectName, completedIds })
  });

  const data = await res.json();
  const container = document.getElementById("recommendation-section");
  if (!container) return;

  if (data.length === 0) {
    container.innerHTML = `<p class="text-sm text-gray-500">No new recommendations yet. ✅</p>`;
    return;
  }

  container.innerHTML = "<h3 class='text-lg font-bold mb-2'>🎯 Recommended Next</h3>";

  data.forEach(video => {
    const div = document.createElement("div");
    div.className = "bg-white p-3 rounded border mb-2";
    div.innerHTML = `
      <h4 class="font-semibold">${video.chapter} — ${video.title}</h4>
      <p class="text-xs text-gray-500">${video.language} | ${video.level}</p>
      <a class="text-blue-600 text-sm underline" href="video.html?videoId=${video._id}&subject=${video.subject}">Watch Video</a>
    `;
    container.appendChild(div);
  });
}

// 🔁 Reload recommendations if returning from video
if (sessionStorage.getItem("returningFromVideo") === "yes") {
  sessionStorage.removeItem("returningFromVideo");
  loadRecommendations(subject);
}
 loadRecommendations(subject);
