var http = require('http'),
    httpProxy = require('http-proxy');
var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()

// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
///////////// WEB ROUTES

//http proxy implementation
var pserver = http.createServer(function(req, res) {

	client.rpoplpush('proxyUrlQueue', 'proxyUrlQueue', function(err, reply) {
		console.log("Delivering request to: ", reply)
		var proxy = httpProxy.createProxyServer({target: reply});
		proxy.web(req, res);
	})
});

pserver.listen(80, function() {
	console.log("proxy server listening on port 80")
});

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);

	// ... INSERT HERE.
	client.lpush('queue', req.url, function(err, reply) {
		// console.log("URL Queue Length after pushing: ", reply);
		client.ltrim('queue', 0, 4);
		client.llen('queue', function(err, response) {
			console.log("Length of the queue after pushing: ", response)
		})
	})

	next(); // Passing the request to the next handler in the stack.
});

app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
   // console.log(req.body) // form fields
   // console.log(req.files) // form files

   if( req.files.image )
   {
	   fs.readFile( req.files.image.path, function (err, data) {
	  		if (err) throw err;
	  		var img = new Buffer(data).toString('base64');
	  		client.lpush('image', img, function(err, reply) {
	  			// console.log("Image Queue length: ", reply);
	  		})
		});
	}

   res.status(204).end()
}]);

app.get('/meow', function(req, res) {

	client.lrange('image', 0, 0, function(err, imagedata) {
		if (imagedata == "") {
			res.send("No images to show !")
		}
		else {
			res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
		}
		
		client.lpop('image', function(err, value) {
			// console.log("After popping: ", value)
			// console.log("top value removed")
		})
		res.end();
	});
   	
})

// HTTP SERVER
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  client.del('proxyUrlQueue', function(err, reply) {
  	console.log("Deleted old url queue")
  })

  	var url1 = 'http://localhost:'+port

	client.lpush('proxyUrlQueue', url1, function(err, reply) {
	  	console.log("Added url1 in queue");
	})

  console.log('Example app listening at http://%s:%s', host, port)
})

// HTTP SERVER
var server1 = app.listen(3001, function () {

  var host1 = server1.address().address
  var port1 = server1.address().port

	var url2 = 'http://localhost:'+port1

	client.lpush('proxyUrlQueue', url2, function(err, reply) {
	  	console.log("Added url2 in queue");
	})
  console.log('Example app listening at http://%s:%s', host1, port1)
})

app.get('/', function(req, res) {
  res.send('hello world!')
})

app.get('/get', function(req, res) {
	client.get('newkey', function(err,value){ res.send(value)});
})

app.get('/set', function(req, res) {
	client.set('newkey', 'this message will self-destruct in 10 seconds');
	client.expire('newkey', 10);
	res.send('set key with message successfully, key will expire in 10 seconds!')
})

app.get('/recent', function(req, res) {
	client.lrange('queue', 0, 4, function(err,value){ res.send(value)});
})
