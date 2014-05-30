package org.franca.examples.mqtt.control;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;

public class MessageListener implements MqttCallback {

	private Map<String, List<MqttMessage>> messageMap;

	public MessageListener() {
		messageMap = new HashMap<String, List<MqttMessage>>();
	}

	public MqttMessage getNextMessage(String topic) {
		synchronized (messageMap) {
			if (messageMap.size() == 0) {
				try {
					messageMap.wait(1000);
				}
				catch (InterruptedException e) {
					// ignore
				}
			}

			if (messageMap.get(topic) == null || messageMap.get(topic).size() == 0) {
				return null;
			}
			return messageMap.get(topic).remove(0);
		}
	}

	@Override
	public void connectionLost(Throwable cause) {
	}

	@Override
	public void deliveryComplete(IMqttDeliveryToken token) {
	}

	public void messageArrived(String topic, MqttMessage message) throws Exception {
		System.out.println("Message arrived " + message);
		synchronized (messageMap) {
			if (messageMap.get(topic) == null) {
				messageMap.put(topic, new LinkedList<MqttMessage>());
			}
			messageMap.get(topic).add(message);
			messageMap.notifyAll();
		}
	}
}