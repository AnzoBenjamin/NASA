const mongoose = require("mongoose");
require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
});

mongoose.connection.once("error", (err) => {
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