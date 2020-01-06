// globals
var g_keys = ["a", "s", "d", "f", "g"];
var circleSpeed = 1/4;

var test_json = {
	"speed": 1000,
	"circles": [
		{
			"startTime": 3000,
			"lane": 1,
			"notes": [
				{
					"pitch": 65,
					"duration": 400,
					"delay": 0
				},
				{
					"pitch": 67,
					"duration": 400,
					"delay": 200
				}
			]
		},
		{
			"startTime": 5000,
			"lane": 3,
			"notes": [
				{
					"pitch": 69,
					"duration": 400,
					"delay": 0
				},
				{
					"pitch": 65,
					"duration": 600,
					"delay": 200
				}
			]
		}
	]
}


// circles storage
var g_circles = [];

// anim controls
var a_startTime;
var a_currentCircleSearchIndex;
var a_currentTime;


function mainDraw(animCurrentTime, animDeltaTime) {
	// do the drawing
	// clear screen
	ctx.clearRect(0, 0, cWidth, cHeight);

	// update global
	a_currentTime = animCurrentTime;

	// draw lanes
	drawGridLanes();

	// draw circles
	if(!a_startTime && animCurrentTime) {
		a_startTime = animCurrentTime;
		g_circles.push(test_json.circles[0]);
		g_circles.push(test_json.circles[1]);
	}
	drawCircles(animCurrentTime);

	
}

// draws the circles from circle storage
function drawCircles(animCurrentTime) {
	var currentTime = animCurrentTime - a_startTime;
	var currentTimeNorm = currentTime * test_json.speed / 1000;

	for(var i = 0; i < g_circles.length; i++) {
		var circle = g_circles[i];

		var circleHitTime = circle.startTime;
		var deltaHit = currentTimeNorm - circleHitTime;
		var deltaHitMs = deltaHit / test_json.speed * 1000;
		var pixelsFromBar = deltaHitMs * circleSpeed;


		if(pixelsFromBar > -1000) {
			ctx.strokeStyle = "black";
			if(pixelsFromBar > -50 && pixelsFromBar < 50) ctx.strokeStyle = "blue"; // check for hits here
			ctx.beginPath();
			var xposition = Math.round((circle.lane * 2 + 1) * cWidth / 10);
			var yposition = Math.round(4 * cHeight / 5 + pixelsFromBar);
			console.log(yposition);
			ctx.arc(xposition, yposition, 50, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.save();
		}

		if(deltaHit > 200) {
			// fail game
		}
	}
}

// draw lanes for falling notes
function drawGridLanes() {
	// draw hit bar
	ctx.lineWidth = 3;
	ctx.strokeStyle = "red";
	ctx.beginPath();
	ctx.moveTo(0, 4 * cHeight / 5);
	ctx.lineTo(cWidth, 4 * cHeight / 5);
	ctx.stroke();

	// draw key indicators
	for (var i = 0; i < 5; i++) {
		ctx.textAlign = "center";
		ctx.font = "48px sans-serif";
		ctx.fillText(g_keys[i].toUpperCase(), (i * 2 + 1) * cWidth / 10, 9 * cHeight / 10); 
	}

	// draw vertical lines
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	for (var i = 1; i < 5; i++) {
		ctx.beginPath();
		ctx.moveTo(i * cWidth / 5, 0);
		ctx.lineTo(i * cWidth / 5, cHeight);
		ctx.stroke();
	}
}

function checkHits(lane) {
	var currentTime = a_currentTime - a_startTime;
	var currentTimeNorm = currentTime * test_json.speed / 1000;

	var hitCircle = false;

	for(var i = 0; i < g_circles.length; i++) {
		var circle = g_circles[i];

		if(circle.lane != lane) continue;

		var circleHitTime = circle.startTime;
		var deltaHit = currentTimeNorm - circleHitTime;
		var deltaHitMs = deltaHit / test_json.speed * 1000;
		var pixelsFromBar = deltaHitMs * circleSpeed;


		if(pixelsFromBar > -50 && pixelsFromBar < 50) {
			hitCircle = true;
			// play anim
			alert("hit");
			// remove form array
		}
	}

	if(!hitCircle) {
		// fail game
		alert("FAILED");
	}
}



// key listner
function listenKeys(e) {
	var lane = -1;

	switch(e.keyCode) {
		case 65: lane = 0; break;
		case 83: lane = 1; break;
		case 68: lane = 2; break;
		case 70: lane = 3; break;
		case 71: lane = 4; break;
		default: return;
	}

	checkHits(lane);
}

