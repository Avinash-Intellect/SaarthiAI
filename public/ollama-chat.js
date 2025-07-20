const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.onclick = async () => {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  chatWindow.innerHTML += `<div class="mb-2"><strong>You:</strong> ${prompt}</div>`;
  userInput.value = "";

  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral", // change to "phi3", "gemma", etc. if needed
        prompt,
        stream: false
      })
    });

    const data = await res.json();
    const reply = data.response.trim();
    chatWindow.innerHTML += `<div class="mb-2 text-blue-700"><strong>Bot:</strong> ${reply}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (err) {
    chatWindow.innerHTML += `<div class="text-red-500">⚠️ Error contacting local Ollama server</div>`;
    console.error(err);
  }
};
