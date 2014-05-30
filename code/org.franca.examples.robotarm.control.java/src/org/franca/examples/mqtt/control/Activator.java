package org.franca.examples.mqtt.control;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

public class Activator implements BundleActivator {

	private static BundleContext context;
	private IMqttClient client;
	private ControlDispatcher dispatcher;

	static BundleContext getContext() {
		return context;
	}

	public void start(BundleContext bundleContext) throws Exception {
		Activator.context = bundleContext;

		try {
			String clientId = "client1";
			// String serverURI = "tcp://vm-testit.itemis.de:1883";
			String serverURI = "tcp://localhost:1883";
			client = new MqttClient(serverURI, clientId);

			dispatcher = new ControlDispatcher();
			dispatcher.start();

			client.setCallback(dispatcher);
			client.connect();

			client.subscribe("control/x");
			client.subscribe("control/y");
			client.subscribe("control/z");
			client.subscribe("control/aa");
			client.subscribe("control/rot");
			client.subscribe("control/x");
			client.subscribe("control/move");
			client.subscribe("control/grab");
			client.subscribe("control/shutdown");

			// MqttTopic topic = client.getTopic(topicId);
			// for (int i = 0; i < 10; i++) {
			// MqttMessage message = new MqttMessage(("message" +
			// i).getBytes());
			// topic.publish(message);
			// }
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void stop(BundleContext bundleContext) throws Exception {
		Activator.context = null;

		if (dispatcher != null) {
			dispatcher.stopDispatcher();
		}

		if (client != null) {
			client.disconnect();
			client.close();
		}
	}

}
