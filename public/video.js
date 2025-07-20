// video.js

function getYouTubeEmbedUrl(youtubeUrl) {
  try {
    const url = new URL(youtubeUrl);

    // Handle https://youtu.be/<id>
    if (url.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    }

    // Handle https://www.youtube.com/watch?v=<id>
    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return ""; // fallback
  } catch (err) {
    console.error("Invalid YouTube URL:", youtubeUrl);
    return "";
  }
}



const video = JSON.parse(sessionStorage.getItem("selectedVideo"));

if (video) {
    document.getElementById("video-title").textContent = video.title;
    document.getElementById("video-frame").src = getYouTubeEmbedUrl(video.url);

} else {
    document.getElementById("video-title").textContent = "No video selected.";
}

function goBack() {
    window.history.back();
}

  // Assume URL has ?videoId=VIDEO_ID&subject=SUBJECT_NAME
  
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get("videoId");
  const subject = params.get("subject");
  const checkbox = document.getElementById("readCheckbox");

  const key = `saarthi-progress-${subject}`;
  const readVideos = JSON.parse(localStorage.getItem(key)) || [];

  // Pre-check if already marked
  if (readVideos.includes(videoId)) {
    checkbox.checked = true;
  }

  function markAsRead() {
    if (!videoId || !subject) return;

    const updated = JSON.parse(localStorage.getItem(key)) || [];

    if (checkbox.checked && !updated.includes(videoId)) {
      updated.push(videoId);
      localStorage.setItem(key, JSON.stringify(updated));
    }

    // Optional: If you want to unmark when unchecked:
    
    if (!checkbox.checked && updated.includes(videoId)) {
      const filtered = updated.filter(id => id !== videoId);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
    
  }



