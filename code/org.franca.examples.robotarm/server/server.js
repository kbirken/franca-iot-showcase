/*******************************************************************************
* Copyright (c) 2014 itemis AG (http://www.itemis.de).
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*******************************************************************************/

// create http server and listen to port 8080
// we need this to serve index.html and other files to the client
var HttpServer = require('./base/util/HttpServer');
var http = new HttpServer();
http.init(8080, '../client');

var MQTTClient = require('./base/mqtt/MQTTClient')
var mqttClient = new MQTTClient();
mqttClient.connect('localhost', 1883)

// create websocket stub for SimpleUI interface and listen to websocket port.
var RobotArmUIStub = require('./gen/org/franca/examples/robotarm/RobotArmUIStub');
var stub = new RobotArmUIStub(8081);

stub.init();

stub.onClientConnected = function(clientID) {
	console.log('The ID of the newly connected client is ' + clientID);
};

stub.onClientDisconnected = function(clientID) {
	console.log('The client with ID ' + clientID + ' has disconnected');
}

stub.onSetX = function(x) {
	mqttClient.publish('control/x', x.toString());
};

stub.onSetY = function(y) {
	mqttClient.publish('control/y', y.toString());
};

stub.onSetZ = function(z) {
	mqttClient.publish('control/z', z.toString());
};

stub.onSetAa = function(aa) {
	mqttClient.publish('control/aa', aa.toString());
};

stub.onSetRot = function(rot) {
	mqttClient.publish('control/rot', rot.toString());
};

stub.move = function(time) {
	mqttClient.publish('control/move', time.toString());
}

stub.grab = function(openMM) {
	mqttClient.publish('control/grab', openMM.toString());
}

stub.shutdown = function() {
	mqttClient.publish('control/shutdown', '0');
}