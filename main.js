window.onload = function () {
    main();
};


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
};

function main() {
	var c = document.getElementById("mainCanvas");
	var ctx = c.getContext("2d");
	ctx.moveTo(0, 0);
	ctx.lineTo(1280, 720);
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
