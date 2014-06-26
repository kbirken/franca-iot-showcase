package org.franca.examples.mqtt.control;

import java.util.LinkedList;
import java.util.List;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.franca.examples.mqtt.control.common.IRobotArmPosControl;

public class ControlDispatcher extends Thread implements MqttCallback {

	private volatile boolean interrupted;
	private List<ControlMessage> messages;
	private IRobotArmPosControl robotArmControl;
	private RobotPosition currentPosition;

	public ControlDispatcher(IRobotArmPosControl robotArmControl) {
		this.interrupted = false;
		this.messages = new LinkedList<ControlMessage>();
		this.currentPosition = new RobotPosition();
		this.setName("Dispatcher Thread");
		this.robotArmControl = robotArmControl;
	}

	public void stopDispatcher() {
		this.interrupted = true;
	}

	@Override
	public void run() {
		move(currentPosition);

		while (!interrupted) {
			ControlMessage message = getNextMessage();
			if (message != null) {
				int payload = Integer.MAX_VALUE;
				try {
					payload = Integer.parseInt(message.payload);
				}
				catch (NumberFormatException e) {
					// ignore
				}

				if (payload != Integer.MAX_VALUE) {
					if (message.topic.equals("control/shutdown")) {
						this.robotArmControl.shutdown();
					}
					else if (message.topic.equals("control/move")) {
						move(currentPosition, payload);
					}
					else if (message.topic.equals("control/x")) {
						this.currentPosition.x = payload;
					}
					else if (message.topic.equals("control/y")) {
						this.currentPosition.y = payload;
					}
					else if (message.topic.equals("control/z")) {
						this.currentPosition.z = payload;
					}
					else if (message.topic.equals("control/aa")) {
						this.currentPosition.aa = payload;
						move(currentPosition);
					}
					else if (message.topic.equals("control/rot")) {
						this.currentPosition.rot = payload;
						move(currentPosition);
					}
					else if (message.topic.equals("control/grab")) {
						this.robotArmControl.grab(payload);
					}
				}
			}
		}

		robotArmControl.shutdown();
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

	private void move(RobotPosition position) {
		this.move(position, 200);
	}

	private void move(RobotPosition position, int t) {
		this.robotArmControl.move(position.x, position.y, position.z, position.aa, position.rot, t);
	}

	private static class RobotPosition {
		public double x;
		public double y;
		public double z;
		public int aa;
		public int rot;

		public RobotPosition() {
			this.x = 200;
			this.y = 0;
			this.z = 180;
			this.aa = 45;
			this.rot = 0;
		}
	}
}
