window.onload = function () {
    main();
};

function main() {
	var c = document.getElementById("mainCanvas");
	var ctx = c.getContext("2d");
	ctx.moveTo(0, 0);
	ctx.lineTo(1280, 720);
	ctx.stroke();
}
