const form = document.getElementById("upload-form");
const status = document.getElementById("status");
const roomLink = document.getElementById("room-link");
const roomAnchor = document.getElementById("room-anchor");

const setStatus = (message, isError = false) => {
  status.textContent = message;
  status.classList.remove("hidden");
  status.style.color = isError ? "#fca5a5" : "#a4a9b8";
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.classList.add("hidden");
  roomLink.classList.add("hidden");

  const formData = new FormData(form);
  setStatus("Uploading...", false);

  try {
    const response = await fetch("/api/rooms", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed.");
    }

    setStatus("Room ready!", false);
    roomAnchor.textContent = data.roomUrl;
    roomAnchor.href = data.roomUrl;
    roomLink.classList.remove("hidden");
  } catch (error) {
    setStatus(error.message, true);
  }
});
