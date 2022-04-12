const router = require("express").Router();
const auth = require("../middleware/auth");
const File = require("../models/fileModel");
const multer = require('multer');
const tempFiles = multer({dest: './tempfiles'});
const { uploadFileToS3 } = require('../s3');


// uploads logo to 
router.post("/", tempFiles.single('uploadFile'), async (req, res) => {
    try{
        const uploadFile = req.file;
        const creatorId = req.body.creatorId;
        const companyId = req.body.companyId || null;
        const vendorId = req.body.vendorId || null;

        const s3File = await uploadFileToS3(uploadFile);

    const newFile = new File({
        creatorId : creatorId,
        companyId: companyId,
        vendorId: vendorId,
        file: s3File.Key,
    });

    const file = await newFile.save();
    res.status(200).json(file);
    }
    catch (err) {
        res.status(500).json({errorMessage: "Whoops! Something went wrong."});
        console.log(err);
      }
});


module.exports = router;