const mongoose = require("mongoose");
require("dotenv").config(); // Load env variables

const mongoURI = process.env.MONGO_URI;

const mongotoConnect = () => {
    try {
        mongoose.connect(mongoURI);
            console.log("Mongoose Connected Successfully");
    } catch (error) {
        console.log("Mongoose Not Connected Successfully", error);
    }
}

module.exports = mongotoConnect;