const router = require("express").Router();
const File = require("../models/fileModel");
const multer = require('multer');
const fs = require('fs')
const auth = require("../middleware/auth");
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { uploadFileToS3, getFileStream } = require('../s3');
const tempFiles = multer({dest: './tempfiles'});


// uploads logo to S3 and saves reference in MongoDB
router.post("/", tempFiles.single('uploadFile'), auth, async (req, res) => {
    console.log(req.body.companyId);
    try{
        const uploadFile = req.file;
        const creatorId = req.user;
        const companyId = req.body.companyId || null;
        const vendorId = req.body.vendorId || null;

        const s3File = await uploadFileToS3(uploadFile);
        await unlinkFile(uploadFile.path);

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

//gets file from S3 based on reference from MongoDB and PIPES directly to browser
router.get('/:key', (req, res) => {
    try{
        console.log(req.params.key);
    const key = req.params.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
}
catch(err) {
    console.log(err);
}
});

module.exports = router;