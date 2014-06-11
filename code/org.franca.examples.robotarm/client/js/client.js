/*******************************************************************************
 * Copyright (c) 2014 itemis AG (http://www.itemis.de). All rights reserved.
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 ******************************************************************************/

function initApp() {
	// initialize proxy for SimpleUI interface
	var proxy = new RobotArmUIProxy();
	proxy.connect('ws://localhost:8081');

	// initialization
	var aa = 45;
	var rot = 0;
	var grab = 0;
	
	// callbacks	
	$("#moveButton").click(function() {
		proxy.setX($("#forwardBackwardValue").val());
		proxy.setY($("#leftRightValue").val());
		proxy.setZ($("#upDownValue").val());
		proxy.move("200");
	});
	
	$("#safeButton").click(function() {
		proxy.shutdown();
	});
	
	$("#aaPlusButton").click(function() {
		aa += 1;
		proxy.setAa(aa);
	});
	
	$("#aaMinusButton").click(function() {
		aa -= 1;
		proxy.setAa(aa);
	});
	
	$("#rotatePlusButton").click(function() {
		rot += 1;
		proxy.setRot(rot);
	});
	
	$("#rotateMinusButton").click(function() {
		rot -= 1;
		proxy.setRot(rot);
	});
	
	$("#grabPlusButton").click(function() {
		grab += 1;
		proxy.grab(grab);
	});
	
	$("#grabMinusButton").click(function() {
		grab -= 1;
		proxy.grab(grab);
	});
}

function initFixedHeaders() {
	jQuery.fn.headerOnAllPages = function() {
		var theHeader = $('#constantheader-wrapper').html();
		var allPages = $('div[pagetype="standard"]');

		for (var i = 1; i < allPages.length; i++) {
			allPages[i].innerHTML = theHeader + allPages[i].innerHTML;
		}
	};

	$(function() {
		$().headerOnAllPages();
		$("[data-role='navbar']").navbar();
		$("[data-role='header'], [data-role='footer']").toolbar();
	});

}
