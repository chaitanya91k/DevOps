# HW1 : Provisioning and Configuring Servers

### Pre-requisites ###
* install node js - version being used by me 0.10.25
* install ansible - version being used by me 1.9.2

### Steps ###
* Install dependencies specified in package.json for needle and aws-sdk using <br/>
`npm install` <br/>
* Obtain the token and ssh_key needed to access DigitalOcean and create droplets 
* Create a file called digitalocean_config.json that includes the token and ssh_key. <br/>
  Sample File: `{"token":"<your_token>", "ssh_key": <your_ssh_key>}`
* Run this command to create a droplet <br/>`node digitalocean.js` <br/>
* Create a file called aws_config.json that includes the accessKey, secretKey and region.<br/>
  Sample File: `{"accessKeyId": "<your_access_key>", "secretAccessKey": "<your_secret_key>", "region": "us-east-1"}`
* Run this command to create an AWS EC2 Instance <br/> `node aws.js` <br/>
* Your inventory file will now be created with two host entries: one for Digital Ocean and the other for AWS
