// globals
var g_keys = ["a", "s", "d", "f", "g"];

// test circle
var ypos = 0;


function mainDraw(animCurrentTime, animDeltaTime) {
	// do the drawing
	// clear screen
	ctx.clearRect(0, 0, cWidth, cHeight);

	// draw lanes
	drawGridLanes();

	//calculate next x
	var d = animDeltaTime / 4.6785;
	if(d) ypos += d;
	if (ypos > cHeight) ypos = 0;

	ypos = Math.round(ypos);

	//console.log(animDeltaTime);
	//console.log(d);

	ctx.beginPath();
	ctx.arc(5 * cWidth / 10, ypos, 50, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.save();
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
		ctx.fillText(g_keys[i], (i * 2 + 1) * cWidth / 10, 9 * cHeight / 10); 
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
