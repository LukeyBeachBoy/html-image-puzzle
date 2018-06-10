// Get the modal
var endModal = document.getElementById('gameEndModal');
var winModal = document.getElementById('gameWinModal');

// Get the button that opens the modal
var btn = document.getElementById("stop");

// Get the <span> element that closes the modal
var endSpan = document.getElementsByClassName("endClose")[0];

// Get the <span> element that closes the modal
var winSpan = document.getElementsByClassName("winClose")[0];

// When the user clicks the button, open the modal 
function displayEnd(game){
	content = endModal.children[0];
	p = content.children[1];
	p.innerText = "Has dejado " + game.goodPieces.length + 
	" piezas por colocar bien después de " + game.numMoves + 
	" movimientos y has empleado " + game.seconds +" segundos";
    endModal.style.display = "block";
}

 function displayWin(game){
	content = gameWinModal.children[0];
	p = content.children[1];
	p.innerText = "Enhorabuena! Has ganado!\n"+ "Has dejado " + game.goodPieces.length + 
	" piezas por colocar bien después de " + game.numMoves + 
	" movimientos y has empleado " + game.seconds +" segundos";
 	winModal.style.display = "block";
 }

// When the user clicks on <span> (x), close the modal
endSpan.onclick = function() {
    endModal.style.display = "none";
}
// When the user clicks on <span> (x), close the modal
winSpan.onclick = function() {
    winModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == endModal) {
       endModal.style.display = "none";
    }
}
window.onclick = function(event) {
    if (event.target == winModal) {
        winModal.style.display = "none";
    }
}