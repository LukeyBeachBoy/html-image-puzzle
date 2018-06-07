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

function displayImg(file){
	var canvas1 = document.getElementById('canvas1');
	var context = canvas1.getContext("2d");
	var reader = new FileReader();
	var image = new Image();

	reader.readAsDataURL(file);
	reader.onload = function(finishedFile){
		image.src = finishedFile.target.result;
		image.onload = function(){		
		context.imageSmoothingEnabled = false;
		context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas1.width, canvas1.height);
		};
		image.onerror = function(){
			alert('Invalid file type: ' + file.type);
		};
	}

	
}
	

