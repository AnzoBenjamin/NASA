const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://nasa-api:E58OT20HdKwIgkjj@cluster0.2lcjpfc.mongodb.net/?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("Connected successfully");
});

mongoose.connection.once("error", (err) => {
  console.error(err);
});

const mongoConnect = async() => {
    await mongoose.connect(MONGO_URL)
};
const mongoDisconnect= async()=>{
    await mongoose.disconnect()
}
module.exports = {
    mongoConnect,
    mongoDisconnect
}