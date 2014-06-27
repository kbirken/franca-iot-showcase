package org.franca.examples.mqtt.control;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.franca.examples.mqtt.control.common.DirectControlDispatcher;
import org.franca.examples.mqtt.control.common.IRobotArmDirectControl;
import org.franca.examples.mqtt.control.common.IRobotArmPosControl;
import org.franca.examples.mqtt.control.common.InverseKinematicsControl;
import org.franca.examples.mqtt.control.serial.RobotArmPhysical;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

public class Activator implements BundleActivator {

	private static BundleContext context;
	private IMqttClient client;
	private ControlDispatcher messageDispatcher;
	private IRobotArmDirectControl robotArmDirectControl;
	private IRobotArmPosControl robotArmControl;
	private DirectControlDispatcher directControlDispatcher;

	static BundleContext getContext() {
		return context;
	}

	public void start(BundleContext bundleContext) throws Exception {
		Activator.context = bundleContext;
		this.robotArmDirectControl = RobotArmPhysical.createInstance("/dev/tty.usbserial-FTF7AJ8S", true);
		this.directControlDispatcher = new DirectControlDispatcher();
		this.directControlDispatcher.addClient(robotArmDirectControl);
		this.robotArmControl = new InverseKinematicsControl(directControlDispatcher, true);

		try {
			String clientId = "client1";
			// String serverURI = "tcp://vm-testit.itemis.de:1883";
			String serverURI = "tcp://localhost:1883";
			client = new MqttClient(serverURI, clientId);
			
			messageDispatcher = new ControlDispatcher(this.robotArmControl);

			client.connect();
			client.subscribe("control/x");
			client.subscribe("control/y");
			client.subscribe("control/z");
			client.subscribe("control/aa");
			client.subscribe("control/rot");
			client.subscribe("control/move");
			client.subscribe("control/grab");
 			client.subscribe("control/reset");
 			
			messageDispatcher.start();
			client.setCallback(messageDispatcher);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void stop(BundleContext bundleContext) throws Exception {
		Activator.context = null;
		this.robotArmDirectControl = null;

		if (messageDispatcher != null) {
			messageDispatcher.stopDispatcher();
		}

		if (client != null) {
			try {
				client.disconnect();
				client.close();
			}
			catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
