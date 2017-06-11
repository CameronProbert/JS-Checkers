// Canvas
var gameHeight = 400;
var gameWidth = 400;
var tilesX = 8;
var tilesY = 8;
var tileWidth = gameWidth / tilesX;
var tileHeight = gameHeight / tilesY;
var rowsOfPieces = 3;

// Game attributes
var whiteTurn = true;
var selectedPiece = null;
var selectedWhite = true;
var pieces = [];
var firstCapture = false;
var hasCaptured = false;
var canCapture = false;

window.onload = function() {
	canvas = document.getElementById("gc");
	context = canvas.getContext("2d");
	document.addEventListener("mousedown", selectPiece);
	document.addEventListener("mouseup", movePiece);
	document.addEventListener("mousemove", drawGame);
	initialiseGame();
	drawGame();
};

// GamePiece Object
function GamePiece(x, y, isWhite) {
	this.x = x;
	this.y = y;
	this.isWhite = isWhite;
	this.isKing = false;
}

function initialiseGame() {

	pieces = [];

	// Populate black pieces
	for (let x = 0; x < tilesX; x++) {
		for (let y = 0; y < rowsOfPieces; y++) {
			if (x % 2 == y % 2) {
				let piece = new GamePiece(x, y, false);
				pieces.push(piece);
			}
		}
	}

	//Populate white pieces
	for (let x = 0; x < tilesX; x++) {
		for (let y = tilesY - rowsOfPieces; y < tilesY; y++) {
			if (x % 2 == y % 2) {
				let piece = new GamePiece(x, y, true);
				pieces.push(piece);
			}
		}
	}

	selectedPiece = null;
	whiteTurn = true;
	firstCapture = false;
	hasCaptured = false;
	canCapture = false;
}

function selectPiece(press) {
	var tileX = parseInt(press.x / tileWidth);
	var tileY = parseInt(press.y / tileHeight);

	selectedPiece = getPiece(tileX, tileY);

	console.log("selectPiece(): " + selectedPiece);
}

/**
Check to see if the given piece is at coordinate (x, y)
*/
function isPieceAtXY(piece, x, y) {
	return (piece.x == x && piece.y == y);
}

/**
Returns the piece at (x, y) or null if there is no piece
*/
function getPiece(x, y) {
	for (let i = 0; i < pieces.length; i++) {
		var piece = pieces[i];
		if (isPieceAtXY(piece, x, y) && whiteTurn == piece.isWhite) {
			selectedWhite = whiteTurn;
			var array = [x, y];
			console.log(piece);
			return piece;
		}
	}
	return null;
}

function movePiece(release) {
	if (selectedPiece === null) return;

	var tileX = parseInt(release.x / tileWidth);
	var tileY = parseInt(release.y / tileHeight);

	if (tileX % 2 != tileY % 2) return;
	if (tileX >= tilesX || tileX < 0 || tileY >= tilesY || tileY < 0) return;

	//TODO implement move rules
	if (selectedWhite == selectedPiece.isWhite) {
		if (!validMove(selectedPiece, tileX, tileY)) {
			return;
		}
		selectedPiece.x = tileX;
		selectedPiece.y = tileY;
	}

	console.log(tileX + "-" + tileY);

	//TODO Set hasCaptured and canCapture
	// Deselect piece and change turn
	if (hasCaptured && !canCapture) {
		whiteTurn = !whiteTurn;
		hasCaptured = false;
	}
	selectedPiece = null;

	//console.log(whitePieces);
	drawGame();
}

function validMove(piece, destX, destY) {
	if (Math.abs(piece.x - destX) == 1 && Math.abs(piece.y - destY) == 1) {
		return move(piece, destX, destY);
	} else if (Math.abs(piece.x - destX) == 2 && Math.abs(piece.y - destY) == 2) {
		return take();
	}
	return false;
}

// TODO check for empty square
function move(piece, x, y) {
	if (getPiece(x, y) !== null) return false;
	if (((piece.isWhite && y > piece.y) || (!piece.isWhite && y < piece.y)) && !piece.isKing) return false;
	return true;
}

// TODO Check for empty square
function take(piece, x, y) {
	if (getPiece(x, y) !== null) return false;
	if (((piece.isWhite && y > piece.y) || (!piece.isWhite && y < piece.y)) && !piece.isKing) return false;

	hasCaptured = true;
	return true;
}

function canMoveBack(piece, x, y) {
	return piece.isKing;
}

function canCaptureBack(piece, x, y) {
	return (hasCaptured || piece.isKing);
}

function drawGame(dragEvent) {

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.lineWidth = 0;

	for (let x = 0; x < tilesX; x++) {
		for (let y = 0; y < tilesY; y++) {

			colour = "BlanchedAlmond";

			if (x % 2 == y % 2) {
				colour = "Tan";
			}

			context.fillStyle = colour;

			context.fillRect(
				x * tileWidth,
				y * tileHeight,
				tileWidth,
				tileHeight
			)
		}
	}

	var colour;
	for (let i = 0; i < pieces.length; i++) {
		if (pieces[i] != selectedPiece) { //TODO use better comparator
			var centreX = pieces[i].x * tileWidth + tileWidth / 2;
			var centreY = pieces[i].y * tileHeight + tileHeight / 2;
			let radius = tileHeight / 2.5;
			if (tileWidth < tileHeight) {
				radius = tileWidth / 2.5;
			}
			if (pieces[i].isWhite) {
				colour = "White";
			} else {
				colour = "Black";
			}
			context.fillStyle = colour;
			context.beginPath();
			context.arc(centreX, centreY, radius, 0, 2 * Math.PI, false);
			context.fill();
			context.stroke();
		} else {
			let radius = tileHeight / 2.5;
			if (tileWidth < tileHeight) {
				radius = tileWidth / 2.5;
			}
			if (selectedPiece.isWhite) {
				colour = "#FFFFFF";
			} else {
				colour = "#000000";
			}
			context.fillStyle = colour;
			context.beginPath();
			context.arc(dragEvent.x, dragEvent.y, radius, 0, 2 * Math.PI, false);
			context.fill();
			context.stroke();
		}

		// Draw the selected piece
		if (selectedPiece !== null) {
			console.log("Dragging Piece: " + selectedPiece);
			let radius = tileHeight / 2.5;
			if (tileWidth < tileHeight) {
				radius = tileWidth / 2.5;
			}
			if (selectedPiece.isWhite) {
				colour = "#FFFFFF";
			} else {
				colour = "#000000";
			}
			context.fillStyle = colour;
			context.beginPath();
			context.arc(dragEvent.x, dragEvent.y, radius, 0, 2 * Math.PI, false);
			context.fill();
			context.stroke();
		}

		//context.stroke();
	}
}
