const mongoose = require("mongoose");

const decisionSchema = new mongoose.Schema({
    creatorId: {type: ObjectId, required: true},
    companyId: {type: ObjectId, required: true},
    vendorId: {type: ObjectId, required: true},
    creditApplicationModel: {type: ObjectId, required: true},
    status: {String}, // Started | Completed | Verified | Approved | Declined | Other
    amount: {Number},
    interestRate: {Number},
    terms: {String},
},
{
    timestamps: true,
});

const Decision = mongoose.model("decision", decisionSchema);

module.exports = Decision;