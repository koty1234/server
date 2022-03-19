const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    companyName: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: String, required: true},
    presidentName: {type: String, required: true},
    yib: {type: Number, required: true},
    businessPhone: {type: String, required: true},
    businessEmail: {type: String, required: true},
},
{
    timestamps: true,
});

const Vendor = mongoose.model("vendor", vendorSchema);

module.exports = Vendor;