const { Vimeo } = require("@vimeo/vimeo");

function createClient(accessToken) {
  return new Vimeo(null, null, accessToken);
}

function apiRequest(client, method, endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    client.request(
      { method, path: endpoint, query: method === "GET" ? params : undefined, body: method !== "GET" ? params : undefined },
      (error, body, statusCode) => {
        if (error) return reject(error);
        if (statusCode >= 400) return reject(new Error(`API ${statusCode}: ${JSON.stringify(body)}`));
        resolve(body);
      }
    );
  });
}

async function fetchAllVideos(client) {
  const videos = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const res = await apiRequest(client, "GET", "/me/videos", {
      per_page: perPage,
      page,
      fields: "uri,name,link",
    });

    if (!res.data || res.data.length === 0) break;
    videos.push(...res.data);

    console.log(`  已取得 ${videos.length} / ${res.total} 部影片...`);

    if (!res.paging || !res.paging.next) break;
    page++;
  }

  return videos;
}

async function addTextTrack(client, videoId, { language = "zh-TW", name = "繁體中文" } = {}) {
  return apiRequest(client, "POST", `/videos/${videoId}/texttracks`, {
    type: "subtitles",
    language,
    name,
  });
}

async function uploadSrtContent(client, uploadLink, srtContent) {
  return new Promise((resolve, reject) => {
    client.request(
      {
        method: "PUT",
        path: uploadLink,
        headers: { "Content-Type": "text/plain" },
        body: srtContent,
      },
      (error, body, statusCode) => {
        if (error) return reject(error);
        if (statusCode >= 400) return reject(new Error(`Upload ${statusCode}: ${JSON.stringify(body)}`));
        resolve(body);
      }
    );
  });
}

module.exports = { createClient, fetchAllVideos, addTextTrack, uploadSrtContent };
