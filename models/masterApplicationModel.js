const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const masterApplicationSchema = new mongoose.Schema({
    companyId: {type: ObjectId, required: true},
    vendorId: {type: ObjectId, required: true},
    creditApplicationId: {type: ObjectId, required: true},
    can: {type: Number},
    status: {String}, // Started | Completed | Verified | Approved | Declined | Other
    references: {Number},
    bank: {Boolean},
},
{
    timestamps: true,
});

masterApplicationSchema.pre("save", function(next){
    var docs = this;
    mongoose.model('MasterApplication', masterApplicationSchema).countDocuments(function(error, counter){
        if(error) return next(error);
        docs.can = counter+1;
        next();
    });   
});

const MasterApplication = mongoose.model("masterApplication", masterApplicationSchema);

module.exports = MasterApplication;