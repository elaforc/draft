let myColor = readline();
if (myColor === 'w') {
  myColor = 'r';
}

let board = new Board(constants.BOARD_LENGTH, constants.BOARD_LENGTH, new NaiveHeuristic(), myColor);
let ai = new AI(board, myColor, constants.DEPTH);

while (true) {
  for (let i = 0; i < constants.BOARD_LENGTH; i++) {
    const inputLine = readline();

    for (let j = 0; j < inputLine.length; j++) {
      board.data[i][j] = inputLine[j];
    }
  }

  let gameRunnerLegalMoves = [];
  const numLegalMoves = parseInt(readline());
  for (let i = 0; i < numLegalMoves; i++) {
    const moveString = readline();
    gameRunnerLegalMoves.push(moveString);
  }

  console.error(board.toString());
  let legalMoves = board.getLegalMoves(myColor);
  if (numLegalMoves !== legalMoves.length) {
    console.error("YOUR MOVES DONT MATCH");
  }

  let move = ai.determineMove().toString()
  let src = move.slice(0, 2);
  let dst = move.slice(2, 4);

  for (let i = 0; i < gameRunnerLegalMoves.length; i++) {
    if (gameRunnerLegalMoves[i].startsWith(src) && gameRunnerLegalMoves[i].endsWith(dst)) {
      move = gameRunnerLegalMoves[i];
    }
  }

  console.log(move);
}
