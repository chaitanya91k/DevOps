## Homework 4 - Advanced Docker

### File IO
* docker build -t container .
* docker run -it --name container container

* docker build -t linkedcontainer .
* docker run -it --link container:dockerContainer --name linkedcontainer linkedcontainer curl dockerContainer:9001
