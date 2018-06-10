var canvas1 = document.getElementById('canvas1');
var context1 = canvas1.getContext("2d");
var canvas2 = document.getElementById('canvas2');
var context2 = canvas2.getContext("2d");

var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;
 
var _mouse;



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
var _img = new Image();
function displayImg(file){
	var reader = new FileReader();
	

	reader.readAsDataURL(file);
	reader.onload = function(finishedFile){
		_img.src = finishedFile.target.result;
		_img.width = 360;
		_img.height = 240;
		_img.onload = function(){		
		context1.drawImage(_img, 0, 0, canvas1.width, canvas1.height);
		context2.drawImage(_img, 0, 0, canvas2.width, canvas2.height);
		drawGrid(); //BACKUP OUR IMAGE SO THAT WE CAN REVERT TO IT EACH TIME DIFFICULTY
		//OR COLOUR IS CHANGED
		};
		_img.onerror = function(){
			alert('Invalid file type: ' + file.type);
		};
	}	
}
var PUZZLE_DIFFICULTY;
var DIFF_WIDTH;
var DIFF_HEIGHT;

//CLEAR GRID//
function update(){
context2.drawImage(canvas1, 0, 0, canvas2.width, canvas2.height);;
drawGrid();
}

// DRAW GRID //
function drawGrid(){
	var color = document.getElementById('colorSelect').value;
	var difficulty = document.getElementById('difficulty').value;
	var gridSize;

	if(difficulty=="easy"){
		PUZZLE_DIFFICULTY = 60;
		gridSize = 60; 
	}
	else if(difficulty=="medium"){
		PUZZLE_DIFFICULTY = 40;
		gridSize = 40;
	}
	else{
		PUZZLE_DIFFICULTY = 30;
		gridSize = 30;
	}
	context2.strokeStyle = color;
	for (var x = 0; x <=canvas2.width; x+=gridSize){
		context2.beginPath();
		context2.moveTo(0 + x, 0);
		context2.lineTo(0 + x, canvas2.height);
		context2.stroke();
	}
	for (var x = 0; x <=canvas2.height; x+=gridSize){
		context2.beginPath();
		context2.moveTo(0, 0 + x);
		context2.lineTo(canvas2.width, 0 + x);
		context2.stroke();
	}
	_pieceWidth = PUZZLE_DIFFICULTY;							/////THIS MUST BE 10
    _pieceHeight = _pieceWidth;
    _puzzleWidth = canvas2.width;
    _puzzleHeight = canvas2.height;
	initPuzzle();
}

	function initPuzzle(){
    _pieces = [];
    _mouse = {x:0,y:0};
    _currentPiece = null;
    _currentDropPiece = null;
    buildPieces();
}

function buildPieces(){
    var i;
    var piece;
    width = Math.floor(canvas2.width/PUZZLE_DIFFICULTY);
    height = Math.floor(canvas2.height/PUZZLE_DIFFICULTY);
    numberOfPieces = width * height;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < numberOfPieces ;i++){
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        _pieces.push(piece);
        xPos += _pieceWidth;

        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceWidth;
        }
    }
}

function shuffleArray(o){
    o.sort(function() { return 0.5 - Math.random() });
    return o;
}

function shufflePuzzle(){
    _pieces = shuffleArray(_pieces);
    context2.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        context2.drawImage(canvas1, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    drawGrid();
   	canvas2.onmousedown = function(){console.log('puzzle is being clicked');}
   	canvas2.onmouseup = function(){console.log('puzzle is no longer being clicked');}
   	canvas2.onmousedown = null;
   	canvas2.onmouseup = null;
}

// VARIABLES //


