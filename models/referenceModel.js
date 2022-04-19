const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const referenceSchema = new mongoose.Schema({
    creatorId: {type: ObjectId, required: true},
    companyId: {type: ObjectId, required: true},
    referenceName: {type: String},
    referencePhoneNumber: {type: String},
    referenceEmail: {type: String},
    referenceAddress: {type: String},
    referenceContact: {type: String},
    refStatus: {type: String},
    payHistory: {type: String},
    refLength: {type: Number},
    offerCredit: {type: String},
    notes: {type: String},
},
{
    timestamps: true,
});

const Reference = mongoose.model("reference", referenceSchema);

module.exports = Reference;