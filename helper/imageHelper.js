const AWS = require('aws-sdk');

// Create an S3 instance
const s3 = new AWS.S3();

// Function to retrieve session token
async function getSessionToken() {
  try {
    const sts = new AWS.STS();
    const data = await sts.getCallerIdentity().promise();
    
    const accessKeyId = data.AccessKeyId;
    const secretAccessKey = data.SecretAccessKey;
    const sessionToken = data.SessionToken;

    return {
      accessKeyId,
      secretAccessKey,
      sessionToken
    };
  } catch (error) {
    console.error('Error retrieving session token:', error.message);
    throw error;
  }
}

// Upload image object to S3 bucket
async function uploadImageToS3(bucket, key, imageObject) {
  try {
    const credentials = await getSessionToken();

    // Configure AWS credentials
    AWS.config.update({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
      region: 'us-east-1'
    });

    const params = {
      Bucket: bucket,
      Key: key,
      Body: imageObject,
      ContentType: 'image/jpeg', // Modify the content type as per your image type
      ACL: 'public-read' // Set the ACL to allow public access
    };

    const data = await s3.upload(params).promise();
    return data;
  } catch (error) {
    console.error('Error uploading image:', error.message);
    throw error;
  }
}

module.exports = uploadImageToS3;
