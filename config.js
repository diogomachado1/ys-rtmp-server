module.exports = {
  apiUrl: process.env.API_URL || "http://localhost:3333/v1/",
  apiSecret: process.env.API_SECRET || "secret",
  authPass: process.env.AUTH_PASS || "admin",
  authSecret: process.env.AUTH_SECRET || "nodemedia2017privatekey",
};
