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


window.onload = function () {
    main();
};

// for async funtions await sleep(ms);
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// used for playing sounds
function fnPlayNote(note, octave, time) {
		var src = Synth.generate('piano', note, octave, time);
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
	fnPlayNote('C', 4, 1.5);
	await sleep(500);	
	fnPlayNote('C', 4, 1.5);
	await sleep(500);
	fnPlayNote('C', 4, 1.5);
	await sleep(500);
	fnPlayNote('C', 4, 1.5);
	await sleep(500);
	
	fnPlayNote('D', 4, 1.5);
	await sleep(500);
	fnPlayNote('D', 4, 1.5);
	await sleep(500);
	fnPlayNote('D', 4, 1.5);
	await sleep(500);
	fnPlayNote('D', 4, 1.5);
	await sleep(500);

	fnPlayNote('E', 4, 1.5);
	await sleep(500);
	fnPlayNote('E', 4, 1.5);
	await sleep(500);

	fnPlayNote('D', 4, 1.5);
	await sleep(500);
	fnPlayNote('D', 4, 1.5);
	await sleep(500);

	fnPlayNote('C', 4, 1.5);
	await sleep(500);
	fnPlayNote('C', 4, 1.5);
	await sleep(500);
	fnPlayNote('C', 4, 1.5);
}

function main() {
	canvas = document.getElementById("mainCanvas");
	ctx = canvas.getContext("2d");
	cWidth = canvas.width;
	cHeight = canvas.height;

	// add key lister
	window.addEventListener("keydown", listenKeys, false);

	// construct midi note translate table
	fillMidiNumArr();

	console.log(g_midiNumArr);
	console.log(test_json);

	//var piano = Synth.createInstrument('piano');
	//piano.play('C', 4, 2);




    // configure MIDIReader
    var source = document.getElementById('filereader');
    MidiParser.parse(source, function(obj){
        // Your callback function
        //console.log(obj);
        
        parseFile(source);
    });
    


	drawWelcomeScreen();

	var button = document.getElementById("btn1");
	button.addEventListener('click', function() {
		startBasicAnimation();
	}, false);

}


async function parseFile(file){
			//read the file
    const midi = await Midi.fromUrl(file);
    console.log(midi);
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

	
	mainDraw(animCurrentTime, animDeltaTime);

	// new frame is requested
	requestAnimationFrame(basicAnimFunc);
}
