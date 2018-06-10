// initialize your variables outside the function
var count = 0;
var clearTime;
var seconds = 0;
var displaySeconds;
//document.getElementById('start').addEventListener('click',startTimer);


 function startWatch() {
 // display the stopwatch 
 displaySeconds = document.getElementById("seconds");
 displaySeconds.innerText = seconds;
 seconds++;
 clearTime = setTimeout( "startWatch()", 1000 ); 
 }

 // startWatch( ) //create a function to start the stop watch 
 function startTimer() {
 if ( seconds == 0) {  
	  startWatch(); 
	}
else{
	endTimer();
	startTimer();
}
}
function endTimer() { 
if ( seconds !== 0){
	if(displaySeconds.innerText<seconds){
		clearTimeout(clearTime);
		seconds = displaySeconds.innerText; 
		displaySeconds.innerText = seconds; 
		// reset the stop watch 
		seconds = 0; 
		// clear the stop watch using the setTimeout( )	
		}
	}
}

function resetSeconds(){
	displaySeconds = document.getElementById("seconds");
	displaySeconds.innerText=0;
}

