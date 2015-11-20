FROM ubuntu:14.04
MAINTAINER Karishma Nimgaonkar, knimgao@ncsu.edu

# Bundle app source
COPY . /File-IO

# CMD "echo 'Hello' > /File-IO/hello.txt"
# Printing
#CMD cat /File-IO/hello.txt

# Install socat
RUN apt-get -y update
RUN apt-get -y install socat

RUN echo 'hi, this is Docker Demo for File IO' | tee /File-IO/hello.txt

CMD socat TCP4-LISTEN:9001 SYSTEM:'cat /File-IO/hello.txt'
