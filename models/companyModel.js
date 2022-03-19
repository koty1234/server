const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    companyName: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: String, required: true},
    presidentName: {type: String, required: true},
    yib: {type: Number, required: true},
    businessType: {type: String, required: true},
    businessPhone: {type: String, required: true},
    businessEmail: {type: String, required: true},
    revenue: {type: Number, required: true},
    website: {type: String},
    facebook: {type: String},
    instagram: {type: String},
    twitter: {type: String},
    linkedin: {type: String},
},
{
    timestamps: true,
});

const User = mongoose.model("company", companySchema);

module.exports = User;