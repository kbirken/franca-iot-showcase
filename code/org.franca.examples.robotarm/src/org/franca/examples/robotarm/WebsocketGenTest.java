/*******************************************************************************
 * Copyright (c) 2013 itemis AG (http://www.itemis.de).
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package org.franca.examples.robotarm;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.eclipse.emf.common.util.URI;
import org.eclipse.xtext.junit4.InjectWith;
import org.eclipse.xtext.junit4.XtextRunner;
import org.franca.core.dsl.FrancaIDLInjectorProvider;
import org.franca.core.dsl.FrancaPersistenceManager;
import org.franca.core.franca.FModel;
import org.franca.generators.FrancaGenerators;
import org.junit.Test;
import org.junit.runner.RunWith;

import com.google.inject.Inject;

@RunWith(XtextRunner.class)
@InjectWith(FrancaIDLInjectorProvider.class)
public class WebsocketGenTest {

	private final static String SERVER_GEN_DIR = "server/gen";
	private final static String CLIENT_GEN_DIR = "client/gen";

	@Inject
	private FrancaPersistenceManager loader;
	
	@Test
	public void test01() {
		genAndSave("org/franca/examples/robotarm/RobotArmUI.fidl");
		genAndSave("org/franca/examples/robotarm/RobotArmCube.fidl");
	}

	private void genAndSave (String filename) {
    	URI root = URI.createURI("classpath:/");
    	URI loc = URI.createFileURI(filename);
    	FModel fmodel = loader.loadModel(loc, root);
		assertNotNull(fmodel);
		assertTrue(FrancaGenerators.instance().genWebsocket(fmodel,
				SERVER_GEN_DIR, CLIENT_GEN_DIR));
	}

}
