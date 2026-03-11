const path = require("path");
const fs = require("fs");
const { createClient, fetchAllVideos, addTextTrack, uploadSrtContent } = require("./vimeo-client");
const { loadSrtFiles, matchSrtToVideos } = require("./matcher");

const SRT_DIR = path.resolve(__dirname, "../srt");
const DRY_RUN = process.argv.includes("--dry-run");
const UPLOAD_DELAY_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const token = process.argv[2];
  if (!token) {
    console.error("用法: node src/index.js <ACCESS_TOKEN> [--dry-run]");
    process.exit(1);
  }

  console.log(DRY_RUN ? "=== DRY-RUN 模式（不會實際上傳）===\n" : "=== 上傳模式 ===\n");

  // 1. 載入 SRT 檔案
  const srtFiles = loadSrtFiles(SRT_DIR);
  console.log(`找到 ${srtFiles.length} 個 SRT 檔案\n`);

  if (srtFiles.length === 0) {
    console.log("srt/ 目錄中沒有 .srt 檔案，請放入檔案後重試。");
    return;
  }

  // 2. 取得 Vimeo 影片列表
  console.log("正在取得 Vimeo 影片列表...");
  const client = createClient(token);
  const videos = await fetchAllVideos(client);
  console.log(`共取得 ${videos.length} 部影片\n`);

  // 3. 匹配
  const { matched, unmatched } = matchSrtToVideos(srtFiles, videos);

  // 4. 輸出匹配結果
  console.log(`--- 匹配結果 ---`);
  console.log(`✓ 成功匹配: ${matched.length}`);
  console.log(`✗ 未匹配:   ${unmatched.length}\n`);

  if (matched.length > 0) {
    console.log("匹配清單:");
    for (const m of matched) {
      console.log(`  ${m.filename} → ${m.videoName} (ID: ${m.videoId})`);
    }
    console.log();
  }

  if (unmatched.length > 0) {
    console.log("未匹配清單（找不到對應影片）:");
    for (const u of unmatched) {
      console.log(`  ${u.filename} (搜尋標題: "${u.titleFromFile}")`);
    }
    console.log();
  }

  // Dry-run 到此結束
  if (DRY_RUN) {
    console.log("=== DRY-RUN 結束，未執行任何上傳 ===");
    return;
  }

  // 5. 執行上傳
  console.log("--- 開始上傳字幕 ---\n");
  let successCount = 0;
  let failCount = 0;

  for (const m of matched) {
    try {
      process.stdout.write(`上傳: ${m.filename} → ${m.videoName}...`);

      // Step 1: 建立 text track，取得 upload link
      const track = await addTextTrack(client, m.videoId);
      const uploadLink = track.link;

      // Step 2: PUT SRT 內容
      const srtContent = fs.readFileSync(m.filePath, "utf-8");
      await uploadSrtContent(client, uploadLink, srtContent);

      console.log(" ✓");
      successCount++;
    } catch (err) {
      console.log(` ✗ ${err.message}`);
      failCount++;
    }

    await sleep(UPLOAD_DELAY_MS);
  }

  console.log(`\n--- 上傳完成 ---`);
  console.log(`成功: ${successCount}, 失敗: ${failCount}`);
}

main().catch((err) => {
  console.error("發生錯誤:", err.message);
  process.exit(1);
});
