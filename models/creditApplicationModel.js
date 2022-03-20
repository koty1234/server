const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const creditApplicationSchema = new mongoose.Schema({
    creatorId: {type: ObjectId, required: true},
    companyId: {type: ObjectId, required: true},
    vendorId: {type: ObjectId, required: true},
    annualVolume: {type: Number, required: true},
    requestedAmount: {type: Number, required: true},
    additionalRequirements: {type: ObjectId, required: true},
},
{
    timestamps: true,
});

const CreditApplication = mongoose.model("creditApplication", creditApplicationSchema);

module.exports = CreditApplication;