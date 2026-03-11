const fs = require("fs");
const path = require("path");

function loadSrtFiles(srtDir) {
  if (!fs.existsSync(srtDir)) {
    throw new Error(`SRT 目錄不存在: ${srtDir}`);
  }

  return fs
    .readdirSync(srtDir)
    .filter((f) => f.toLowerCase().endsWith(".srt"))
    .map((filename) => ({
      filename,
      titleFromFile: path.basename(filename, path.extname(filename)),
      filePath: path.join(srtDir, filename),
    }));
}

function normalize(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, " ");
}

function matchSrtToVideos(srtFiles, videos) {
  const matched = [];
  const unmatched = [];

  for (const srt of srtFiles) {
    const srtNorm = normalize(srt.titleFromFile);
    const found = videos.find((v) => normalize(v.name) === srtNorm);

    if (found) {
      const videoId = found.uri.replace("/videos/", "");
      matched.push({ ...srt, videoId, videoName: found.name, videoLink: found.link });
    } else {
      unmatched.push(srt);
    }
  }

  return { matched, unmatched };
}

module.exports = { loadSrtFiles, matchSrtToVideos };
