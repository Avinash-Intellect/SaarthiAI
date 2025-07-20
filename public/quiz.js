

const subject = sessionStorage.getItem("selectedSubject");
const chapter = sessionStorage.getItem("selectedChapter");
document.getElementById("quiz-subject").textContent = subject || "?";
document.getElementById("quiz-chapter").textContent = chapter || "?";

async function loadQuiz() {
  const res = await fetch(`/api/quizzes?subject=${subject}&chapter=${chapter}`);
  const data = await res.json();

  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  data.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.className = "border rounded p-4 bg-gray-100";
    qDiv.innerHTML = `
      <h3 class="font-semibold mb-2">${index + 1}. ${q.question}</h3>
      ${q.options.map((opt, i) => `
        <label class="block">
          <input type="radio" name="q${index}" value="${i}" class="mr-2" /> ${opt}
        </label>
      `).join("")}
    `;
    container.appendChild(qDiv);
  });

  document.getElementById("submit-btn").onclick = () => checkAnswers(data);
}

function checkAnswers(quizData) {
  let score = 0;
  let total = quizData.length;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  const chapterStats = {}; // 📊 For tracking chapter-wise performance

  quizData.forEach((q, index) => {
    const selected = document.querySelector(`input[name='q${index}']:checked`);
    const chapter = q.chapter || "General"; // fallback if no chapter

    // Setup per chapter
    if (!chapterStats[chapter]) chapterStats[chapter] = { correct: 0, total: 0 };
    chapterStats[chapter].total += 1;

    if (selected && parseInt(selected.value) === q.answerIndex) {
      score++;
      chapterStats[chapter].correct += 1;
    } else {
      resultDiv.innerHTML += `
        <p class="text-sm text-red-600 mt-2">
          ❌ Q${index + 1}: Correct answer is "${q.options[q.answerIndex]}"<br/>
          <span class="text-gray-600">${q.explanation}</span>
        </p>
      `;
    }
  });

  // ✅ Show final score
  resultDiv.innerHTML = `<p class="mt-4 font-semibold">✅ Your score: ${score} / ${total}</p>` + resultDiv.innerHTML;

  // 🧠 Send result to backend
  const subject = sessionStorage.getItem("selectedSubject") || "Unknown";
  const payload = {
    subject,
    score,
    total,
    chapterStats
  };

  fetch("/api/quiz-results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    console.log("✅ Quiz result saved to DB:", data);
  })
  .catch(err => {
    console.error("❌ Failed to save quiz result:", err);
  });
   const userId = sessionStorage.getItem("userEmail") || "guest";

  fetch("/api/quiz-feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  })
  .then(res => res.json())
  .then(data => {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML += `<h3 class="mt-6 font-bold text-lg">🔍 Smart Feedback:</h3>`;

    if (data.weakTopics.length) {
      resultDiv.innerHTML += `<p class="text-red-600">Weak topics: ${data.weakTopics.join(", ")}</p>`;
    }
    if (data.strongTopics.length) {
      resultDiv.innerHTML += `<p class="text-green-600">Strong topics: ${data.strongTopics.join(", ")}</p>`;
    }
    if (data.suggestedTopics.length) {
      resultDiv.innerHTML += `<p class="text-blue-600">📚 Suggested to practice: ${data.suggestedTopics.join(", ")}</p>`;
    }
  })
  .catch(err => {
    console.error("Failed to load feedback:", err);
  });
}


loadQuiz();
