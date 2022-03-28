const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const creditApplicationSchema = new mongoose.Schema({
    creatorId: {type: ObjectId, required: true},
    companyId: {type: ObjectId, required: true},
    customCredAppId: {type: ObjectId, required: true},
    aOne: {type: String},
    aTwo: {type: String},
    aThree: {type: String},
    aFour: {type: String},
    aFive: {type: String},
    aSix: {type: String},
    aSeven: {type: String},
    aEight: {type: String},
    aNine: {type: String},
    aTen: {type: String},
    tandc: {type: Boolean},
    tandcInternal: {type: Boolean},
    signature: {type: Object},
},
{
    timestamps: true,
});

const CreditApplication = mongoose.model("creditApplication", creditApplicationSchema);

module.exports = CreditApplication;