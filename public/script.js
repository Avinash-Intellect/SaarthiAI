// script.js
function toggleCareerMentor() {
    document.getElementById("career-mentor-popup").classList.toggle("hidden");
  }

  // window.toggleCareerMentor = toggleCareerMentor;

  document.getElementById("mentor-submit").addEventListener("click", () => {
    const question = document.getElementById("mentor-input").value.trim();
    const responseDiv = document.getElementById("mentor-response");
    if (!question) {
      responseDiv.innerText = "⚠️ Please type your goal first.";
      return;
    }

    responseDiv.innerText = "🤖 Thinking...";

    fetch("/api/career-mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    })
      .then(res => res.json())
      .then(data => {
        responseDiv.innerText = data.reply || "⚠️ No response received.";
      })
      .catch(err => {
        responseDiv.innerText = "⚠️ Something went wrong.";
        console.error(err);
      });
  });

const subjects = [
  {
    name: "Coding",
    description: "Learn programming and web development.",
    image: "assets/images/coding.png"
  },
  {
    name: "Digital Literacy",
    description: "Master smartphones, email, and safe internet use.",
    image: "assets/images/digital_literacy.png"
  },
  {
    name: "Vocational Skills",
    description: "Explore trades like tailoring, plumbing, and more.",
    image: "assets/images/vocational_skills.png"
  }
];

const subjectContainer = document.getElementById("subject-container");
const chapterContainer = document.getElementById("chapter-container");

// Step 1: Render subject cards
subjects.forEach(subject => {
  const card = document.createElement("div");
  card.className = "bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer";
  card.innerHTML = `
    <img src="${subject.image}" alt="${subject.name}" class="w-full h-48 object-cover">
    <div class="p-4">
      <h3 class="text-lg font-bold text-gray-800">${subject.name}</h3>
      <p class="text-sm text-gray-600">${subject.description}</p>
    </div>
  `;
  card.onclick = () => {
    sessionStorage.setItem("selectedSubject", subject.name);
    window.location.href = "subject.html";
  };

  subjectContainer.appendChild(card);
});

// Step 2: Show chapter buttons for selected subject
async function loadChapters(subjectName) {
  chapterContainer.innerHTML = "<p class='text-center text-gray-600 mb-4'>Loading chapters...</p>";
  const res = await fetch("/api/resources");
  const data = await res.json();
  const subjectResources = data.filter(r => r.subject === subjectName);

  // Group by chapter
  const chapters = {};
  subjectResources.forEach(r => {
    if (!chapters[r.chapter]) chapters[r.chapter] = [];
    chapters[r.chapter].push(r);
  });

  // Render chapter buttons
  chapterContainer.innerHTML = `
    <h2 class="text-2xl font-bold mb-4 text-center text-blue-800">${subjectName}</h2>
    <div class="flex flex-wrap gap-3 justify-center mb-6">
      ${Object.keys(chapters).map(chapter =>
    `<button class="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition" onclick="showChapter('${chapter.replace(/'/g, "\\'")}')">${chapter}</button>`
  ).join("")}
    </div>
    <div id="videos-list" class="grid sm:grid-cols-2 md:grid-cols-3 gap-6"></div>
  `;

  // Attach to global scope for chapter switch
  window.chapterData = chapters;
}

// Step 3: Display video cards for selected chapter
function showChapter(chapterName) {
  const videoGrid = document.getElementById("videos-list");
  const videos = window.chapterData[chapterName] || [];

  videoGrid.innerHTML = videos.map(video => `
    <div class="bg-white rounded-lg border shadow hover:shadow-md transition p-4 cursor-pointer" onclick="openVideo(${JSON.stringify(video).replace(/"/g, '&quot;')})">
      <h4 class="font-semibold mb-1 text-blue-700">${video.title}</h4>
      <p class="text-sm text-gray-500">${video.language} • ${video.level}</p>
    </div>
  `).join("");
}

// Step 4: Open video.html and store video in session
function openVideo(video) {
  sessionStorage.setItem("selectedVideo", JSON.stringify(video));
  window.location.href = "video.html";
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

  // Add "Bot is thinking..." message
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
        model: "mistral", // change this if you're using phi3, gemma, etc.
        prompt,
        stream: false
      })
    });

    const data = await res.json();

    // Remove "Bot is thinking..."
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
