const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const uploadsDir = path.join(__dirname, "uploads");
const rooms = new Map();

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${unique}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024
  }
});

app.use(express.json());
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(path.join(__dirname, "public")));

const allowedVideoExtensions = new Set([".mp4", ".webm"]);
const allowedSubtitleExtensions = new Set([".vtt", ".srt"]);

const convertSrtToVtt = async (srtPath) => {
  const vttPath = srtPath.replace(/\.srt$/i, ".vtt");
  const content = await fs.promises.readFile(srtPath, "utf8");
  const converted = `WEBVTT\n\n${content.replace(/(\d+):(\d+):(\d+),(\d+)/g, "$1:$2:$3.$4")}`;
  await fs.promises.writeFile(vttPath, converted, "utf8");
  return vttPath;
};

const getVideoSource = (room) => {
  if (room.videoUrl) {
    return room.videoUrl;
  }
  return `/uploads/${room.videoFile}`;
};

const getSubtitleSource = (room) => {
  if (!room.subtitleFile) {
    return null;
  }
  return `/uploads/${room.subtitleFile}`;
};

const getArtSource = (room) => {
  if (!room.artFile) {
    return null;
  }
  return `/uploads/${room.artFile}`;
};

app.post(
  "/api/rooms",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "artFile", maxCount: 1 },
    { name: "subtitleFile", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { videoUrl, subtitleLabel } = req.body;
      const videoFile = req.files?.videoFile?.[0];
      const artFile = req.files?.artFile?.[0];
      const subtitleFile = req.files?.subtitleFile?.[0];

      if (!videoUrl && !videoFile) {
        return res.status(400).json({ error: "Provide a video file or URL." });
      }

      if (videoFile) {
        const ext = path.extname(videoFile.originalname).toLowerCase();
        if (!allowedVideoExtensions.has(ext)) {
          return res.status(400).json({ error: "Video must be MP4 or WebM." });
        }
      }

      if (subtitleFile) {
        const ext = path.extname(subtitleFile.originalname).toLowerCase();
        if (!allowedSubtitleExtensions.has(ext)) {
          return res.status(400).json({ error: "Subtitles must be VTT or SRT." });
        }
      }

      let subtitleFileName = subtitleFile?.filename || null;
      if (subtitleFile && subtitleFile.originalname.toLowerCase().endsWith(".srt")) {
        const srtPath = path.join(uploadsDir, subtitleFile.filename);
        const vttPath = await convertSrtToVtt(srtPath);
        subtitleFileName = path.basename(vttPath);
      }

      const roomId = uuidv4();
      rooms.set(roomId, {
        id: roomId,
        videoFile: videoFile?.filename || null,
        videoUrl: videoUrl || null,
        artFile: artFile?.filename || null,
        subtitleFile: subtitleFileName,
        subtitleLabel: subtitleLabel || "English",
        createdAt: Date.now(),
        state: {
          currentTime: 0,
          paused: true,
          updatedAt: Date.now()
        },
        hostId: null
      });

      return res.json({
        roomId,
        roomUrl: `${req.protocol}://${req.get("host")}/room/${roomId}`
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create room." });
    }
  }
);

app.get("/api/rooms/:roomId", (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: "Room not found." });
  }

  return res.json({
    roomId: room.id,
    videoSrc: getVideoSource(room),
    artSrc: getArtSource(room),
    subtitleSrc: getSubtitleSource(room),
    subtitleLabel: room.subtitleLabel || "English"
  });
});

app.get("/room/:roomId", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "room.html"));
});

const getEffectiveTime = (room) => {
  const { currentTime, paused, updatedAt } = room.state;
  if (paused) {
    return currentTime;
  }
  const elapsedSeconds = (Date.now() - updatedAt) / 1000;
  return currentTime + elapsedSeconds;
};

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit("room-error", "Room not found.");
      return;
    }

    socket.join(roomId);
    if (!room.hostId) {
      room.hostId = socket.id;
    }

    const effectiveTime = getEffectiveTime(room);
    socket.emit("room-state", {
      roomId,
      role: room.hostId === socket.id ? "host" : "guest",
      state: {
        currentTime: effectiveTime,
        paused: room.state.paused
      }
    });
  });

  socket.on("sync-action", ({ roomId, action, time }) => {
    const room = rooms.get(roomId);
    if (!room) {
      return;
    }

    if (typeof time === "number") {
      room.state.currentTime = time;
      room.state.updatedAt = Date.now();
    }

    if (action === "play") {
      room.state.paused = false;
      room.state.updatedAt = Date.now();
    }

    if (action === "pause") {
      room.state.paused = true;
      room.state.updatedAt = Date.now();
    }

    io.to(roomId).emit("sync-action", { action, time: room.state.currentTime });
  });

  socket.on("host-timeupdate", ({ roomId, time }) => {
    const room = rooms.get(roomId);
    if (!room || room.hostId !== socket.id) {
      return;
    }
    if (typeof time !== "number") {
      return;
    }
    room.state.currentTime = time;
    room.state.updatedAt = Date.now();
    io.to(roomId).emit("host-timeupdate", { time });
  });

  socket.on("disconnect", () => {
    for (const room of rooms.values()) {
      if (room.hostId === socket.id) {
        room.hostId = null;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
