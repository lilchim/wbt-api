var AWS = require('aws-sdk');

var s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});

export class s3Service {

    config: any;
    s3: any;

    constructor({accessKeyId, secretAccessKey, region}) {
        this.config = {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: region
        }

        s3 = new AWS.S3(this.config);
    }
}