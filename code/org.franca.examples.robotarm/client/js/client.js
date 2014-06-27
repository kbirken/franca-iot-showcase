/*******************************************************************************
 * Copyright (c) 2014 itemis AG (http://www.itemis.de). All rights reserved.
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 ******************************************************************************/

function initApp() {
	// initialize proxy for SimpleUI interface
	var proxy = new RobotArmUIProxy();
	proxy.connect('ws://localhost:9000');

	var proxyCube = new RobotArmCubeProxy();
	proxyCube.connect('ws://localhost:9001');

	// initialization
	var aa = 45;
	var rot = 0;
	var grab = 10;

	proxyCube.onOpened = function() {
		proxyCube.subscribeLeftCubeCountChanged();
		proxyCube.subscribeRightCubeCountChanged();
		proxyCube.getLeftCubeCount();
		proxyCube.getRightCubeCount();
	};

	proxyCube.onGetLeftCubeCount = function(cid, leftCubeCount) {
		if (leftCubeCount == 0) {
			$("#moveCubeRight").button("disable");
		} else {
			$("#moveCubeRight").button("enable");
		}
		$("#leftCubeCountLabel").text(leftCubeCount);
	};

	proxyCube.onChangedLeftCubeCount = function(leftCubeCount) {
		if (leftCubeCount == 0) {
			$("#moveCubeRight").button("disable");
		} else {
			$("#moveCubeRight").button("enable");
		}
		$("#leftCubeCountLabel").text(leftCubeCount);
	};

	proxyCube.onGetRightCubeCount = function(cid, rightCubeCount) {
		if (rightCubeCount == 0) {
			$("#moveCubeLeft").button("disable");
		} else {
			$("#moveCubeLeft").button("enable");
		}
		$("#rightCubeCountLabel").text(rightCubeCount);
	};

	proxyCube.onChangedRightCubeCount = function(rightCubeCount) {
		if (rightCubeCount == 0) {
			$("#moveCubeLeft").button("disable");
		} else {
			$("#moveCubeLeft").button("enable");
		}
		$("#rightCubeCountLabel").text(rightCubeCount);
	};

	proxyCube.replyMoveLeft = function(cid, ok) {
		// your code goes here
	};

	proxyCube.replyMoveRight = function(cid, ok) {
		// your code goes here
	};

	$(document).on("pageinit", "#pHome", function() {
		// callbacks
		$("#moveButton").click(function() {
			proxy.setX($("#forwardBackwardValue").val());
			proxy.setY($("#leftRightValue").val());
			proxy.setZ($("#upDownValue").val());
			proxy.move("200");
		});

		$("#safeButton").click(function() {
			proxy.reset();
		});

		$("#aaPlusButton").click(function() {
			aa += 2;
			proxy.setAa(aa);
			proxy.move("200");
		});

		$("#aaMinusButton").click(function() {
			aa -= 2;
			proxy.setAa(aa);
			proxy.move("200");
		});

		$("#rotatePlusButton").click(function() {
			rot += 5;
			proxy.setRot(rot);
			proxy.move("200");
		});

		$("#rotateMinusButton").click(function() {
			rot -= 5;
			proxy.setRot(rot);
			proxy.move("200");
		});

		$("#grabPlusButton").click(function() {
			grab += 2;
			proxy.grab(grab);
		});

		$("#grabMinusButton").click(function() {
			grab -= 2;
			proxy.grab(grab);
		});
	});

	$(document).on("pageinit", "#pCube", function() {
		$("#moveCubeRight").click(function() {
			proxyCube.moveRight();
		});

		$("#moveCubeLeft").click(function() {
			proxyCube.moveLeft();
		});
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
