var canvas;
var ctx;
var cWidth;
var cHeight;

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
	   


}
