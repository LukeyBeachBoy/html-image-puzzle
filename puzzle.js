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

function displayImg(file){
	var reader = new FileReader();
	var image = new Image();

	reader.readAsDataURL(file);
	reader.onload = function(finishedFile){
		image.src = finishedFile.target.result;
		image.onload = function(){		
		context1.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas1.width, canvas1.height);
		context2.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas2.width, canvas2.height);
		drawGrid();
		};
		image.onerror = function(){
			alert('Invalid file type: ' + file.type);
		};
	}	

	// DEFAULT GRID (EASY) //


}

// DRAW GRID //

function drawGrid(){
	var difficulty;
	var pieceWidth;
	var pieceHeight;
	p = 0;

	if(difficulty="easy"){
		pieceWidth = ;
		pieceHeight = ;
	}
	if(difficulty="medium"){
		pieceWidth = ;
		pieceHeight = ;
	}
	if(difficulty="hard"){
		pieceWidth = ;
		pieceHeight = ;
	}
	for (var x = 0; x <=canvas2.width; x+=40){
		context2.moveTo(0.5 + x + p, p);
		context2.lineTo(0.5 + x + p, canvas2.height + p);
}
	for (var x = 0; x <=canvas2.height; x+=40){
		context2.moveTo(p, 0.5 + x + p);
		context2.lineTo(canvas2.width + p, 0.5 + x + p);
	}
	context2.strokeStyle = "black";
	context2.stroke();
}

// EASY MODE //

// MEDIUM MODE //

// HARD MODE //


	

