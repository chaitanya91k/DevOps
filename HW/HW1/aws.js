var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws_config.json');

var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-d05e75b8', // Ubuntu 
  InstanceType: 't2.micro',
  KeyName: 'karishma_key',
  MinCount: 1, MaxCount: 1
};

var publicIpAddress;
// Create the instance
ec2.runInstances(params, function(err, data) {
	if (err) { 
		console.log("EC2 Instance not created", err); return; 
	}

  	var instance = data.Instances[0];
  	console.log("Created Instance: ", instance);
  	var instanceId = data.Instances[0].InstanceId;
  	console.log("Instance Id: ", instanceId);
  	// var instanceIp = data.Instances[0].PrivateIpAddress;
  	// console.log("Instance Ip: ", instanceIp);

  	var params1 = {
		InstanceIds: [instanceId]	
	  // ... input parameters ...
    };
  	ec2.waitFor('instanceRunning', params1, function(err, data) 
  	{
  		if (err) 
  		{
  			console.log(err, err.stack); // an error occurred
  		}
  		else
  		{
  			console.log(data);
  			publicIpAddress=data.Reservations[0].Instances[0].PublicIpAddress;
  			console.log("Public Ip Address: ", publicIpAddress);         // successful response

  			var fs = require('fs');
 			  var ssh_user="ubuntu";
 			  var ssh_path="/home/karishma/.ssh/id_rsa";
 			  awsInventory='awsNode ansible_ssh_host=' + publicIpAddress + 
 			        			 ' ansible_connection=ssh ansible_ssh_user=' + ssh_user + 
 						         ' ansible_ssh_private_key_file=' + ssh_path;
			 fs.appendFile('inventory', awsInventory, function(err) 
			 {
    	 		if(err) 
   		 		{
       			return console.log(err);
   				}
				console.log("Added inventory entry for AWS");
			 });
  		}   
  	});
});