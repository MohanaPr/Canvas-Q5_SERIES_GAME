var obj,time,ct;
$(document).ready(function(){
	obj = JSON.parse(localStorage.getItem("details"));
	$('#player').append(obj.player.toUpperCase());
	$('#win').append(obj.time);
	var count = ((obj.time).split(':'));
	var c = Number(count[0]);
	if((c > 20) && ( c <= 25 ))
		ct = 1;
	else if( (c > 15 ) && ( c <= 20 ) )
		ct = 2;
	else if( (c > 10 ) && ( c <= 15 ) )
		ct = 3;
	else if( (c > 5 ) && ( c <= 10 ) )
		ct = 4;
	else
		ct = 5;
	rating(ct);	
	localStorage.removeItem("details");
})
function rating(ct){
	for(var i = 0; i <ct; i++){  
	    var star = $('<img>').attr({'src':'assets/images/star_white.png','alt':'star rating','class':'star_style'});
	    $('#scoreRating').append(star);
	 }
 	for(var i = 0; i < (5 - ct) ; i++){
	    var star1 = $('<img>').attr({'src':'assets/images/star_gray.png','alt':'star rating','class':'star_style'});
	    $('#scoreRating').append(star1);
	}
}