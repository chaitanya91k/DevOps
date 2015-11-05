## HW #3 Proxies, Queues, Cache Fluency

### Setup
* Clone this repo
* Go to the Queues directory `cd Queues`
* Run `npm install` to install the dependencies
* Run `sudo node main.js` to start the server

### Tasks
Express server has been configured to listen on port 3000. The same can be viewed at `http://localhost:3000/`.

* get/set - On visiting `http://localhost:3000/set`, a key would be set with the message that expires in 10 seconds. Hence, visit `http://localhost:3000/get` to view the key within 10 seconds.

* recent - `http://localhost:3000/recent` would display 5 recent urls that were visited. Redis queues have been used for the same with the ltrim function to store 5 recent urls.

* upload/meow - Images can be uploaded by running the curl command from the Queues directory eg. `curl -F "image=@./img/morning.jpg" localhost:3000/upload`. This would upload images in a redis queue. Each request to `http://localhost:3000/meow` will display the images from most recent to least recent of the queue. If the queue is empty, the user will be shown a message that there are 'No images to show!'.

* Additional service instance running - An additional instance is configured to listen on port 3001. All the above urls can be visited through the port 3001. Upload can be perfomed by running curl command from Queues directory `curl -F "image=@./img/morning.jpg" localhost:3001/upload`

* Proxy - A new http proxy server has been configured to listen on port 80. I have added a dependency named `http-proxy` in package.json. The server alternately picks up localhost:3000 and localhost:3001 from redis queue by using the `rpoplpush` function. Hence, localhost would act as proxy server for two instances running on ports 3000 and 3001, thus enabling all the above requests to the proxy server. Proxy server will invoke alternate servers to fulfil the request. The same can be viewed in log statements. 

Upload can be performed at `http://localhost/upload`
For performing upload to localhost, run the following curl command from Queues directory <br/>
`sudo curl -F "image=@./img/morning.jpg" localhost/upload`

set, get, recent, meow would work in a similar manner eg. `http://localhost/set`

### Screencast
[ Demo ] (https://youtu.be/SURK34vKFLU)
