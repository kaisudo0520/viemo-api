const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { createClient, fetchAllVideos, addTextTrack, uploadSrtContent } = require("./vimeo-client");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "../public")));

// --- State ---
let cachedVideos = null;
let activeClient = null;

function normalize(str) {
  return str.trim().toLowerCase().replace(/[\s\-_]+/g, " ");
}

// --- Routes ---

// Connect with token
app.post("/api/connect", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "缺少 Access Token" });

  try {
    const client = createClient(token);
    const user = await new Promise((resolve, reject) => {
      client.request({ method: "GET", path: "/me", query: { fields: "name,uri" } }, (err, body, status) => {
        if (err || status >= 400) return reject(new Error("Token 無效或連線失敗"));
        resolve(body);
      });
    });
    activeClient = client;
    cachedVideos = null;
    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Fetch videos
app.get("/api/videos", async (req, res) => {
  if (!activeClient) return res.status(401).json({ error: "尚未連線" });

  try {
    const videos = await fetchAllVideos(activeClient);
    cachedVideos = videos;
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Match SRT files against videos
app.post("/api/match", upload.array("srtFiles"), (req, res) => {
  if (!cachedVideos) return res.status(400).json({ error: "請先取得影片列表" });

  const files = req.files || [];
  if (files.length === 0) return res.status(400).json({ error: "未上傳任何檔案" });

  const matched = [];
  const unmatched = [];

  for (const file of files) {
    // multer stores originalname in latin1; decode to utf-8 for CJK filenames
    const decodedName = Buffer.from(file.originalname, "latin1").toString("utf-8");

    // Strip folder prefix from webkitRelativePath-style names
    const basename = decodedName.includes("/")
      ? decodedName.split("/").pop()
      : decodedName;

    const ext = path.extname(basename).toLowerCase();
    if (ext !== ".srt") {
      unmatched.push({ filename: basename, reason: "非 SRT 檔案" });
      continue;
    }

    const title = path.basename(basename, ext);
    const titleNorm = normalize(title);
    const found = cachedVideos.find((v) => normalize(v.name) === titleNorm);

    if (found) {
      const videoId = found.uri.replace("/videos/", "");
      matched.push({
        filename: basename,
        titleFromFile: title,
        videoId,
        videoName: found.name,
        videoLink: found.link,
        srtContent: file.buffer.toString("utf-8"),
      });
    } else {
      unmatched.push({ filename: basename, titleFromFile: title, reason: "找不到匹配影片" });
    }
  }

  res.json({ matched, unmatched });
});

// Store pending upload items
let pendingUploadItems = null;

app.post("/api/upload", (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: "無上傳項目" });
  pendingUploadItems = items;
  res.json({ ok: true, count: items.length });
});

// SSE stream for upload progress
app.get("/api/upload/stream", async (req, res) => {
  const items = pendingUploadItems;
  if (!items) return res.status(400).json({ error: "無待上傳項目" });
  pendingUploadItems = null;

  if (!activeClient) return res.status(401).json({ error: "尚未連線" });

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const total = items.length;
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < total; i++) {
    const item = items[i];
    send("progress", { index: i, filename: item.filename, status: "uploading", current: i + 1, total });

    try {
      const track = await addTextTrack(activeClient, item.videoId);
      await uploadSrtContent(activeClient, track.link, item.srtContent);
      ok++;
      send("progress", { index: i, filename: item.filename, status: "success", current: i + 1, total });
    } catch (err) {
      fail++;
      send("progress", { index: i, filename: item.filename, status: "error", error: err.message, current: i + 1, total });
    }

    await new Promise((r) => setTimeout(r, 800));
  }

  send("done", { total, ok, fail });
  res.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
