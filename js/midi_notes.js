var g_midiNumArr = [];

function fillMidiNumArr() {
	var allNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

	for(var i = 0; i < 128; i++) {
		var note = allNotes[i % 12];
		var octave = Math.floor(i / 12 - 1);

		g_midiNumArr[i] = [note, octave];
	}
}
