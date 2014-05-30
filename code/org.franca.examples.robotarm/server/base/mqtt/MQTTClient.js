/*******************************************************************************
 * Copyright (c) 2014 itemis AG (http://www.itemis.de). All rights reserved.
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 ******************************************************************************/

var mqtt = require('mqtt');

function MQTTClient() {
    this.client = null;
}

// export the "constructor" function to provide a class-like interface
module.exports = MQTTClient;

MQTTClient.prototype.connect = function(host, port) {
    this.client = mqtt.createClient(port, host);
};

MQTTClient.prototype.disconnect = function() {
    this.client.end();
};

MQTTClient.prototype.publish = function(topic, message) {
	this.client.publish(topic, message, {
		retain : true
	});
};