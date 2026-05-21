const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../config');

// Initialize S3 client only if credentials are provided
let s3Client = null;

if (config.aws.accessKeyId && config.aws.secretAccessKey) {
  s3Client = new S3Client({
    region: config.aws.region,
    credentials: {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
    },
  });
}

/**
 * Upload file to S3
 */
async function uploadToS3(key, buffer, contentType) {
  if (!s3Client) {
    throw new Error('S3 is not configured');
  }

  const command = new PutObjectCommand({
    Bucket: config.aws.s3Bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  
  return `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
}

/**
 * Delete file from S3
 */
async function deleteFromS3(key) {
  if (!s3Client) {
    throw new Error('S3 is not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: config.aws.s3Bucket,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Generate unique filename for S3
 */
function generateS3Key(filename) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = filename.split('.').pop();
  return `reports/${timestamp}-${random}.${extension}`;
}

module.exports = {
  uploadToS3,
  deleteFromS3,
  generateS3Key,
  s3Client,
};
