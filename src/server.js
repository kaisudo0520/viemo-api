require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { createClient, fetchAllVideos, addTextTrack, uploadSrtContent } = require("./vimeo-client");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());
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
    // Test connection by fetching user info
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
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".srt") {
      unmatched.push({ filename: file.originalname, reason: "非 SRT 檔案" });
      continue;
    }

    const title = path.basename(file.originalname, ext);
    const titleNorm = normalize(title);
    const found = cachedVideos.find((v) => normalize(v.name) === titleNorm);

    if (found) {
      const videoId = found.uri.replace("/videos/", "");
      matched.push({
        filename: file.originalname,
        titleFromFile: title,
        videoId,
        videoName: found.name,
        videoLink: found.link,
        srtContent: file.buffer.toString("utf-8"),
      });
    } else {
      unmatched.push({ filename: file.originalname, titleFromFile: title, reason: "找不到匹配影片" });
    }
  }

  res.json({ matched, unmatched });
});

// Upload text tracks
app.post("/api/upload", async (req, res) => {
  if (!activeClient) return res.status(401).json({ error: "尚未連線" });

  const { items } = req.body; // [{ videoId, srtContent, filename }]
  if (!items || items.length === 0) return res.status(400).json({ error: "無上傳項目" });

  const results = [];

  for (const item of items) {
    try {
      const track = await addTextTrack(activeClient, item.videoId);
      await uploadSrtContent(activeClient, track.link, item.srtContent);
      results.push({ filename: item.filename, videoId: item.videoId, status: "success" });
    } catch (err) {
      results.push({ filename: item.filename, videoId: item.videoId, status: "error", error: err.message });
    }

    // Rate limit delay
    await new Promise((r) => setTimeout(r, 800));
  }

  res.json({ results });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
