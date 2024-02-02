const http = require("http");
const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const server = http.createServer(app);
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model")
require('dotenv').config()

const PORT = process.env.PORT;

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
  });
}

startServer();
