const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const snippetSchema = new mongoose.Schema({
    userId: {type: ObjectId, required: true},
    title: {type: String, required: true},
    description: {type: String},
    code: {type: String},
},
{
    timestamps: true
});

const Snippet = mongoose.model("snippet", snippetSchema);

module.exports = Snippet;