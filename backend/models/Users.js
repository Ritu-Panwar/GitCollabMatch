const mongoose = require("mongoose");
const {Schema}= mongoose;

const UserSchema = new Schema({
    name: {
        type: String, 
        rquired: true
    },
    email: {
        type: String, 
        unique: true,
        rquired: true
    },
    password: {
        type: String, 
        rquired: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const User = mongoose.model("user", UserSchema);
User.createIndexes();
module.exports = User;