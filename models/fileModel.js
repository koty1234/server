const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const fileSchema = new mongoose.Schema({
    creatorId: {type: ObjectId, required: true},
    companyId: {type: ObjectId},
    vendorId: {type: ObjectId},
    file: {type: String},
},
{
    timestamps: true,
});

const File = mongoose.model("file", fileSchema);

module.exports = File;