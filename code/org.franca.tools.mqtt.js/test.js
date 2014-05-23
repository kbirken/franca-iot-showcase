/*******************************************************************************
 * Copyright (c) 2014 itemis AG (http://www.itemis.de). All rights reserved.
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 ******************************************************************************/

var mqtt = require('mqtt');
var topicId = "topic1";
var serverURI = "localhost";
var port = 1883;

function MQTTClient() {
    this.client = null;
}

// export the "constructor" function to provide a class-like interface
module.exports = MQTTClient;

MQTTClient.prototype.connect = function(port, host) {
    var _this = this;

    _this.client = mqtt.createClient(port, host);

    _this.client.subscribe(topicId);
    // _this.client.subscribe('$SYS/broker/bytes/received');

    _this.client.publish(topicId, 'message', {
	retain : true
    });

    _this.client.on('message', function(topic, message) {
	console.log("topic = " + topic + " message = " + message);
    });
};

MQTTClient.prototype.disconnect = function() {
    this.client.end();
};

// var MQTTClient = require('./applications/MQTTClient');

var client = new MQTTClient();
client.connect(1883, 'localhost');

setTimeout(function() {
    client.disconnect();
}, 10000);
