#!/bin/bash
#Script to provision and configure servers

echo -e "\n\n********** Installing dependencies **********"
npm install

echo -e "\n\n********** Provisioning Digital Ocean Droplet **********"
node digitalocean.js

echo -e "\n\n********** Provisioning AWS EC2 Instance **********"
node aws.js

echo -e "\n\n********** Waiting for activation **********"
sleep 1m

echo -e "\n\n********** Deploying nginx webserver through ansible playbook **********"
ansible-playbook --sudo -i inventory ansible_playbook.yml