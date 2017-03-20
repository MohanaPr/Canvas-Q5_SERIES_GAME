var obj,
	name = "",
	key_left = 37,
	key_right = 39,
	key_up = 38,
	key_down = 40,
	kstate = [false,false,false,false],
	TO_RADIANS = Math.PI/180,
	boat_x,
	boat_y,
	rotation = 350,
	background = new Image(),
	track = new Image(),
	boat = new Image(),
	ocean = new Collisions(),
	canvas = $('#canvas')[0],
    context = canvas.getContext('2d'); 

background.src = 'assets/images/background.png';
track.src = 'assets/images/track.png';
boat.src = 'assets/images/boat.png';

/*document ready function*/
$(document).ready(function(){
	init();
	obj = JSON.parse(localStorage.getItem("details"));
	boat_x = obj.coordinates[0];
	boat_y = obj.coordinates[1];
	$('.ship').css({ "top" : boat_y - 40 , "left" : boat_x - 40 });
	if(obj.refresh === 1){
		location.reload();
		obj.refresh = 10;
		localStorage.setItem("details",JSON.stringify(obj));
	}
});
/*key events initialization*/
function init(){
	$(background).on("load",function(){
		context.drawImage(background, 0,0,1200,920);
	})
	$(document).keydown(function(ev){
		if(ev.keyCode == key_left){
		 	kstate[0] = true;
		}
		if(ev.keyCode == key_right){
			kstate[1] = true;
		}
		if(ev.keyCode == key_up){
		 	kstate[2] = true;
		}
		if(ev.keyCode == key_down){
		 	kstate[3] = true;
	 	}
	});
	$(document).keyup(function(ev){
		if(ev.keyCode == key_left){
			kstate[0] = false;
		}
		if(ev.keyCode == key_right){
		 	kstate[1] = false;
		}
		if(ev.keyCode == key_up){
		 	kstate[2] = false;
		}
		if(ev.keyCode == key_down){
		 	kstate[3] = false;
		}
	});
	setInterval(function(){
		if( kstate[0] ){
			if(ocean.border.left.isHit(hit))
				new_xy(0);
			else{
				rotation = rotation - ( 2 * 1 );
				new_xy(1);
				draw();
			}
		}
		if( kstate[1] ){
			if(ocean.border.right.isHit(hit))
				new_xy(0);
			else{
				rotation = rotation + ( 2 * 1 );
				new_xy(1);
				draw();
			}
		}
		if( kstate[2] ){
			if(ocean.border.up.isHit(hit))
				new_xy(0);
			else{
				new_xy(1);
				draw();
			}
		}
		if( kstate[3] ){
			if(ocean.border.down.isHit(hit))
				new_xy(0);
			else{
				new_xy(-1);
				draw();
			}
		}
	},25);
}
/*for drawing the canvas*/
function draw(){
	$('.ship').css('display','none');
	context.clearRect(0,0,1200,920);
	context.drawImage(track,0,0,1200,920);
    context.drawImage(background, 0,0,1200,920);
    redraw(boat, boat_x, boat_y,rotation);   	
}
/*for re-drawing the boat*/
function redraw(image, x, y, angle) {
	context.save();
 	context.translate(x, y);
	context.rotate(angle * TO_RADIANS);
	context.drawImage(image, -(image.width/2), -(image.height/2));
 	context.restore();
}
/*for getting new co-ordinates of boat*/
function  new_xy(speed) {
	var x = (Math.sin(rotation * TO_RADIANS) * speed);
	var y = (Math.cos(rotation * TO_RADIANS) * speed) * -1;
	boat_x += x;
	boat_y += y;
}
/*for tracker and getting color of the track*/
var hit = new HitMap(track);
function HitMap(img){
	var self = this;
	this.img = img;
	if (img.complete){
		this.draw();
	} else {
		$(img).on("load",function(){
			self.draw();
		});
	}
}
HitMap.prototype.draw = function () {
		this.canvas = $('<canvas></canvas>')[0];
		this.canvas.width = this.img.width;
		this.canvas.height = this.img.height;
		this.context = this.canvas.getContext('2d');
		this.context.drawImage(this.img, 0, 0);
}
HitMap.prototype.isHit = function(x,y){
	if(this.context)
	{
	   	var pixel =this.context.getImageData(x, y, 1, 1);
	    if (pixel){
	    	toMatch(pixel,x,y);
	        return ((pixel.data[0] !== 255) || (pixel.data[1] !== 255 ) || (pixel.data[2] !== 255));
	    } else 
	        return false;
	}
	else
	   	return false;
}
/*to find whether the boat got hit or not*/
function Collisions() {
	this.border = {
		up: new CollisionPoint(boat_x,boat_y, 0,25),
		right: new CollisionPoint(boat_x,boat_y, 90, 25),
		down: new CollisionPoint(boat_x,boat_y, 180,25),
		left: new CollisionPoint(boat_x,boat_y, 270, 25)
	};
}
function CollisionPoint (x,y, rotate, distance) {
	this.x = x;
	this.y = y;
	this.rotation = rotate;
	this.distance = distance;
}
CollisionPoint.prototype.isHit = function(hitMap){
	x = Math.sin((this.rotation + rotation ) * TO_RADIANS) * this.distance + boat_x;
	y = Math.cos((this.rotation + rotation )* TO_RADIANS) * this.distance * -1 + boat_y;
    return hitMap.isHit(x,y);
}
/*for navigating to match page*/
function toMatch(pixel,x,y){
	if((pixel.data[0] === 255 ) && (pixel.data[1] === 0 ) && (pixel.data[2] === 0 ))
	{
		name = "Asia";
	}
	else if(( pixel.data[0] === 0 ) && ( pixel.data[1] === 94 ) && ( pixel.data[2] === 32 ))
	{
		name = "Europe";
	}
	else if(( pixel.data[0] === 27 ) && ( pixel.data[1] === 20 ) && ( pixel.data[2] === 100 ))
	{
		name = "Australia";
	}
	else if(( pixel.data[0] === 255 ) && ( pixel.data[1] === 242 ) && ( pixel.data[2] === 0 ))
	{
		name = "America";
	}
	else if(( pixel.data[0] === 242 ) && ( pixel.data[1] === 108 ) && ( pixel.data[2] === 79 ))
	{
		name = "Africa";
	}
	if(($.inArray(name,obj.continent) === -1) && name !== "")
	{
		obj.continent.push(name);
		obj.coordinates = [x,y];
		localStorage.setItem("details",JSON.stringify(obj));
		confirmation();
	}
}
function confirmation(){
	$('#layer').css("display","block");
	$('#map_popup').css("display","block");
	$(document).off('keydown');
	$('#go').on('click',function(){
		$(window).attr('location','match.html');
	});
	$(document).keydown(function(ev){
	    if(ev.keyCode == 13){
	      $(window).attr('location','match.html');
    }
  });
}