# HW1 : Provisioning and Configuring Servers

### Pre-requisites ###
* install node js - version being used by me 0.10.25
* install ansible - version being used by me 1.9.2
* Obtain the token and ssh_key needed to access DigitalOcean and create droplets 
* Create a file called digitalocean_config.json that includes the token and ssh_key. <br/>
  Sample File: `{"token":"<your_token>", "ssh_key": <your_ssh_key>}`
* Create an IAM User and give the user Administrator access and download the accessKey and secretKey for the user
* Create a file called aws_config.json that includes the accessKey, secretKey and region.<br/>
  Sample File: `{"accessKeyId": "<your_access_key>", "secretAccessKey": "<your_secret_key>", "region": "us-east-1"}`
* Create or upload a public key and provide a name for it. Note this name and update the aws.js file to include your KeyName on line 9
* Update the variable ssh_path in digitalocean.js and aws.js to point to your private key

### Steps ###
#### Method 1: Script ####
* Run the script servers.sh using any of the following commands <br/> `sh servers.sh`<br/> `./servers.sh` <br/> It will install dependencies, create droplet, create instance and deploy nginx webserver through ansible playbook

#### Method 2: Manually ####
* Install dependencies specified in package.json for needle and aws-sdk using <br/>
`npm install` <br/>
* Run this command to create a droplet <br/>`node digitalocean.js` <br/>
* Run this command to create an AWS EC2 Instance <br/> `node aws.js` <br/>
* Your inventory file will now be created with two host entries: one for Digital Ocean and the other for AWS
* Run this command to deploy nginx webserver through ansible playbook <br/>
  `ansible-playbook --sudo -i inventory ansible_playbook.yml`

### Screencast ###
[ Demo ] (https://youtu.be/gUiocGlpnFA)
