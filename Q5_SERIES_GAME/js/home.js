var player,
	pattern = /^[a-zA-Z\s]+$/,
	obj = {
	player : "",
	continent : [],
	time : "00:00",
	coordinates : [1138,814],
	refresh : 1
}
/*home page script*/
$(document).ready(function(){
    $(".newGame").on("click",enter);
    /*on enter key event*/
  	$(document).on("keydown",function(ev){
		if(ev.keyCode === 13) 
		{
			enter();
			if((player.length !== 0) && (player.match(pattern)))
				$(window).attr('location','map.html');
		}	
	})
	/*enter function on clicking new game*/
  	function enter()
    {
    	player = $("#playerName").val();
		/*name validation*/
		if(player.length==0)
		{
			$('.pointing').css("display","block");
   			$("#new").attr("href","javascript:void(0)");
		}
		else
		{
			if(player.match(pattern))
			{
				obj.player = player;
				localStorage.setItem("details",JSON.stringify(obj));
				$("#new").attr("href","map.html");
			}
			else{
				$('.invalid').css("display","block");
				$("#new").attr("href","javascript:void(0)");
				$('.ename').val(null);
			}
		}
	}
	/*revoking input text*/
	$(".ename").on("focus",function(){
		$('.pointing').css("display","none");
		$('.invalid').css("display","none");
	})
});