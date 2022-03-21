const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const creditAppCustomSchema = new mongoose.Schema({
    creatorId: {type: ObjectId, required: true},
    vendorId: {type: ObjectId, required: true},
    qOne: {type: String},
    qTwo: {type: String},
    qThree: {type: String},
    qFour: {type: String},
    qFive: {type: String},
    qSix: {type: String},
    qSeven: {type: String},
    qEight: {type: String},
    qNine: {type: String},
    qTen: {type: String},

},
{
    timestamps: true,
});

const CreditAppCustom = mongoose.model("creditAppCustom", creditAppCustomSchema);

module.exports = CreditAppCustom;