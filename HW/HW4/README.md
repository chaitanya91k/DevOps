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

### File IO
* docker build -t container .
* docker run -it --name container container

* docker build -t linkedcontainer .
* docker run -it --link container:dockerContainer --name linkedcontainer linkedcontainer curl dockerContainer:9001

* Command `docker run -it --link container:container --name linkedcontainer linkedcontainer curl container:9001`
