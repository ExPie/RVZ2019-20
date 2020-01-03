// canvas globals
var canvas;
var ctx;
var cWidth;
var cHeight;

// anim control globals
var animStartTime;
var animLastTime;
var animTotalTime;
var animDeltaTime; 

// test circle
var xpos = 0;


window.onload = function () {
    main();
};

// for async funtions await sleep(ms);
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// used for playing sounds
function fnPlayNote(note, octave) {
		var src = Synth.generate('piano', note, octave, 2);
		container = new Audio(src);
		container.addEventListener('ended', function() { container = null; });
		container.addEventListener('loadeddata', function(e) { e.target.play(); });
		container.autoplay = false;
		container.setAttribute('type', 'audio/wav');
		/*document.body.appendChild(container);*/
		container.load();
		return container;
}

async function testDelay() {
	fnPlayNote('C', 4);
	await sleep(2000);
	fnPlayNote('D', 4);
}

function main() {
	canvas = document.getElementById("mainCanvas");
	ctx = canvas.getContext("2d");
	cWidth = canvas.width;
	cHeight = canvas.height;

	ctx.moveTo(0, 0);
	ctx.lineTo(cWidth, cHeight);
	ctx.stroke();

	//var piano = Synth.createInstrument('piano');
	//piano.play('C', 4, 2);




	        // configure MIDIReader
	        var source = document.getElementById('filereader');
	        MidiParser.parse( source, function(obj){
	            // Your callback function
	            console.log(obj);
	            document.getElementById("output").innerHTML = JSON.stringify(obj, undefined, 2);
	        });
	   



	drawWelcomeScreen();

	var button = document.getElementById("btn1");
	button.addEventListener('click', function() {
		startBasicAnimation();
	}, false);

}

function drawWelcomeScreen() {
	ctx.clearRect(0, 0, cWidth, cHeight);

	ctx.textAlign = "center";
	ctx.font = "48px sans-serif";
	ctx.fillText('Welcome to the MIDI game', cWidth / 2, cHeight / 4); 

	ctx.font = "32px sans-serif";
	ctx.fillText('Upload a MIDI file to start playing', cWidth / 2, 3 * cHeight / 4); 
}

function startBasicAnimation() {
	basicAnimFunc();
}

function basicAnimFunc(animCurrentTime) {
	// do timing
	if (!animStartTime) {animStartTime = animCurrentTime;}
	if (!animLastTime) {animLastTime = animCurrentTime;}
	animTotalTime = animCurrentTime - animStartTime;
	animDeltaTime =animCurrentTime - animLastTime;
	animLastTime = animCurrentTime;

	
	// do the drawing
	ctx.clearRect(0, 0, cWidth, cHeight);

	//calculate next x
	var d = animDeltaTime / 4.6785;
	if(d) xpos += d;
	if (xpos > cWidth) xpos = 0;

	xpos = Math.round(xpos);

	//console.log(animDeltaTime);
	console.log(d);

	ctx.beginPath();
	ctx.arc(xpos, cHeight/2, 50, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.save();

	// new frame is requested
	requestAnimationFrame(basicAnimFunc);
}
