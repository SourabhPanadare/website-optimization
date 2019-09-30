# Reference
  
  ## Project Implementation	
     https://read.acloud.guru/serverless-image-optimization-and-delivery-510b6c311fe5
     https://github.com/andreasonny83/serverless-image-rendering

  ## AWS Setup On Local Machine
     https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
     https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04
     https://serverless.com/framework/docs/providers/aws/guide/credentials/

# AWS Setup On Local Machine
  
  $ sudo apt install awscli
  $ aws configure
    AWS Access Key ID [None]: xxx
    AWS Secret Access Key [None]: xxx
    Default region name [None]: xxx
    Default output format [None]: ENTER

# Prerequisites

	This project requires NodeJS (at least version 6) and NPM.
	[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
	To make sure you have them available on your machine,
	try running the following command.

	```sh
	$ node -v && npm -v
	v10.15.1
	6.9.0
	```

	You may also want to install Serverless globally on your local machine for accessing the
	CLI functionality and directly interact with your deployed Lambda function.

	To install Serverless globally on your machine, run the following command

	```sh
	$ npm i -g serverless
	```
	
  ## Optional requisites

	This project is making use of Serverless and Docker.
	They are both optionals however Docker will be required for deploying your local code
	to Lambda if you are not running this project from a Linux machine.
	Read the [Docker](#docker) section to know more about.

# Installation

	Start with cloning this repo on your local machine:

	```sh
	$ git clone https://github.com/andreasonny83/serverless-image-rendering.git
	$ cd serverless-image-rendering
	```

	Then install all the Node dependencies using npm or Yarn

	```sh
	$ npm install
	# Or using Yarn for a faster installation
	$ yarn
	```

# Images Bucket

	This project is making use of a pre-existing S3 bucket from where fetching
	the images to be processed and deliver to the client.
	If you don't have an S3 already, create one from your AWS dashboard and
	continue reading the [Environment configuration](#environment-configuration)
	section.

# Usage

  ## Environment configuration

	This project contains a `serverless.sample.yml` file.
	You need to manually renamed it to `serverless.yml`.
	In order for your application to be correctly deployed to AWS, you will need to
	replace the `BUCKET` name under the `environment` section according to your S3
	bucket name previously created.

  ## dotENV

	For your local development you will need a `.env` file containing your S3 bucket name.
	Rename the `.env.sample` file in this project to be `.env` first, then replace the
	`your-s3-bucket-name` placeholder with the correct name of your S3 Bucket.

  ## Serving the app

	```sh
	$ npm run serve
	```

	This will run the Lambda function locally using `serverless-offline`.

  ## Resizing your images

	While running your local app, open a browser to
	[`http://localhost:3000/resize-image?status`](http://localhost:3000/resize-image?status)

	You should be able to see a JSON information to prove that your app is actually
	up and running.

	`http://localhost:3000/resize-image?image=FILE-NAME&width=WIDTH&height=HEIGHT&quality=QUALITY&type=TYPE`


	**Example**

	`http://localhost:3000/resize-image?image=placeholder.png&width=600&quality=75&type=jpeg`

	Assuming that you have an image called `placeholder.png` on your S3 bucket:


  ## Docker

	The `Make install` command will run `npm install` from inside a Docker
	container to reproduce the same environment configuration present on AWS Lambda.
	Deploying the Lambda function after running `npm install` from your local machine
	will probably result on the function returning a server error if your local machine
	configuration is different from the one on AWS.

	To make sure the `npm run deploy` succeeds:

	1. Clean your `node_modules` folder with `rm -rf node_modules package-lock.json`
	1. Create the Docker image with `make build`
	1. Run `npm install` from inside the Docker container with `make install`
	1. Then run serverless deploy` with `npm run deploy`

  ## Deployment

	1. Install serverless globally
	1. Make sure you have correctly set up your AWS credentials
	1. Install the Node dependencies with Docker by running `make build` to generate
	the Docker image, the run `make install` (This will run `npm install` from inside
	the Docker container using the same environment setup running on AWS)
	1. run `npm run deploy` to deploy your function to AWS Lambda



