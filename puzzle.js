var canvas1 = document.getElementById('canvas1');
var context1 = canvas1.getContext("2d");
var canvas2 = document.getElementById('canvas2');
var context2 = canvas2.getContext("2d");

var _pieces;
var _shuffledPieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;
var correctPieces;
var helpShown;
var isStarted;
var _mouse;

//RESTART GAME ON CLOSE MODAL//
winClose = document.getElementsByClassName('winClose')[0];
endClose = document.getElementsByClassName('endClose')[0];

winClose.addEventListener('click', update);
endClose.addEventListener('click', update);

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
	if(!isStarted){
	evt.dataTransfer.setData('picture',evt.target);
	}
}
dropzone.ondragleave = function(){
	dropzone.classList.remove('hover');
	console.log('drag has left');
	return false;
}
dropzone.ondrop = function(evt){
	evt.preventDefault();
	if(!isStarted){
	evt.stopPropagation();
	dropzone.classList.remove('hover');
	console.log('something has been dropped');
	displayImg(evt.dataTransfer.files[0]);
	return false;
	}
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
		update(); //BACKUP OUR IMAGE SO THAT WE CAN REVERT TO IT EACH TIME DIFFICULTY
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


//END GAME BY CHOICE//
function endGame(){
	game = {seconds:document.getElementById('seconds').innerText,
			numMoves:moves,goodPieces:correctPieces};
	displayEnd(game);
	moves = 0;
	document.getElementById('moves').innerHTML= moves;
	endTimer();
	update();
}


//CLEAR GRID//
function update(){
btnUpload = document.getElementById('upload');
btnUpload.disabled = false;
btnStart = document.getElementById('start');
btnStart.disabled = false;
diff = document.getElementById('difficulty');
diff.disabled = false;
col = document.getElementById('colorSelect');
col.disabled = false;
stop = document.getElementById('stop');
stop.disabled = true;
moves = 0;
document.getElementById('moves').innerText=moves;
isStarted = false;
context2.drawImage(canvas1, 0, 0, canvas2.width, canvas2.height);
document.getElementById('incorrectTiles').innerHTML=0;
drawGrid();
initPuzzle();
endTimer();
resetSeconds();
}

// DRAW GRID //
function drawGrid(){
	var color = document.getElementById('colorSelect').value;
	var difficulty = document.getElementById('difficulty').value;
	var gridSize;

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
	_pieceWidth = PUZZLE_DIFFICULTY;							/////THIS MUST BE 10
    _pieceHeight = _pieceWidth;
    _puzzleWidth = canvas2.width;
    _puzzleHeight = canvas2.height;

}

	function initPuzzle(){
	moves = 0;
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
	isStarted = true;
	btnUpload = document.getElementById('upload');
	btnUpload.disabled = true;
	btnStart = document.getElementById('start');
	btnStart.disabled = true;
	diff = document.getElementById('difficulty');
	diff.disabled = true;
	col = document.getElementById('colorSelect');
	col.disabled = true;
	stop = document.getElementById('stop');
	stop.disabled = false;
	moves = 0;
	displayMoves = document.getElementById('moves');
	displayMoves.innerText = moves;
	if(_pieces != null){
		startTimer();
	    _shuffledPieces = shuffleArray(_pieces);
	    context2.clearRect(0,0,_puzzleWidth,_puzzleHeight);
	    var i;
	    var piece;
	    var xPos = 0;
	    var yPos = 0;
	    for(i = 0;i < _shuffledPieces.length;i++){
	        piece = _shuffledPieces[i];
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
		helpShown = false;
	    resetPuzzleAndCheckWin();
	   	canvas2.onmousedown = onPuzzleClick;
	}
}

function onPuzzleClick(e){
    if(e.layerX || e.layerX == 0){ //layer returns location in canvas
        _mouse.x = e.layerX //- canvas2.offsetLeft; //minus any offset ie. if not border-box
        _mouse.y = e.layerY //- canvas2.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX //- canvas2.offsetLeft; //firefox
        _mouse.y = e.offsetY //- canvas2.offsetTop;
    }
    _currentPiece = checkPieceClicked();
    if(_currentPiece != null){
        context2.clearRect(_currentPiece.xPos,_currentPiece.yPos,_pieceWidth,_pieceHeight);
        context2.save();
        context2.globalAlpha = .9;
        context2.drawImage(canvas1, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
        context2.restore();
        canvas2.onmousemove = updatePuzzle;
        canvas2.onmouseup = pieceDropped;
    }
}
function checkPieceClicked(){
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
            //PIECE NOT HIT
        }
        else{
            return piece;
        }
    }
    return null;
}
var tint = "#FF6262";
function updatePuzzle(e){
    _currentDropPiece = null;
    if(e.layerX || e.layerX == 0){
        _mouse.x = e.layerX //- canvas2.offsetLeft;
        _mouse.y = e.layerY //- canvas2.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX //- canvas2.offsetLeft;
        _mouse.y = e.offsetY //- canvas2.offsetTop;
    }
    context2.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    drawGrid();
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _shuffledPieces[i];
        if(piece == _currentPiece){
            continue;
        }
        context2.drawImage(canvas1, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);

        if(_currentDropPiece == null){
            if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
                //NOT OVER
            }
            else{
                _currentDropPiece = piece;
                context2.save();
                context2.globalAlpha = .4;
                context2.fillStyle = tint;
                context2.fillRect(_currentDropPiece.xPos,_currentDropPiece.yPos,_pieceWidth, _pieceHeight);
                context2.restore();

            }
        }
    }
    drawGrid();
    context2.save();
    context2.globalAlpha = .6;
    context2.drawImage(canvas1, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
    context2.restore();
    context2.strokeRect( _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth,_pieceHeight);
}

function showIncorrectPieces(){
	if(helpShown){
		context2.clearRect(0,0,canvas2.width,canvas2.height);
		helpShown = false;
		resetPuzzleAndCheckWin();
	}
	else{
	helpShown = true;
	var i;
    var piece;
    for(i = 0;i < incorrectPieces.length;i++){
        piece = incorrectPieces[i];
         _currentDropPiece = piece;
         		context2.save();
                context2.globalAlpha = .4;
                context2.fillStyle = tint;
                context2.fillRect(_currentDropPiece.xPos,_currentDropPiece.yPos,_pieceWidth, _pieceHeight);
                context2.restore();
    }
    drawGrid();
    canvas2.onmouseover = function(e){
    	helpShown = false;
    	resetPuzzleAndCheckWin();
    }
	}
    
}


function pieceDropped(e){
    canvas2.onmousemove = null;
    canvas2.onmouseup = null;
    if(_currentDropPiece != null){
        var tmp = {xPos:_currentPiece.xPos,yPos:_currentPiece.yPos};
        if(_currentPiece.xPos == _currentDropPiece.xPos && _currentPiece.yPos == _currentDropPiece.yPos){
        	_currentDropPiece.xPos = _currentPiece.xPos;
        	_currentDropPiece.yPos = _currentPiece.yPos;
        }
        else{
        _currentPiece.xPos = _currentDropPiece.xPos;
        _currentPiece.yPos = _currentDropPiece.yPos;
        _currentDropPiece.xPos = tmp.xPos;
        _currentDropPiece.yPos = tmp.yPos;
    }
        if(_currentPiece.xPos==tmp.xPos && _currentPiece.yPos == tmp.yPos){}
        else{increaseMoves();}
    }

    resetPuzzleAndCheckWin();
}
var moves;
function increaseMoves(){
	moves++;
	document.getElementById('moves').innerText = moves;
}

function resetPuzzleAndCheckWin(){
    canvas2.onmouseover= null;
    context2.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var gameWin = true;
    var i;
    var piece;
    incorrectPieces = [];
    correctPieces = [];
    for(i = 0;i < _shuffledPieces.length;i++){
        piece = _shuffledPieces[i];
        context2.drawImage(canvas1, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        context2.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(piece.xPos != piece.sx || piece.yPos != piece.sy){
            gameWin = false;
            incorrectPieces.push(piece);
        }
        else{
        	correctPieces.push(piece);
        }
    }
    document.getElementById('incorrectTiles').innerText=incorrectPieces.length; 
    if(gameWin){
    	endTimer();
    	game = {seconds:document.getElementById('seconds').innerText,
			numMoves:moves,goodPieces:correctPieces};
    	displayWin(game);
        setTimeout(gameOver,500);
    }
}

function gameOver(){
    canvas2.onmousedown = null;
    canvas2.onmousemove = null;
    canvas2.onmouseup = null;
    initPuzzle();
}