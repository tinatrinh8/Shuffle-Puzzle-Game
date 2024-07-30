// Define the game board
var gameBoard = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, ""]];
var puzzle = document.getElementById("puzzle");
var cells = puzzle.getElementsByTagName("td");

// Set the puzzle state on the table
for (var i = 0; i < cells.length; i++) {

  var row = Math.floor(i / 4);
  var column = i % 4;
  cells[i].textContent = gameBoard[row][column];

  if (gameBoard[row][column] === "") { 
    cells[i].classList.add("empty");

  } else {
    cells[i].classList.remove("empty"); 
  }
}

// Make the event by looping puzzle
for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", move);
}

function move(event) {

  // get event object, row index and column index
  var cell = event.target;
  var cellRow = cell.parentNode.rowIndex;
  var cellColumn = cell.cellIndex;

  var next = [
   
  // Define above cell
    [cellRow - 1, cellColumn],

  // Define below cell
    [cellRow + 1, cellColumn],
   
  // Define left cell
    [cellRow, cellColumn - 1],
    
  // Define right cell
    [cellRow, cellColumn + 1], 
  ];

  for (var [nextRow, nextColumn] of next) {

    // Check if the next column or row is empty
    if (
      (nextRow >= 0 && nextRow <= 3 && nextColumn >= 0 && nextColumn <= 3)
      && gameBoard[nextRow][nextColumn] === ""
    ){

      // Then update the puzzle's state
      gameBoard[nextRow][nextColumn] = gameBoard[cellRow][cellColumn];
      gameBoard[cellRow][cellColumn] = "";
      updateTable();
      return;
    }
  }

  // If there was no move
  alert("Invalid move");
}

// Update the table with the new puzzle state
function updateTable() {

  for (var i = 0; i < cells.length; i++) {

    var row = Math.floor(i / 4);
    var col = i % 4;

    // Set value of cell based on itd current state
    cells[i].textContent = gameBoard[row][col];

    // Add or remove to show or hide the emoty cell
    if (gameBoard[row][col] === "") {
      cells[i].classList.add("empty");

    } else {
      cells[i].classList.remove("empty");
    }
  }
}

// Shuffle the puzzle state
function shuffle() {

  for (var i = 0; i < 1000; i++) {

    var row;
    var column;
    var emptyRow;
    var emptyColumn;
    

    // Find the empty cell
    for (row = 0; row < 4; row++) {

      for (column = 0; column < 4; column++) {

        if (gameBoard[row][column] === "") {

          emptyRow = row;
          emptyColumn = column;
          break;
        }
      }

      if (gameBoard[row][column] === "") {
        break;
      }
    }
    // Select the next cell to swap with an empty cell
    var next = [];

    // Swap cell above
    if (emptyRow > 0) {
      next.push([emptyRow - 1, emptyColumn]);
    }

    // Swap cell below
    if (emptyRow < 3) {
      next.push([emptyRow + 1, emptyColumn]);
    }

    // Swap cell to the left
    if (emptyColumn > 0) {
      next.push([emptyRow, emptyColumn - 1]);
    }

     // Swap cell on the right
     if (emptyColumn < 3) {
      next.push([emptyRow, emptyColumn+ 1]);
    }

    var randomIndex = Math.floor(Math.random() * next.length);
    var randomNext = next[randomIndex];

    // Swap the empty cell with the next cell
    var current = gameBoard[emptyRow][emptyColumn];
    gameBoard[emptyRow][emptyColumn] = gameBoard[randomNext[0]][randomNext[1]];
    gameBoard[randomNext[0]][randomNext[1]] = current;
  }

  updateTable();
}
