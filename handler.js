const uuid = require('uuid');
const Sharp = require('sharp');
const Types = require('./src/types');
const ImageFetcher = require('./src/s3-image-fetcher');
const ImageResizr = require('./src/image-resizer');

const displayStatus = () => {
  const APP_NAME = process.env.APP_NAME;
  const ENV_NAME = process.env.ENV_NAME;

  return JSON.stringify({
    app: APP_NAME,
    environment: ENV_NAME,
    message: `OK - ${uuid.v4()}`,
  });
};

module.exports.fetchImage = (event) => {
  const imageFetcher = new ImageFetcher(process.env.BUCKET);

  const fileName = event.queryStringParameters && event.queryStringParameters.image;
  const status = event.queryStringParameters && 'status' in event.queryStringParameters;

  if (process.env.DEBUG) {
    console.log('bucketName:', imageFetcher._bucketName);
    console.log('fileName:', fileName);
  }

  if (Boolean(status)) {
    return {
      statusCode: 200,
      body: displayStatus(),
    };
  }

  return imageFetcher.fetchImage(fileName)
    .then(data => {
      const contentType = data.contentType;
      const img = new Buffer(data.image.buffer, 'base64');

      return {
        statusCode: 200,
        headers: { 'Content-Type': contentType },
        body: img.toString('base64'),
        isBase64Encoded: true,
      };
    })
    .catch(error => {
      console.error('Error:', error);
      return {
        statusCode: 200,
        body: error,
      };
    });
};

module.exports.resizeImage = async (event, context, callback) => {
  const imageFetcher = new ImageFetcher(process.env.BUCKET);
  const imageResizr = new ImageResizr(Types, Sharp);

  const fileName = event.queryStringParameters && event.queryStringParameters.image;
  const status = event.queryStringParameters && 'status' in event.queryStringParameters;
  const quality = event.queryStringParameters && +event.queryStringParameters.quality || 100;
  const type = event.queryStringParameters && event.queryStringParameters.type;
  const size = {
    w: event && +event.queryStringParameters.width || null,
    h: event && +event.queryStringParameters.height || null,
  };

  if (process.env.DEBUG) {
    console.log('bucketName:', imageFetcher._bucketName);
    console.log('fileName:', fileName);
  }

  if (Boolean(status)) {
    return {
      statusCode: 200,
      body: displayStatus(),
    };
  }

  return imageFetcher.fetchImage(fileName)
    .then(data => imageResizr.resize(data.image, size, quality, type))
    .then(data => {
      const contentType = data.contentType;
      const img = new Buffer(data.image.buffer, 'base64');

      return {
        statusCode: 200,
        headers: { 'Content-Type': contentType },
        body: img.toString('base64'),
        isBase64Encoded: true,
      };
    })
    .catch(error => {
      console.error('Error:', error);
      return {
        statusCode: 404,
        body: error,
      }
    });
};
