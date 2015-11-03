var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var length;
///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);

	// ... INSERT HERE.
	client.lpush('queue', req.url, function(err, reply) {
		console.log("Length: ", reply);
		client.ltrim('queue', 0, 4);
		client.lrange('queue',0,-1, function(error, queue) {
	        console.log("queue: " + queue);
	    })

	})
	
	// console.log("Queue length: ", client.llen('queue'))

	next(); // Passing the request to the next handler in the stack.
});

// app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
//    console.log(req.body) // form fields
//    console.log(req.files) // form files

//    if( req.files.image )
//    {
// 	   fs.readFile( req.files.image.path, function (err, data) {
// 	  		if (err) throw err;
// 	  		var img = new Buffer(data).toString('base64');
// 	  		console.log(img);
// 		});
// 	}

//    res.status(204).end()
// }]);

// app.get('/meow', function(req, res) {
// 	{
// 		if (err) throw err
// 		res.writeHead(200, {'content-type':'text/html'});
// 		items.forEach(function (imagedata) 
// 		{
//    		res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
// 		});
//    	res.end();
// 	}
// })

// HTTP SERVER
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
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
	res.send('set key with message successfully!')
})

app.get('/recent', function(req, res) {
	client.lrange('queue', 0, 4, function(err,value){ res.send(value)});
})
