const router = require("express").Router();
const multer = require('multer');
const fs = require('fs')
const auth = require("../middleware/auth");
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { uploadFileToS3, getObject } = require('../s3');
const Vendor = require("../models/vendorModel");
const Company = require("../models/companyModel");
const tempFiles = multer({dest: './tempfiles'});


// uploads logo to S3 and saves reference in MongoDB
router.post("/", tempFiles.single('uploadFile'), auth, async (req, res) => {
    try{
        const uploadFile = req.file;
        const type = req.body.type;
        const side = req.body.side;
        const vendorId = req.body.vendorId || null;
        const companyId = req.body.companyId || null;

        if(side == "vendor"){
            if (!vendorId) {
                return res.status(400).json({errorMessage: "No vendor ID passed"});
            }
  
        // check if Vendor exists
        const existingVendor = await Vendor.findById(vendorId);
        if (!existingVendor)
            return res.status(400).json({errorMessage: "No vendor with this ID is found"});
  
        // check if Authorized
        if(existingVendor.userIds[0].admin != req.user)  
            return res.status(400).json({errorMessage: "Unauthorized"});

        const s3File = await uploadFileToS3(uploadFile);
        await unlinkFile(uploadFile.path);

        if(type == "logo"){
        existingVendor.logoKey = s3File.Key;
        const saveVendor = await existingVendor.save();
        res.json(saveVendor);
        }
        else if(type == "banner"){
            existingVendor.bannerKey = s3File.Key;
            const saveVendor = await existingVendor.save();
            res.json(saveVendor);
        }
    } 
    else if(side == "company"){
        if (!companyId) {
            return res.status(400).json({errorMessage: "No vendor ID passed"});
        }

    // check if Authorized
    const existingCompany = await Company.findById(companyId);
    if (!existingCompany)
        return res.status(400).json({errorMessage: "No company with this ID is found"});

    // check if Authorized
    if(existingCompany.userIds[0].admin != req.user)  
        return res.status(400).json({errorMessage: "Unauthorized"});

    const s3File = await uploadFileToS3(uploadFile);
    await unlinkFile(uploadFile.path);

    if(type == "logo"){
    existingCompany.logoKey = s3File.Key;
    const saveCompany = await existingCompany.save();
    res.json(saveCompany);
    }
    else if(type == "banner"){
        existingCompany.bannerKey = s3File.Key;
        const saveCompany = await existingCompany.save();
        res.json(saveCompany);
    }
    }
}
    catch (err) {
        res.status(500).json({errorMessage: "Whoops! Something went wrong."});
        console.log(err);
      }
});

//gets file from S3 based on reference from MongoDB and PIPES directly to browser
router.get('/vendor/logo/:id', async (req, res) => {
    try{
    const vendor = await Vendor.findById(req.params.id);
    if(vendor.logoKey){
    const url = getObject(vendor.logoKey);
    res.json({url:url});
    }
    else res.json({url: "https://public-images-for-cred-pay.s3.amazonaws.com/uploadLogoDefaultImage" });
}
catch(err) {
    console.log(err);
}
});

router.get('/vendor/banner/:id', async (req, res) => {
    try{
    const vendor = await Vendor.findById(req.params.id);
    if(vendor.bannerKey){
    const url = getObject(vendor.bannerKey);
    res.json({url:url});
    }
    else res.json({url: "https://public-images-for-cred-pay.s3.amazonaws.com/uploadLogoDefaultImage" });
}
catch(err) {
    console.log(err);
}
});

router.get('/company/logo/:id', async (req, res) => {
    try{
    const company = await Company.findById(req.params.id);
    if(company.logoKey){
    const url = getObject(company.logoKey);
    res.json({url:url});
    }
    else res.json({url: "https://public-images-for-cred-pay.s3.amazonaws.com/uploadLogoDefaultImage" });
}
catch(err) {
    console.log(err);
}
});

router.get('/company/banner/:id', async (req, res) => {
    try{
    const company = await Company.findById(req.params.id);
    if(company.bannerKey){
    const url = getObject(company.bannerKey);
    res.json({url:url});
    }
    else res.json({url: "https://public-images-for-cred-pay.s3.amazonaws.com/uploadLogoDefaultImage" });
}
catch(err) {
    console.log(err);
}
});

module.exports = router;