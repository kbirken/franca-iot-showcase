package org.franca.tools.mqtt.java;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttTopic;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

public class Activator implements BundleActivator {

	private static BundleContext context;

	static BundleContext getContext() {
		return context;
	}

	public void start(BundleContext bundleContext) throws Exception {
		Activator.context = bundleContext;

		IMqttClient client = null;
		try {
			String topicId = "topic1";
			String clientId = "client1";
			String serverURI = "tcp://localhost:1883";
			client = new MqttClient(serverURI, clientId);

			MessageListener listener = new MessageListener();
			client.setCallback(listener);
			client.connect();
			client.subscribe(topicId);

			MqttTopic topic = client.getTopic(topicId);
			for (int i = 0; i < 10; i++) {
				MqttMessage message = new MqttMessage(("message" + i).getBytes());
				topic.publish(message);
			}

			for (int i = 0; i < 10; i++) {
				MqttMessage msg = listener.getNextMessage(topicId);
				assert msg != null;
				assert msg.toString().startsWith("message");
				assert topic.getName().equals(topicId);
				System.out.println(msg);
			}

			client.disconnect();
		}
		finally {
			if (client != null) {
				client.close();
			}
		}
	}

	public void stop(BundleContext bundleContext) throws Exception {
		Activator.context = null;
	}

}
