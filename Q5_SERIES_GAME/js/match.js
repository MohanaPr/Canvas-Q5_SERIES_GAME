var data,
    i=0,
    answer_text,
    array=[],
    parent,
    div,
    info,
    count=0,
    element,
    min=05,
    sec=00,
    timerInstance=null,
    time=$("#timing");
 
$(document).ready(function(){
  $.ajax({url: "assets/data/key.json", success: function(result){
    data = result; 
    init(data);
  }});
})
/*inint function and value get from local storage*/
function init(jsonObj){
  obj = JSON.parse(localStorage.getItem("details"));
  obj.refresh = 1;
  localStorage.setItem("details",JSON.stringify(obj));
  var length = obj.continent.length;
  cont = obj.continent[length - 1];
  $('#userName').append(obj.player.toUpperCase());
  $('#contientName').append(cont);
  initTimer();
  questions();
  answers();
  draw();
  info=jsonObj;
}
/*for drawing the canvas image*/
function draw(){
  var c = $('#canvas');
  var ctx = c[0].getContext('2d');
  ctx.beginPath();
  ctx.moveTo(100,0);
  ctx.lineTo(0,200);
  ctx.lineTo(200,200);
  ctx.closePath();
  ctx.fillStyle='rgba(255, 255, 204,0.2)';
  ctx.fill();
}  
/* Pick questions in JSON*/
function questions(){
  for(var key in data){
    if( key == "questions"){
      for( var key1 in data[key]){
        i = i + 1;
        div = $('<section></section>').attr({"ondrop":"drop(event)","ondragover":"allowDrop(event)",'class':'level','id':key1});
        var head = $('<h1></h1>').append(i);
        var ques = $('<div></div>').attr({'class':'question'}).append(data[key][key1]);
        div.append(head,ques);
        $('.play').append(div);
      }
    }             
  }              
}
/*for picking up answers from json*/
function answers(){
  for(var key in data){
    if( key == "answers"){
      for( var key1 in data[key]){
        if(key1==cont){
          for( var key2 in data[key][key1]){
            array.push(data[key][key1][key2]);
          }
        }
      }
    }
  }
  shuffle();         
}
/*for shuffling the answers*/          
function shuffle(){
  var temp;
  var j;
  for(var i=0;i<array.length;i++){
    var j=Math.floor(Math.random()*(array.length));
    temp=array[i];
    array[i]=array[j];
    array[j]=temp;
  }
  shufflePrint();
}
/*to print answer in html*/
function shufflePrint()
{
  for(var i=0;i<array.length;i++)
    $(".dragAnswer").eq(i).html(array[i]);         
}
/*drag function for choosing answers*/
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    answer_text=ev.srcElement.nextElementSibling.innerText;
    element=ev.srcElement;
}
/*drop event function*/
function allowDrop(ev) {
  ev.preventDefault();
}
/*Drop functions in questions*/
function drop(ev) {
  parent=ev.srcElement.offsetParent.id;
  for(var key in info){
   if( key == "answers"){
    for( var key1 in info[key]){
      if(key1==cont){
        var mainmenu=info[key][key1];
          for(var keys in mainmenu){
            if(mainmenu[keys]==answer_text){
              if(parent==keys){
                var tick = $('<img>').attr({'src':'assets/images/tick.png','alt':'correct image','class':'tick'})
                var ans = $('<div></div>').attr({'class':'answer'}).append(answer_text);
                $("#"+parent).append(tick,ans);
                count=count+1;
                $(element).closest(".row").remove();         
              }
              else{}
              break;
            }
          }
        }
      }
    }
  }
  if(count==13)
  {
    pauseTimer();
  }
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  $(ev.target).append($(data));
}
/*Timer Function Starts*/
function initTimer()
{
  if(sec==00)
  {
    sec=60;
    min--;
  }
  if(min==-1)
  {
    sec=00;
    stopTimer();
    return;
  }
  sec--;
  if(sec < 10 )
      sec = "0" + sec ;
  time.eq(0).html("0" + min+":"+sec);
  timerInstance=window.setTimeout(function(){
    initTimer();
  },1000);
}
/*stoptimer for game over*/
function stopTimer()
{
  window.clearTimeout(timerInstance);
  $('.spin').css("-webkit-animation-name","none");
  popup();
}
/*popup for game over*/
function popup()
{
  $("#layer").css({"display":"block"});
  $("#popup").css({"display":"block"});
  $("#restart").on("click",restart);
  $(document).keydown(function(ev){
    if(ev.keyCode == 13){
      restart();
    }
  });
}
function restart()
{
  $("#layer").css({"display":"none"});
  $("#popup").css({"display":"none"});
  $(".map").css({"display":"none"}); 
  localStorage.removeItem("details");                         
}
/*stoptimer for level completion */
function pauseTimer()
{
  window.clearTimeout(timerInstance);
  var start = time.eq(0).html();
  var end = '05:00';
  s = start.split(':');
  e = end.split(':');
  sec = e[1]-s[1];
  min_carry = 0;
  if(sec < 0){
    sec += 60;
    min_carry += 1;
  }
  min = e[0]-s[0]-min_carry;
  diff = min + ":" + sec;
  $('.spin').css("-webkit-animation-name","none");
  addTime(min,sec);
  rating(min);
  success_popup();
}
/*level completion popup*/
function success_popup(){
  $("#layer").css({"display":"block"});
  $("#success_popup").css({"display":"block"});
  $('#ok').on("click",enter);
  $(document).keydown(function(ev){
    if(ev.keyCode == 13){
      enter();
    }
  });
}
function enter(){
    $("#layer").css({"display":"none"});
    $("#success_popup").css({"display":"none"});
    if( obj.continent.length == 5 )
      $(window).attr('location','score.html');
}
/*Star rating for level completion*/
function rating(finaltiming){
  var totalfinaltiming=5-finaltiming;
  $('.star').eq(0).html(null);
  for(var i = 0; i <totalfinaltiming; i++){           
    var star = $('<img>').attr({'src':'assets/images/star_white.png','alt':'star rating','class':'star_style'});
    $('.star').append(star);
  }
  for(var i = 0; i < finaltiming ; i++){
    var star1 = $('<img>').attr({'src':'assets/images/star_gray.png','alt':'star rating','class':'star_style'});
    $('.star').append(star1);
  }                
}

function addTime(min,sec){
  var oldTime = (obj.time).split(':');
  final_sec = Number(oldTime[1]) + sec;
  final_min = Number(oldTime[0]) + min;
  if(final_sec > 60)
  {
    final_sec = final_sec - 60;
    final_min = final_min + 1;
  }
  obj.time = final_min+":"+final_sec;
  localStorage.setItem("details",JSON.stringify(obj));
}