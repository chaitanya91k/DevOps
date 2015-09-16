var needle = require("needle");
var os   = require("os");

var config = {};
config.token = process.env.TOKEN
config.ssh_key = process.env.SSH_KEY;

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

// Documentation for needle:
// https://github.com/tomas/needle

var client =
{
	listRegions: function( onResponse )
	{
		console.log("Attempting to list regions");
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},
	
	listImages: function( onResponse )
	{
		console.log("Attempting to list images");
		needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
	},

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[config.ssh_key],
			//"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

	getDroplet: function (dropletId, onResponse)
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse);
	},

	deleteDroplet: function (dropletId, onResponse)
	{
		var data = null;
		needle.delete("https://api.digitalocean.com/v2/droplets/"+dropletId, data, {headers:headers}, onResponse);
	}
};

var region;
var image;
var dropletId;
var dropletIpAddress;

client.listRegions(function(error, response)
{
	console.log("Listing regions");
	var data = response.body;

	if( data.regions )
	{
		region=data.regions[0]["slug"];
		console.log("Region selected: ", region);
	}

	client.listImages(function(error, response)
    {
 		console.log("Listing images");
 		console.log("Region to be searched: ", region);
		var data = response.body;

		if( data.images )
		{
			// var flag=false;
			for(var i=0; i<data.images.length; i++)
			{
				// if(flag == true)
				// {
				// 	break;
				// }
				for(var j=0; j<data.images[i]["regions"].length; j++)
				{
					if(data.images[i]["regions"][j] == region) 
					{
						// image=data.images[i]["slug"];
						console.log(data.images[i]["slug"]);
						// flag=true;
						// break;
					}
				}
			}
			image="ubuntu-14-04-x64";
			console.log("Image selected: ", image);
		}

		var name = "knimgao-droplet";
		client.createDroplet(name, region, image, function(error, response, body)
		{
			var isCreated=false;
			console.log("Creating Droplet");
			console.log(body);
			// StatusCode 202 - Means server accepted request.
			if(!error && response.statusCode == 202)
			{
				console.log( JSON.stringify( body, null, 3 ) );
				dropletId=body.droplet["id"];
				console.log("Droplet created with Id: ", dropletId);
				isCreated=true;
				
			}

			if(isCreated==true)
			{
				var waitingForDropletCreation=setInterval(function()
				{
					client.getDroplet(dropletId, function(error, response)
					{
						var getData=false;
						var data = response.body;
						console.log("Getting Droplet Details");
						// console.log( JSON.stringify(response.body) );

 						if(data.droplet)
 						{
 							for(var i=0; i<data.droplet["networks"]["v4"].length; i++)
 							{
 								if(data.droplet["networks"]["v4"][i]["ip_address"]!=null)
 								{
 									getData=true;
 									dropletIpAddress=data.droplet["networks"]["v4"][i]["ip_address"];
 									console.log("Droplet Ip Address: ", dropletIpAddress);
 									break;		
 								}
 							}
 						}
 						if(getData==true)
 						{
 							clearInterval(waitingForDropletCreation);

 							var fs = require('fs');
 							var ssh_user="root";
 							var ssh_path="/home/karishma/.ssh/id_rsa";
 							if(image.indexOf("coreos") >-1)
 							{
 								console.log("Image is Coreos");
 								ssh_user="core";
 							}
 							fs.writeFile('inventory', '[instances]\n', function(err) 
							{
    							if(err) 
    							{
        							return console.log(err);
    							}

    							console.log("Created Inventory File");
							});

 							digitalOceanInventory='digitalOceanNode ansible_ssh_host=' + dropletIpAddress + 
 												  ' ansible_connection=ssh ansible_ssh_user=' + ssh_user + 
 												  ' ansible_ssh_private_key_file=' + ssh_path;
							fs.appendFile('inventory', digitalOceanInventory+'\n', function(err) 
							{
    							if(err) 
    							{
        							return console.log(err);
    							}

    							console.log("Added inventory entry for Digital Ocean");
							});
 						}
					});

				},1000);
			}
			else
			{
				console.log("Droplet was not created");
			}
		});

    });	

});


// #############################################
// #4 Extend the client to retrieve information about a specified droplet.
// Comment out when done.
// https://developers.digitalocean.com/#retrieve-an-existing-droplet-by-id
// REMEMBER POST != GET
// Most importantly, print out IP address!
// var dropletId = "6880659";
/*client.getDroplet(dropletId, function(error, response)
{
 var data = response.body;
 //console.log( JSON.stringify(response.body) );

 if( response.headers )
 {
 	console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
 }

 if( data.droplet )
 {
 	for(var i=0; i<data.droplet["networks"]["v4"].length; i++)
 	{
 		console.log("Ip_address: ", data.droplet["networks"]["v4"][i]["ip_address"]);
 	}
 }
});*/

// #############################################
// #5 In the command line, ping your server, make sure it is alive!
// ping 162.243.80.169

// #############################################
// #6 Extend the client to DESTROY the specified droplet.
// Comment out when done.
// https://developers.digitalocean.com/#delete-a-droplet
// HINT, use the DELETE verb.
// HINT #2, needle.delete(url, data, options, callback), data needs passed as null.
// No response body will be sent back, but the response code will indicate success.
// Specifically, the response code will be a 204, which means that the action was successful with no returned body data.
// var dropletId = "6880659";
// client.deleteDroplet(dropletId, function(err, resp)
// {
//  	if(!err && resp.statusCode == 204)
//  	{
// 			console.log("Deleted!");
//  	}
// });
// #############################################
// #7 In the command line, ping your server, make sure it is dead!
// ping 162.243.80.169
// It could be possible that digitalocean reallocated your IP address to another server, so don't fret it is still pinging.
