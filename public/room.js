const roomId = window.location.pathname.split("/").pop();
const roleIndicator = document.getElementById("role-indicator");
const syncStatus = document.getElementById("sync-status");
const copyButton = document.getElementById("copy-link");

const socket = io();
let player;
let role = "guest";
let suppressEvents = false;
let hostTimeInterval;

const setSyncStatus = (text) => {
  syncStatus.textContent = text;
};

const initPlayer = (room) => {
  const options = {
    controls: true,
    autoplay: false,
    preload: "auto",
    poster: room.artSrc || undefined,
    sources: [{ src: room.videoSrc, type: room.videoSrc.endsWith(".webm") ? "video/webm" : "video/mp4" }]
  };

  player = videojs("video-player", options);

  if (room.subtitleSrc) {
    player.addRemoteTextTrack(
      {
        kind: "subtitles",
        src: room.subtitleSrc,
        srclang: "en",
        label: room.subtitleLabel || "English",
        default: true
      },
      false
    );
  }

  player.on("play", () => {
    if (suppressEvents) return;
    socket.emit("sync-action", { roomId, action: "play", time: player.currentTime() });
  });

  player.on("pause", () => {
    if (suppressEvents) return;
    socket.emit("sync-action", { roomId, action: "pause", time: player.currentTime() });
  });

  player.on("seeked", () => {
    if (suppressEvents) return;
    socket.emit("sync-action", { roomId, action: "seek", time: player.currentTime() });
  });
};

const applyRemoteAction = ({ action, time }) => {
  if (!player) return;
  suppressEvents = true;
  if (typeof time === "number") {
    player.currentTime(time);
  }
  if (action === "play") {
    player.play();
  }
  if (action === "pause") {
    player.pause();
  }
  if (action === "seek") {
    player.currentTime(time);
  }
  suppressEvents = false;
};

const startHostTimeUpdates = () => {
  if (hostTimeInterval) {
    clearInterval(hostTimeInterval);
  }
  hostTimeInterval = setInterval(() => {
    if (player && !player.paused()) {
      socket.emit("host-timeupdate", { roomId, time: player.currentTime() });
    }
  }, 1000);
};

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copyButton.textContent = "Copied!";
    setTimeout(() => {
      copyButton.textContent = "Copy invite link";
    }, 1500);
  } catch (error) {
    copyButton.textContent = "Copy failed";
  }
});

fetch(`/api/rooms/${roomId}`)
  .then((response) => response.json())
  .then((room) => {
    if (room.error) {
      setSyncStatus(room.error);
      return;
    }
    initPlayer(room);
    socket.emit("join-room", roomId);
  })
  .catch(() => {
    setSyncStatus("Unable to load room.");
  });

socket.on("room-state", ({ role: assignedRole, state }) => {
  role = assignedRole;
  roleIndicator.textContent = role === "host" ? "You are the host." : "You are the guest.";
  setSyncStatus("Connected.");
  if (player) {
    suppressEvents = true;
    player.currentTime(state.currentTime || 0);
    if (state.paused) {
      player.pause();
    } else {
      player.play();
    }
    suppressEvents = false;
  }
  if (role === "host") {
    startHostTimeUpdates();
  }
});

socket.on("sync-action", (payload) => {
  applyRemoteAction(payload);
  setSyncStatus(`Synced: ${payload.action}`);
});

socket.on("host-timeupdate", ({ time }) => {
  if (role === "host" || !player) return;
  const drift = Math.abs(player.currentTime() - time);
  if (drift > 2) {
    suppressEvents = true;
    player.currentTime(time);
    suppressEvents = false;
    setSyncStatus("Re-synced with host.");
  }
});

socket.on("room-error", (message) => {
  setSyncStatus(message);
});
