// signup.js

document.getElementById("signup-btn").addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const res = await fetch("/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Signup successful! You can now log in.");
      window.location.href = "login.html";
    } else {
      alert(data.error || "Signup failed.");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("Something went wrong. Try again.");
  }
});
