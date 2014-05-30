/*******************************************************************************
* Copyright (c) 2014 itemis AG (http://www.itemis.de).
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*******************************************************************************/

function initApp() {
	// initialize proxy for SimpleUI interface
	var proxy = new RobotArmUIProxy();
	proxy.connect('ws://localhost:8081');
	proxy.setX(1);
	proxy.shutdown();
}
