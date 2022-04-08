const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const masterApplicationSchema = new mongoose.Schema({
    vendorId: {type: ObjectId, required: true},
    creditApplicationId: {type: ObjectId, required: true},
    status: {String}, // Started | Completed | Verified | Approved | Declined | Other
    references: {Number},
    bank: {Boolean},
},
{
    timestamps: true,
});

const MasterApplication = mongoose.model("masterApplication", masterApplicationSchema);

module.exports = MasterApplication;