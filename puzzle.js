// Define the game board
var gameBoard = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, ""],
];
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
      nextRow >= 0 &&
      nextRow <= 3 &&
      nextColumn >= 0 &&
      nextColumn <= 3 &&
      gameBoard[nextRow][nextColumn] === ""
    ) {
      // Then update the puzzle's state
      gameBoard[nextRow][nextColumn] = gameBoard[cellRow][cellColumn];
      gameBoard[cellRow][cellColumn] = "";
      updateTable();
      return;
    }
  }

  // If there was no move
  showBubblePopup(
    "OOPS! THE FARMER CAN'T MOVE THERE. TRY CLICKING A TILE NEXT TO THE FARMER! (CLICK ANYWHERE TO CLOSE)",
    "error"
  );
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

  // Check if puzzle is solved
  checkWin();
}

// Check if the puzzle is solved
function checkWin() {
  var isSolved = true;
  var expectedValue = 1;

  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      if (row === 3 && col === 3) {
        // Last cell should be empty
        if (gameBoard[row][col] !== "") {
          isSolved = false;
        }
      } else {
        // Other cells should be in order
        if (gameBoard[row][col] !== expectedValue) {
          isSolved = false;
        }
        expectedValue++;
      }
    }
  }

  if (isSolved) {
    setTimeout(function () {
      showSuccessCelebration();
    }, 300);
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
      next.push([emptyRow, emptyColumn + 1]);
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

// Bubble Popup Function
function showBubblePopup(message, type) {
  // Remove any existing popups
  const existingPopup = document.querySelector(".bubble-popup");
  const existingOverlay = document.querySelector(".bubble-overlay");

  if (existingPopup) existingPopup.remove();
  if (existingOverlay) existingOverlay.remove();

  // Check if mobile or desktop
  const isMobile = window.innerWidth <= 768;

  let randomPosition;

  if (isMobile) {
    // Mobile: always centered
    randomPosition = { top: "50%", left: "50%" };
  } else {
    // Desktop: randomized positions around the game
    const randomPositions = [
      { top: "15%", left: "20%" },
      { top: "25%", left: "70%" },
      { top: "35%", left: "15%" },
      { top: "20%", left: "80%" },
      { top: "30%", left: "50%" },
      { top: "15%", left: "60%" },
      { top: "40%", left: "25%" },
      { top: "25%", left: "85%" },
    ];

    randomPosition =
      randomPositions[Math.floor(Math.random() * randomPositions.length)];
  }

  // Create overlay (invisible, just for click detection)
  const overlay = document.createElement("div");
  overlay.className = "bubble-overlay";
  document.body.appendChild(overlay);

  // Create popup
  const popup = document.createElement("div");
  popup.className = "bubble-popup " + type;
  popup.textContent = message;
  popup.style.top = randomPosition.top;
  popup.style.left = randomPosition.left;
  popup.style.transform = "translate(-50%, -50%) scale(0)";
  document.body.appendChild(popup);

  // Auto-close after 4 seconds
  setTimeout(function () {
    popup.classList.add("fade-out");
    overlay.classList.add("fade-out");

    setTimeout(function () {
      if (popup.parentNode) popup.parentNode.removeChild(popup);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 300);
  }, 4000);

  // Close on popup click
  popup.addEventListener("click", function () {
    popup.classList.add("fade-out");
    overlay.classList.add("fade-out");

    setTimeout(function () {
      if (popup.parentNode) popup.parentNode.removeChild(popup);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 300);
  });

  // Close on overlay click (click anywhere to close)
  overlay.addEventListener("click", function () {
    popup.classList.add("fade-out");
    overlay.classList.add("fade-out");

    setTimeout(function () {
      if (popup.parentNode) popup.parentNode.removeChild(popup);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 300);
  });
}

// Full Screen Success Celebration Function
function showSuccessCelebration() {
  // Remove any existing celebrations
  const existingCelebration = document.querySelector(".success-celebration");
  if (existingCelebration) existingCelebration.remove();

  // Create celebration overlay
  const celebration = document.createElement("div");
  celebration.className = "success-celebration";

  // Create success message
  const message = document.createElement("div");
  message.className = "success-message";
  message.textContent =
    "CONGRATULATIONS! YOU HELPED THE FARMER ORGANIZE HIS GARDEN! READY FOR A BOUNTIFUL CROPPING SEASON!";

  celebration.appendChild(message);

  // Create confetti
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.animationDelay = Math.random() * 3 + "s";
    confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
    celebration.appendChild(confetti);
  }

  document.body.appendChild(celebration);

  // Auto-close after 5 seconds
  setTimeout(function () {
    celebration.style.animation = "fadeOut 0.5s ease-in forwards";
    setTimeout(function () {
      if (celebration.parentNode)
        celebration.parentNode.removeChild(celebration);
    }, 500);
  }, 5000);

  // Close on click
  celebration.addEventListener("click", function () {
    celebration.style.animation = "fadeOut 0.5s ease-in forwards";
    setTimeout(function () {
      if (celebration.parentNode)
        celebration.parentNode.removeChild(celebration);
    }, 500);
  });
}
