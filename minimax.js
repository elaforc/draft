const myColor = readline();
let board = new Board(constants.BOARD_LENGTH, constants.BOARD_LENGTH, new NaiveHeuristic(), myColor);
let ai = new AI(board, myColor, constants.DEPTH);

while (true) {
  for (let i = 0; i < constants.BOARD_LENGTH; i++) {
    const inputLine = readline();

    for (let j = 0; j < inputLine.length; j++) {
      board.data[i][j] = inputLine[j];
    }
  }

  const numLegalMoves = parseInt(readline());
  for (let i = 0; i < numLegalMoves; i++) {
    const moveString = readline();
  }

  console.error(board.toString());
  let legalMoves = board.getLegalMoves(myColor);
  if (numLegalMoves !== legalMoves.length) {
    console.error("YOUR MOVES DONT MATCH");
  }

  console.log(ai.determineMove().toString());
}
