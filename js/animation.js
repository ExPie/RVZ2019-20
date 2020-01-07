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
					"delay": 1000
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
					"delay": 1000
				}
			]
		}
	]
}


// circles storage
var g_circles = [];

// hit anim storage
var g_hitAnim = []; // (lane, timeStart, color)

// anim controls
var a_startTime;
var a_currentTime;
var a_pause = true;
var a_cantFail = false;


function mainDraw(animCurrentTime, animDeltaTime) {
	// do the drawing
	// clear screen
	ctx.clearRect(0, 0, cWidth, cHeight);

	// update global
	a_currentTime = animCurrentTime;
	ctx.fillStyle = "black";

	// draw lanes
	drawGridLanes();

	// draw circles
	if(!a_startTime && animCurrentTime) {
		a_startTime = animCurrentTime;
	}

	drawCircles(a_currentTime);

	// draw hit animations
	drawHitAnim();
	
}

// change demo data with actual data
function parseData(midi) {

	var customNote = [];

	for(var i = 0; i < midi.tracks[0].notes.length; i++) {
		var note = midi.tracks[0].notes[i];
		console.log(note);
		var jsonNote = {};
		jsonNote.startTime = note.time * 1000 + 3000;
		jsonNote.lane = i % 5;

		var jsonNote2 = {};
		jsonNote2.pitch = note.midi;
		jsonNote2.duration = note.duration = note.duration * 1000;
		jsonNote2.delay = 0;
		
		jsonNote.notes = [jsonNote2];

		customNote.push(jsonNote);
	}

	test_json.circles = customNote;
	console.log(test_json);

	g_circles = [];
	for(var i = 0; i < test_json.circles.length; i++)
		g_circles.push(test_json.circles[i]);

	startBasicAnimation();
}

function parseDataEasy(midi) {

	var lowestPitch = 128;
	var highestPitch = -1;
	var avgPitch = 0;
	var deltaPitch;

	for(var i = 0; i < midi.tracks[0].notes.length; i++) {
		var note = midi.tracks[0].notes[i];
		var pitch = note.midi;

		if(pitch < lowestPitch) lowestPitch = pitch;
		if(pitch > highestPitch) highestPitch = pitch;
		avgPitch += pitch;
	}
	avgPitch = Math.round(avgPitch / midi.tracks[0].notes.length);
	deltaPitch = (highestPitch - lowestPitch) / 5;

	var customNote = [];
	var jsonCircle = undefined;

	for(var i = 0; i < midi.tracks[0].notes.length; i++) {
		var note = midi.tracks[0].notes[i];

		if(!jsonCircle) {
			jsonCircle = {};
			jsonCircle.startTime = note.time * 1000 + 3000;
			//jsonCircle.lane = i % 5; //defer
			jsonCircle.notes = [];
		}

		var jsonNote2 = {};
		jsonNote2.pitch = note.midi;
		jsonNote2.duration = note.duration = note.duration * 1000;
		if(jsonCircle.notes.length == 0) {
			jsonNote2.delay = 0;
		} else {
			var firstNoteTime = jsonCircle.startTime;
			jsonNote2.delay = note.time * 1000 + 3000 - firstNoteTime;
		}
		jsonCircle.notes.push(jsonNote2);

		if(jsonCircle.notes.length == 3 || i == midi.tracks[0].notes.length - 1) {
			var avgNotes = calculateAvgPitch(jsonCircle.notes);

			if(avgNotes < avgPitch - 2 * deltaPitch) {
				jsonCircle.lane = 0;
			} else if(avgNotes < avgPitch - 1 * deltaPitch) {
				jsonCircle.lane = 1;
			} else if(avgNotes < avgPitch) {
				jsonCircle.lane = 2;
			} else if(avgNotes < avgPitch + 1 * deltaPitch) {
				jsonCircle.lane = 3;
			} else {
				jsonCircle.lane = 4;
			}

			customNote.push(jsonCircle);
			jsonCircle = undefined;
		}
	}

	test_json.circles = customNote;
	console.log(test_json);

	g_circles = [];
	for(var i = 0; i < test_json.circles.length; i++)
		g_circles.push(test_json.circles[i]);

	startBasicAnimation();
}


function calculateAvgPitch(notes) {
	var sum = 0;
	for(var i = 0; i < notes.length; i++)
		sum += notes[i].pitch;
	return Math.round(sum / notes.length);
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
			if(pixelsFromBar > -50 && pixelsFromBar < 50) ctx.strokeStyle = "blue"; 
			ctx.beginPath();
			var xposition = Math.round((circle.lane * 2 + 1) * cWidth / 10);
			var yposition = Math.round(4 * cHeight / 5 + pixelsFromBar);
			ctx.arc(xposition, yposition, 50, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.save();
		}

		if(pixelsFromBar > 100) {
			startFailAnim();
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

function drawHitAnim() {
	var indRemove = [];
	var len = 150;

	for(var i = 0; i < g_hitAnim.length; i++) {
		var ln = g_hitAnim[i][0];
		var start = g_hitAnim[i][1];
		var col = g_hitAnim[i][2];
		var delta = a_currentTime - start;

		if(delta >= len) { 
			indRemove.unshift(i);
			continue;
		}

		var grd = ctx.createLinearGradient(0, 4 * cHeight / 5 + delta * 2, 0, 3 * cHeight / 5);
		grd.addColorStop(0, col);
		grd.addColorStop(1, "white");

		// Fill with gradient
		ctx.fillStyle = grd;
		ctx.fillRect(ln * cWidth / 5, 3 * cHeight / 5, cWidth / 5, cHeight / 5);
		ctx.fillStyle = "black";
	}

	for(var i = 0; i < indRemove.length; i++) {
		g_hitAnim.splice(indRemove[i], 1);
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

	if(!a_pause)
		checkHits(lane);
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
			// add to hit anim array
			g_hitAnim.push([circle.lane, a_currentTime, "blue"]);

			// play the notes
			notePlayer(circle.notes);

			// remove form array
			g_circles.splice(i, 1);

			if(g_circles.length == 0)
				victory();
		}
	}

	if(!hitCircle && !a_cantFail) {
		// fail game
		startFailAnim();
	}
}

async function startFailAnim() {
	g_circles = [];

	playFailSound();

	for(var i = 0; i < 5; i++)
		g_hitAnim.push([i, a_currentTime, "red"]);

	await sleep(2000);

	// reset game
	a_pause = true;

	a_startTime = undefined;
	a_currentTime = undefined;

	animStartTime = undefined;
	animLastTime = undefined;
	animTotalTime = undefined;
	animDeltaTime = undefined; 

	drawFailScreen();
}

async function victory() {

	a_cantFail = true;

	await sleep(3000);

	g_circles = [];
	var nts = ['F', 'G', 'A', 'B', 'C'];
	var oct = [3, 3, 3, 3, 4]

	for(var i = 0; i < 5; i++) {
		g_hitAnim.push([i, a_currentTime, "green"]);
		fnPlayNote(nts[i], oct[i], 1);
		await sleep(100 + i * 80);
	}

	await sleep(1000);

	// reset game
	a_pause = true;

	a_startTime = undefined;
	a_currentTime = undefined;

	animStartTime = undefined;
	animLastTime = undefined;
	animTotalTime = undefined;
	animDeltaTime = undefined; 

	drawVictoryScreen();
}

async function notePlayer(notes) {
	for(var i = 0; i < notes.length; i++) {
		var note = notes[i];

		var name = g_midiNumArr[note.pitch];
		var time = note.duration / test_json.speed;
		if(time < 1) time = 1; // sounds better?
		var delay = 0;
		if(i < notes.length - 1) delay = notes[i+1].delay - note.delay;
		delay = delay / test_json.speed * 1000;

		fnPlayNote(name[0], name[1], time);
		await sleep(delay);
	}
}

async function playFailSound() {
	fnPlayNote('G', 4, 1);
	fnPlayNote('G', 3, 1);
	await sleep(200);	
	fnPlayNote('G', 4, 1);
	fnPlayNote('G', 3, 1);
	await sleep(200);
	fnPlayNote('G', 4, 1);
	fnPlayNote('G', 3, 1);
	await sleep(200);


	fnPlayNote('D#', 4, 4);
	fnPlayNote('D#', 3, 4);
}
