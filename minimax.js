class Board {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.data = [];

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (j === 0) {
          this.data.push(new Array());
        }

        this.data[i][j] = ".";
      }
    }
  }

  getLegalMoves(player) {

  }

  static copy(original) {
    let c = new Board(original.height, original.width);
    c.initialize(original.data);
    return c;
  }

  initialize(data) {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (j === 0) {
          this.data.push(new Array());
        }

        this.data[i][j] = data[i][j];
      }
    }
  }

  toString() {
    let str = "";
    for (let i = 0; i < this.width; i++) {
      str += this.data[i].join("") + "\n";
    }
    return str;
  }
}

/**
 * Game Runner
 */
const BOARD_LENGTH = 8;
const myColor = readline();
let board = new Board(BOARD_LENGTH, BOARD_LENGTH);

while (true) {
  for (let i = 0; i < BOARD_LENGTH; i++) {
    const inputLine = readline();

    for (let j = 0; j < inputLine.length; j++) {
      board.data[i][j] = inputLine[j];
    }
  }

  console.error(board.toString());

  const numLegalMoves = parseInt(readline());
  let legalMoves = [];
  for (let i = 0; i < numLegalMoves; i++) {
    const moveString = readline();
    legalMoves.push(moveString);
  }

  console.log(legalMoves[0]);
}
