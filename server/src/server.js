const http = require("http");
const mongoose = require("mongoose")
const app = require("./app");
const server = http.createServer(app);
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;
const MONGO_URL = "mongodb+srv://nasa-api:E58OT20HdKwIgkjj@cluster0.2lcjpfc.mongodb.net/?retryWrites=true&w=majority"
mongoose.connection.once("open", ()=>{
  console.log("Connected successfully")
})

mongoose.connection.once("error", (err)=>{
  console.error(err)
})

async function startServer() {
  await mongoose.connect(MONGO_URL)
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log("Server is listening on port ", PORT);
  });
}

startServer()