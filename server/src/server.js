const http = require("http");
const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const server = http.createServer(app);
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log("Server is listening on port ", PORT);
  });
}

startServer();
