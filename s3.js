const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');


const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKeyId = process.env.AWS_SECRET_ACCESS_KEY;
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKeyId
});

//uploads a file
function uploadFileToS3(file) {
    const filestream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Body: filestream,
        Key: file.filename,
    }
    return s3.upload(uploadParams).promise()
}
exports.uploadFileToS3 = uploadFileToS3;


//downloads a file
function getObject(fileKey) {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName
    }
    let url = s3.getSignedUrl('getObject', downloadParams);
    return url;
  }
  exports.getObject = getObject;