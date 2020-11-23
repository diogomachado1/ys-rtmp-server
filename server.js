const NodeMediaServer = require("node-media-server");
const Axios = require("axios");
const envConfig = require("./config");

const api = Axios.create({
  baseURL: envConfig.apiUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Api-Secret": envConfig.apiSecret,
  },
});

const config = {
  logType: 3,
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
  },
  http: {
    port: 8000,
    mediaroot: "./media",
    webroot: "./www",
    allow_origin: "*",
    api: true,
  },
  auth: {
    api: true,
    api_user: "admin",
    api_pass: envConfig.authPass,
    play: false,
    publish: false,
    secret: envConfig.authSecret,
  },
};

let nms = new NodeMediaServer(config);
nms.run();

nms.on("prePublish", async (id, StreamPath, args) => {
  let session = nms.getSession(id);
  if (!session.isLocal) {
    const username = StreamPath.replace("/live/", "");
    if (!args.key) return session.reject();
    try {
      const {
        data: { valid },
      } = await api.post("/intPvt/verifyKey", { username, key: args.key });
      if (!valid) return session.reject();
      await api.post("/intPvt/changeLiveStatus", { username, inLive: true });
    } catch (error) {
      return session.reject();
    }
  }
});

nms.on("donePublish", async (id, StreamPath, args) => {
  const session = nms.getSession(id);
  try {
    if (!session.isLocal) {
      const username = StreamPath.replace("/live/", "");
      await api.post("/intPvt/changeLiveStatus", { username, inLive: false });
    }
  } catch (e) {
    return;
  }
});
