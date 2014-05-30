package org.franca.examples.mqtt.control;

import java.util.LinkedList;
import java.util.List;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;

public class ControlDispatcher extends Thread implements MqttCallback {

	private volatile boolean interrupted;
	private List<ControlMessage> messages;

	public ControlDispatcher() {
		this.interrupted = false;
		this.messages = new LinkedList<ControlMessage>();
		this.setName("Dispatcher Thread");
	}

	public void stopDispatcher() {
		this.interrupted = true;
	}

	@Override
	public void run() {
		while (!interrupted) {
			ControlMessage message = getNextMessage();
			if (message != null) {
				System.out.println(message);
			}
		}
	}

	@Override
	public void connectionLost(Throwable cause) {
	}

	@Override
	public void messageArrived(String topic, MqttMessage message) throws Exception {
		synchronized (messages) {
			messages.add(new ControlMessage(topic, new String(message.getPayload())));
			messages.notifyAll();
		}
	}

	public ControlMessage getNextMessage() {
		synchronized (messages) {
			if (messages.size() == 0) {
				try {
					messages.wait(1000);
				}
				catch (InterruptedException e) {
					// ignore
				}
			}

			if (messages.size() == 0) {
				return null;
			}
			return messages.remove(0);
		}
	}

	@Override
	public void deliveryComplete(IMqttDeliveryToken token) {
	}

	private static class ControlMessage {

		public String topic;
		public String payload;

		public ControlMessage(String topic, String payload) {
			super();
			this.topic = topic;
			this.payload = payload;
		}

		@Override
		public String toString() {
			return payload + " (" + topic + ")";
		}
	}
}
