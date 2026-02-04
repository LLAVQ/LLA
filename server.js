const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const http = require('http');
const multer = require('multer');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const unique = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }
});

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));
app.use('/public', express.static(path.join(__dirname, 'public')));

const rooms = new Map();

const convertSrtToVtt = (srtContent) => {
  const normalized = srtContent
    .replace(/\r+/g, '')
    .replace(/\n\s*\n/g, '\n\n');
  const vttBody = normalized.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
  return `WEBVTT\n\n${vttBody}`;
};

const createRoomData = ({ videoSrc, artSrc, subtitleSrc, subtitleLabel }) => ({
  videoSrc,
  artSrc,
  subtitleSrc,
  subtitleLabel,
  hostSocketId: null,
  lastState: { time: 0, paused: true }
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post(
  '/upload',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'art', maxCount: 1 },
    { name: 'subtitle', maxCount: 1 }
  ]),
  (req, res) => {
    const videoUrl = req.body.videoUrl?.trim();
    const artUrl = req.body.artUrl?.trim();
    const videoFile = req.files?.video?.[0];
    const artFile = req.files?.art?.[0];
    const subtitleFile = req.files?.subtitle?.[0];

    if (!videoFile && !videoUrl) {
      return res.status(400).send('Please upload a video or provide an external URL.');
    }

    if (!artFile && !artUrl) {
      return res.status(400).send('Please upload art or provide an external URL.');
    }

    const roomId = crypto.randomUUID();

    const videoSrc = videoFile
      ? `/uploads/${videoFile.filename}`
      : videoUrl;
    const artSrc = artFile
      ? `/uploads/${artFile.filename}`
      : artUrl;

    let subtitleSrc = null;
    let subtitleLabel = null;

    if (subtitleFile) {
      const ext = path.extname(subtitleFile.originalname).toLowerCase();
      if (ext === '.srt') {
        const srtContent = fs.readFileSync(subtitleFile.path, 'utf-8');
        const vttContent = convertSrtToVtt(srtContent);
        const vttName = `${crypto.randomUUID()}.vtt`;
        const vttPath = path.join(uploadsDir, vttName);
        fs.writeFileSync(vttPath, vttContent);
        subtitleSrc = `/uploads/${vttName}`;
      } else {
        subtitleSrc = `/uploads/${subtitleFile.filename}`;
      }
      subtitleLabel = subtitleFile.originalname;
    }

    rooms.set(roomId, createRoomData({
      videoSrc,
      artSrc,
      subtitleSrc,
      subtitleLabel
    }));

    return res.redirect(`/room/${roomId}`);
  }
);

app.get('/room/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const room = rooms.get(roomId);
  if (!room) {
    return res.status(404).send('Room not found.');
  }

  const subtitleTrack = room.subtitleSrc
    ? `<track kind="subtitles" src="${room.subtitleSrc}" srclang="en" label="${room.subtitleLabel}" default>`
    : '';

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Watch Together</title>
  <link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet" />
  <link href="/public/styles.css" rel="stylesheet" />
</head>
<body class="room-page">
  <header class="room-header">
    <div>
      <p class="room-label">Room ID</p>
      <p class="room-id">${roomId}</p>
    </div>
    <button class="copy-button" id="copyLink">Copy invite link</button>
  </header>
  <main class="player-wrapper">
    <video
      id="shared-player"
      class="video-js vjs-theme-forest"
      controls
      preload="auto"
      poster="${room.artSrc}"
      data-setup='{}'
    >
      <source src="${room.videoSrc}" />
      ${subtitleTrack}
    </video>
    <div class="sync-status" id="syncStatus">Connecting...</div>
  </main>
  <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
  <script src="https://vjs.zencdn.net/8.10.0/video.min.js"></script>
  <script>
    const roomId = "${roomId}";
    const socket = io({ query: { roomId } });
    const player = videojs('shared-player');
    const syncStatus = document.getElementById('syncStatus');
    const copyLinkButton = document.getElementById('copyLink');

    let isHost = false;
    let applyingRemote = false;

    const setStatus = (message) => {
      syncStatus.textContent = message;
    };

    copyLinkButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(window.location.href);
      copyLinkButton.textContent = 'Copied!';
      setTimeout(() => {
        copyLinkButton.textContent = 'Copy invite link';
      }, 1500);
    });

    const applyRemoteAction = (fn) => {
      applyingRemote = true;
      fn();
      setTimeout(() => {
        applyingRemote = false;
      }, 200);
    };

    socket.on('connect', () => {
      setStatus('Connected. Waiting for sync...');
    });

    socket.on('role', (payload) => {
      isHost = payload.isHost;
      setStatus(isHost ? 'You are the host. Play to start the room.' : 'Synced to host playback.');
      if (payload.state) {
        applyRemoteAction(() => {
          player.currentTime(payload.state.time);
          if (payload.state.paused) {
            player.pause();
          } else {
            player.play();
          }
        });
      }
    });

    socket.on('host-changed', (payload) => {
      isHost = payload.isHost;
      setStatus(isHost ? 'Host disconnected. You are now the host.' : 'Host changed. Staying synced.');
    });

    socket.on('play', ({ time }) => {
      applyRemoteAction(() => {
        player.currentTime(time);
        player.play();
      });
    });

    socket.on('pause', ({ time }) => {
      applyRemoteAction(() => {
        player.currentTime(time);
        player.pause();
      });
    });

    socket.on('seek', ({ time }) => {
      applyRemoteAction(() => {
        player.currentTime(time);
      });
    });

    socket.on('sync', ({ time, paused }) => {
      const diff = Math.abs(player.currentTime() - time);
      if (diff > 2) {
        applyRemoteAction(() => {
          player.currentTime(time);
          if (paused) {
            player.pause();
          } else {
            player.play();
          }
        });
      }
    });

    const emitIfLocal = (event, payload) => {
      if (!applyingRemote) {
        socket.emit(event, payload);
      }
    };

    player.on('play', () => {
      emitIfLocal('play', { time: player.currentTime() });
    });

    player.on('pause', () => {
      emitIfLocal('pause', { time: player.currentTime() });
    });

    player.on('seeked', () => {
      emitIfLocal('seek', { time: player.currentTime() });
    });

    setInterval(() => {
      if (isHost && !applyingRemote) {
        socket.emit('time-update', { time: player.currentTime(), paused: player.paused() });
      }
    }, 1000);
  </script>
</body>
</html>`);
});

io.on('connection', (socket) => {
  const { roomId } = socket.handshake.query;
  const room = rooms.get(roomId);
  if (!room) {
    socket.disconnect(true);
    return;
  }

  socket.join(roomId);

  if (!room.hostSocketId) {
    room.hostSocketId = socket.id;
  }

  socket.emit('role', {
    isHost: socket.id === room.hostSocketId,
    state: room.lastState
  });

  socket.on('play', ({ time }) => {
    room.lastState = { time, paused: false };
    socket.to(roomId).emit('play', { time });
  });

  socket.on('pause', ({ time }) => {
    room.lastState = { time, paused: true };
    socket.to(roomId).emit('pause', { time });
  });

  socket.on('seek', ({ time }) => {
    room.lastState = { time, paused: room.lastState.paused };
    socket.to(roomId).emit('seek', { time });
  });

  socket.on('time-update', ({ time, paused }) => {
    if (socket.id !== room.hostSocketId) {
      return;
    }
    room.lastState = { time, paused };
    socket.to(roomId).emit('sync', { time, paused });
  });

  socket.on('disconnect', () => {
    if (room.hostSocketId === socket.id) {
      const roomSockets = io.sockets.adapter.rooms.get(roomId);
      const nextHost = roomSockets ? Array.from(roomSockets)[0] : null;
      room.hostSocketId = nextHost;
      if (nextHost) {
        io.to(nextHost).emit('host-changed', { isHost: true });
        socket.to(roomId).emit('host-changed', { isHost: false });
      }
    }

    const remaining = io.sockets.adapter.rooms.get(roomId);
    if (!remaining || remaining.size === 0) {
      rooms.delete(roomId);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
