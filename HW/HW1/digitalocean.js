var needle = require("needle");
var os   = require("os");
var fs = require("fs");
var input = fs.readFileSync('./digitalocean_config.json');

var token;
var ssh_key;

try {
    digitalOcean = JSON.parse(input);
    token = digitalOcean.token;
    ssh_key = digitalOcean.ssh_key;
}
catch (err) {
    console.log('Error parsing digitalocean_config.json');
    console.log(err);
}

var config = {};
config.token = token

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
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},
	
	// listImages: function( onResponse )
	// {
	// 	console.log("Attempting to list images");
	// 	needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
	// },

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[ssh_key],
			//"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

	getDroplet: function (dropletId, onResponse)
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse);
	}
	
};

var region;
var image;
var dropletId;
var dropletIpAddress;

client.listRegions(function(error, response)
{
	console.log("\nListing regions");
	var data = response.body;

	if( data.regions )
	{
		region=data.regions[0]["slug"];
		console.log("Region selected: ", region);
	}

	/* client.listImages(function(error, response)
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
		}*/

		/*
		* Commented code is to dynamically select image
		* However, some images such as coreos and ubuntu15 are not compatible with ansible
		* Issues in doing ssh to such images and issues in locating python
		* Hence, statically chose ubuntu14-64bit
		*/
		image="ubuntu-14-04-x64";
		console.log("\nImage selected: ", image);

		var name = "knimgao-droplet";
		client.createDroplet(name, region, image, function(error, response, body)
		{
			var isCreated=false;
			console.log("\nCreating Droplet");
			// StatusCode 202 - Means server accepted request.
			if(!error && response.statusCode == 202)
			{
				// console.log( JSON.stringify( body, null, 3 ) );
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
						console.log("\nGetting Droplet Details");
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

 							var ssh_user="root";
 							var ssh_path="/home/karishma/.ssh/id_rsa";
 							if(image.indexOf("coreos") >-1)
 							{
 								console.log("\nImage is Coreos");
 								ssh_user="core";
 							}
 							fs.writeFile('inventory', '[instances]\n', function(err) 
							{
    							if(err) 
    							{
        							return console.log(err);
    							}

    							console.log("\nCreated Inventory File");
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

    // });	

});