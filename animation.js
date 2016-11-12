(function() {

function init() {
	var canvas = document.getElementsByTagName('canvas')[0];
	var c = canvas.getContext('2d');

	c.fillRect(0,0,canvas.width,canvas.height);
	var radius = 1;
	var color = 0;
	
	function draw() {
	        c.fillRect(0,0,canvas.width,canvas.height);
		//c.fillStyle = 'hsl(' + color++ + ',100%,50%)';
		c.strokeStyle = 'hsl(' + color++ + ',100%,50%)';
		c.beginPath();
		c.arc(640,450,radius,0,2*Math.PI,false);
		//c.fill();
                c.stroke();
		radius += 0.4;
		//if(radius < 400) {
			requestAnimationFrame(draw);
		//}
	}

	draw();
}

window.addEventListener('load',init,false);

}());

