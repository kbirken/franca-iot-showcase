/*******************************************************************************
 * Copyright (c) 2014 itemis AG (http://www.itemis.de). All rights reserved.
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 ******************************************************************************/

// create http server and listen to port 8080
// we need this to serve index.html and other files to the client
var HttpServer = require('./base/util/HttpServer');
var http = new HttpServer();
http.init(8081, '../client');

var MQTTClient = require('./base/mqtt/MQTTClient')
var mqttClient = new MQTTClient();
mqttClient.connect('localhost', 1883)

// create websocket stub for SimpleUI interface and listen to websocket port.
var RobotArmUIStub = require('./gen/org/franca/examples/robotarm/RobotArmUIStub');
var stub = new RobotArmUIStub(9000);

var RobotArmCubeStub = require('./gen/org/franca/examples/robotarm/RobotArmCubeStub');
var cubeStub = new RobotArmCubeStub(9001);

stub.init();
cubeStub.init();

// initial configuration
cubeStub.setLeftCubeCount(4);
cubeStub.setRightCubeCount(0);

stub.onClientConnected = function(clientID) {
	console.log('UIStub The ID of the newly connected client is ' + clientID);
};

stub.onClientDisconnected = function(clientID) {
	console.log('UIStub The client with ID ' + clientID + ' has disconnected');
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
};

stub.grab = function(openMM) {
	mqttClient.publish('control/grab', openMM.toString());
};

stub.reset = function() {
	mqttClient.publish('control/reset', '0');
};

cubeStub.onClientConnected = function(clientID) {
	console.log('CubeStub The ID of the newly connected client is ' + clientID);
};

cubeStub.onClientDisconnected = function(clientID) {
	console
			.log('CubeStub The client with ID ' + clientID
					+ ' has disconnected');
}

cubeStub.moveLeft = function() {
	if (cubeStub.rightCubeCount > 0) {
		fetch(right, cubeStub.rightCubeCount, true);
		cubeStub.setRightCubeCount(cubeStub.rightCubeCount - 1);
		fetch(left, cubeStub.leftCubeCount + 1, false);
		cubeStub.setLeftCubeCount(cubeStub.leftCubeCount + 1);
		move(middle[0], middle[1], middle[2], middle[4], middle[3], 1000);
	}
};

cubeStub.moveRight = function() {
	if (cubeStub.leftCubeCount > 0) {
		fetch(left, cubeStub.leftCubeCount, true);
		cubeStub.setLeftCubeCount(cubeStub.leftCubeCount - 1);
		fetch(right, cubeStub.rightCubeCount + 1, false);
		cubeStub.setRightCubeCount(cubeStub.rightCubeCount + 1);
		move(middle[0], middle[1], middle[2], middle[4], middle[3], 1000);
	}
};

var left = new Array(132, 94, 10, -28, 90, 3);
var middle = new Array(180, 0, 140, 0, 45);
var right = new Array(137, -88, 8, 28, 90, 2);
var zHigh = 50;
var grabOpen = 28;
var grabClosed = 16;
var dCube = 23;

function move(x, y, z, aa, rot, time) {
	mqttClient.publish('control/x', x.toString());
	mqttClient.publish('control/y', y.toString());
	mqttClient.publish('control/z', z.toString());
	mqttClient.publish('control/aa', aa.toString());
	mqttClient.publish('control/rot', rot.toString());
	mqttClient.publish('control/move', time.toString());
}

function fetch(pos, h, fetch) {
	var x = pos[0] + (h - 1) * pos[5];
	var z = pos[2] + (h - 1) * dCube;
	if (!fetch) {
		z = z + 3;
	}

	move(x, pos[1], z + zHigh, pos[4], pos[3], 1000);
	// robot.delay(1000);

	if (fetch) {
		mqttClient.publish('control/grab', grabOpen.toString());
	}

	move(x, pos[1], z, pos[4], pos[3], 500);
	// robot.delay(1000);

	if (fetch) {
		mqttClient.publish('control/grab', grabClosed.toString());
	} else {
		mqttClient.publish('control/grab', grabOpen.toString());
	}
	// robot.delay(500);

	move(x, pos[1], z + zHigh, pos[4], pos[3], 1000);
	// robot.delay(2000);
}
