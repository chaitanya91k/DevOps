## Homework 4 - Advanced Docker

### Introduction

I have used Digital Ocean droplets for this homework. 
* Droplet 1: Task 1 - File IO
* Droplet 2: Task 2 - Ambassador Pattern (Redis server and ambassador)
* Droplet 3: Task 2 - Ambassador Pattern (Redis client and ambassador)
* Droplet 4: Task 3 - Docker Deploy (Blue Green Slice)

### Pre-requisites

* Install docker using the following command<br/>
```
curl -sSL https://get.docker.com/ | sh
```
* Install docker compose using the following commands<br/>
```
curl -L https://github.com/docker/compose/releases/download/1.5.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose<br/>
chmod +x /usr/local/bin/docker-compose
```

### 1. File IO

* Create a Digital Ocean Droplet
* The code can be found in the directory [File IO](https://github.com/karunim28/DevOps/tree/master/HW/HW4/FileIO)
* The Dockerfile for the first container includes code to create and write to a file and expose the contents using socat and tcp4 on port 9001
* Build and run the docker container
```
docker build -t container .
docker run -it --name container container
```
* The directory of [Linked Container](https://github.com/karunim28/DevOps/tree/master/HW/HW4/FileIO/LinkedContainer) contains another Dockerfile which would be used to install curl so as to read the contents exposed by the first container over the network
* Build and run the docker container
```
docker build -t linkedcontainer .
docker run -it --link container:dockerContainer --name linkedcontainer linkedcontainer curl dockerContainer:9001
```

### 2. Ambassador Pattern

* Create a Digital Ocean Droplet that would be used for Redis Server and Ambassador containers
* Create another Digital Ocean Droplet that would be used for Redis Client and Ambassador containers
* The client would connect with its ambassador which would communicates with server's ambassador which in turn communicates with redis server
* Code for Ambassador Pattern implementation is [here](https://github.com/karunim28/DevOps/tree/master/HW/HW4/AmbassadorPattern)
* [docker-compose.yml](https://github.com/karunim28/DevOps/blob/master/HW/HW4/AmbassadorPattern/ServerDroplet/docker-compose.yml) of server droplet 
* Run the command <br/>
`docker-compose up`
* [docker-compose.yml](https://github.com/karunim28/DevOps/blob/master/HW/HW4/AmbassadorPattern/ClientDroplet/docker-compose.yml) of client droplet
* Run the command <br/>
`docker-compose run redisClient`
<br/>
![](https://cloud.githubusercontent.com/assets/9260911/11317283/2cf4543a-8ff7-11e5-8702-ccb9d641e5b0.png)

### 3. Docker Deploy

* Create a Digital Ocean Droplet
* Code for Docker Deploy is [here](https://github.com/karunim28/DevOps/tree/master/HW/HW4/DockerDeploy)
* Make the following directory structure
  * deploy/
    * blue.git/
    * blue-www/
    * green.git/
    * green-www/
* Go to blue.git and initialize bare repo `git init --bare`
* Go to green.git and initialize bare repo `git init --bare`
* Clone the [App](https://github.com/CSC-DevOps/App)
* Add remotes for App
```
git remote add blue file:///root/deploy/blue.git
git remote add green file:///root/deploy/green.git
```
* The post-commit hook for App is [here](https://github.com/karunim28/DevOps/blob/master/HW/HW4/DockerDeploy/AppHook/post-commit)
* The post-receive hooks are as follows
  * [Green Slice](https://github.com/karunim28/DevOps/blob/master/HW/HW4/DockerDeploy/deploy/green.git/hooks/post-receive)
  * [Blue Slice](https://github.com/karunim28/DevOps/blob/master/HW/HW4/DockerDeploy/deploy/blue.git/hooks/post-receive)
* Go to App and update main.js (eg. Changing text as 'Hello, this is green slice')
* Run the commands to deploy the changes to green slice
```
git add main.js
git commit -m "Green Deployment"
git push green master
```
* Go to http://dropletip:8000 to test if app is running
* Go to App and update main.js (eg. Changing text as 'Hello, this is blue slice')
* Run the commands to deploy the changes to blue slice
```
git add main.js
git commit -m "Blue Deployment"
git push blue master
```
* Go to http://dropletip:8001 to test if app is running
