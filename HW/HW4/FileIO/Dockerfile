FROM ubuntu:14.04
MAINTAINER Karishma Nimgaonkar, knimgao@ncsu.edu

# Create file and write to it
RUN touch hello.txt
RUN echo 'Hello, This is Docker File IO Demo' > hello.txt

# Install socat
RUN apt-get -y update
RUN apt-get -y install socat

# Use Socat, SYSTEM and cat to expose on port 9001
CMD socat TCP4-LISTEN:9001 SYSTEM:'cat hello.txt'
