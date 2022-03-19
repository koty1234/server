const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    position: {type: String},
    phone: {type: String},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    company: {type: ObjectId},
},
{
    timestamps: true,
});

const User = mongoose.model("user", userSchema);

module.exports = User;