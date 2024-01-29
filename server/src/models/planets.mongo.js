const mongoose = require("mongoose")
const schema = mongoose.Schema

const planetsSchema = new schema({
    keplerName: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Planet", planetsSchema)