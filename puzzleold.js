var canvas1 = document.getElementById('canvas1');
var context1 = canvas1.getContext("2d");
var canvas2 = document.getElementById('canvas2');
var context2 = canvas2.getContext("2d");

// DEFAULT TEXT //

context1.font = "20px Arial";
context1.textAlign = 'center';
context1.fillText("Haz click o arrastra una imagen aquí",canvas1.width/2, canvas1.height/2);

// DRAG AND DROP UPLOAD //

var dropzone = document.getElementById('canvas1'),
uploadBtn = document.getElementById('upload');
dropzone.ondragenter = function(evt){
	evt.preventDefault();
	dropzone.classList.add('hover');
	console.log('dragentered');
	return false;
}
dropzone.ondragover = function(evt){
	evt.preventDefault();
	evt.dataTransfer.setData('picture',evt.target);
}
dropzone.ondragleave = function(){
	dropzone.classList.remove('hover');
	console.log('drag has left');
	return false;
}
dropzone.ondrop = function(evt){
	evt.preventDefault();
	evt.stopPropagation();
	dropzone.classList.remove('hover');
	console.log('something has been dropped');
	displayImg(evt.dataTransfer.files[0]);
	return false;
}

// FILE SELECT UPLOAD //

var upload = document.getElementById('upload');
upload.addEventListener('change', handleFileSelect, true);
 function handleFileSelect() {
    var file = upload.files[0]; 
    displayImg(file);
}

// DISPLAY CHOSEN IMAGE //
var imageData;
var image = new Image();
function displayImg(file){
	var reader = new FileReader();
	

	reader.readAsDataURL(file);
	reader.onload = function(finishedFile){
		image.src = finishedFile.target.result;
		image.onload = function(){		
		context1.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas1.width, canvas1.height);
		context2.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas2.width, canvas2.height);
		imageData = context2.getImageData(0,0,canvas2.width,canvas2.height);
		drawGrid(); //BACKUP OUR IMAGE SO THAT WE CAN REVERT TO IT EACH TIME DIFFICULTY
		//OR COLOUR IS CHANGED
		};
		image.onerror = function(){
			alert('Invalid file type: ' + file.type);
		};
	}	
}
var PUZZLE_DIFFICULTY;
var DIFF_WIDTH;
var DIFF_HEIGHT;
// DRAW GRID //
function drawGrid(){
	context2.putImageData(imageData, 0,0);
	var color = document.getElementById('colorSelect').value;
	var difficulty = document.getElementById('difficulty').value;
	

	if(difficulty=="easy"){
		PUZZLE_DIFFICULTY = 60;
	}
	else if(difficulty=="medium"){
		PUZZLE_DIFFICULTY = 40;
	}
	else{
		PUZZLE_DIFFICULTY = 30;
	}
	context2.strokeStyle = color;
	for (var x = 0; x <=canvas2.width; x+=PUZZLE_DIFFICULTY){
		context2.beginPath();
		context2.moveTo(0 + x, 0);
		context2.lineTo(0 + x, canvas2.height);
		context2.stroke();
	}
	for (var x = 0; x <=canvas2.height; x+=PUZZLE_DIFFICULTY){
		context2.beginPath();
		context2.moveTo(0, 0 + x);
		context2.lineTo(canvas2.width, 0 + x);
		context2.stroke();
	}
	initPuzzle();
}

// SETTING UP VARIABLES FOR GAME INTERACTION //
var _pieceWidth;
var _pieceHeight;
var _puzzleWidth; 
var _puzzleHeight; 
var _pieces;
var _currentPiece;
var _currentDropPiece;

var _mouse;

// INITIALISING SOME OF THE VARIABLES AND ADDING A TITLE OVERLAY BEFORE THE GAME BEGINS //
function initPuzzle(){
	_pieces = [];
	_mouse = {x:0,y:0};
	_currentPiece = null;
	_currentDropPiece = null;
	_pieceWidth = Math.floor(canvas2.width/PUZZLE_DIFFICULTY);
	_pieceHeight = Math.floor(canvas2.width/PUZZLE_DIFFICULTY);
	_puzzleWidth = _pieceWidth*PUZZLE_DIFFICULTY/10;
	_puzzleHeight = _pieceHeight*PUZZLE_DIFFICULTY/10;
	createTitle("Pinchar el buton para empezar");
	buildPieces();
}


// BUILD OBJECTS FOR EACH PUZZLE PIECE //
function buildPieces(){
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    var numberOfPieces = (PUZZLE_DIFFICULTY * (canvas2.height/PUZZLE_DIFFICULTY)/10);
    for(i = 0;i < numberOfPieces;i++){
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        _pieces.push(piece);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
}

// AWAITS START BUTTON CLICK, STARTS TIMER, SHUFFLES PUZZLE //
function shufflePuzzle(){
	_pieces = shuffleArray(_pieces);
    context2.clearRect(0,0,canvas2.width,canvas2.width);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        context2.drawImage(image, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        context2.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
   // document.onmousedown = onPuzzleClick;
}
// SHUFFLES THE PIECES //
function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// TAKES A STRING INPUT AND CREATES A TITLE //
function createTitle(msg){
	context2.fillStyle = "#000000";
    context2.globalAlpha = .4;
    context2.fillRect(40,canvas2.height - 40,canvas2.width-80,40);
    context2.fillStyle = "#FFFFFF";
    context2.globalAlpha = 1;
    context2.textAlign = "center";
    context2.textBaseline = "middle";
    context2.font = "20px Arial";
    context2.fillText(msg,canvas2.width / 2,canvas2.height - 20);
}
// TIMER //

var timerEnabled = false
	var hr = 0;
	var min = 0;
	var sec = 0;
	var incSec;
	var incMin;
	var incHr;


function startTimer(){
	timerEnabled = true;
	timer();	
}
function endTimer(){
	timerEnabled = false;
	timer();
}
function timer(){
	if(timerEnabled){
		  incSec = setInterval(incSec,1000);
		  incMin = setInterval(incMin,60000);
		  incHr = setInterval(incHr,120000);
	}
	else{
	clearInterval(incSec);
	clearInterval(incMin);
	clearInterval(incHr);
	}
}

function incHr(){
	hr ++;
	if(hr.length=1){
		hr="0"+hr;
	}
	hour = document.getElementById('hour');
	hour.innerText = hr.toString();
}
function incMin(){
	if(min=59){
	min++;
	}
	else{min=0};
	minute = document.getElementById('minute');
	minute.innerText = min.toString();
}
function incSec(){
	if(sec<60){
	sec++;
}
	else{sec = 0;}
	second = document.getElementById('second');
	second.innerText = sec.toString();
}




	

