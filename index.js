const BOARD_LENGTH = 8;

class Move {
  constructor(ySrc, xSrc, yDst, xDst) {
    this.xSrc = xSrc;
    this.ySrc = ySrc;
    this.xDst = xDst
    this.yDst = yDst;
  }

  toString() {
    let srcRow = String.fromCharCode(65 + this.xSrc);
    let srcCol = BOARD_LENGTH - this.ySrc;
    let dstRow = String.fromCharCode(65 + this.xDst);
    let dstCol = BOARD_LENGTH - this.yDst;
    return `${srcRow}${srcCol}${dstRow}${dstCol}`;
  }
}

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

  outOfBounds(i, j) {
    if (i >= BOARD_LENGTH || i < 0 || j >= BOARD_LENGTH || j < 0) {
      return true;
    }

    return false;
  }

  spaceTaken(i, j) {
    if (this.data[i][j] === ".") {
      return false;
    }

    return true;
  }

  isKing(player) {
    return player === "R" || player === "B";
  }

  isValidMove(player, iSrc, jSrc, iDst, jDst) {
    if (this.outOfBounds(iDst, jDst)) {
      return false;
    }

    if (this.spaceTaken(iDst, jDst)) {
      return false;
    }

    if (this.isKing(player)) {
      return true;
    }

    if (player === 'r') {
      return iSrc < iDst;
    } else {
      return iSrc > iDst
    }
  }

  canJump(player, iSrc, jSrc, iDst, jDst) {
    let jumpPlayer = player.toLowerCase() === 'r' ? 'b' : 'r';
    let iIntermediate = iDst > iSrc ? iDst - 1 : iDst + 1;
    let jIntermediate = jDst > jSrc ? jDst - 1 : jDst + 1;

    let intermediateSquare = this.data[iIntermediate][jIntermediate];

    return intermediateSquare.toLowerCase() === jumpPlayer;
  }

  isValidJump(player, iSrc, jSrc, iDst, jDst) {
    if (this.outOfBounds(iDst, jDst)) {
      return false;
    }

    if (this.spaceTaken(iDst, jDst)) {
      return false;
    }

    if (this.isKing(player)) {
      return this.canJump(player, iSrc, jSrc, iDst, jDst);
    }

    else {
      let correctDirection = false;
      if (player === 'r') {
        correctDirection = iSrc < iDst;
      } else {
        correctDirection = iSrc > iDst;
      }
      
      return correctDirection && this.canJump(player, iSrc, jSrc, iDst, jDst);
    }
  }

  getLegalMoves(player) {
    let legalMoves = [];

    for (let i = 0; i < BOARD_LENGTH; i++) {
      for (let j = 0; j < BOARD_LENGTH; j++) {
          let current = this.data[i][j];
          if (current === player || current === player.toUpperCase()) {
            if (this.isValidJump(current, i, j, i+2, j+2)) {
              legalMoves.push(new Move(i, j, i+2, j+2));
            }
            if (this.isValidJump(current, i, j, i-2, j-2)) {
              legalMoves.push(new Move(i, j, i-2, j-2));
            }
            if (this.isValidJump(current, i, j, i+2, j-2)) {
              legalMoves.push(new Move(i, j, i+2, j-2));
            }
            if (this.isValidJump(current, i, j, i-2, j+2)) {
              legalMoves.push(new Move(i, j, i-2, j+2));
            }
          }
      }
    }

    if (legalMoves.length === 0) {
      for (let i = 0; i < BOARD_LENGTH; i++) {
        for (let j = 0; j < BOARD_LENGTH; j++) {
          let current = this.data[i][j];
          if (current === player || current === player.toUpperCase()) {
            if (this.isValidMove(current, i, j, i+1, j+1)) {
              legalMoves.push(new Move(i, j, i+1, j+1));
            }
            if (this.isValidMove(current, i, j, i-1, j-1)) {
              legalMoves.push(new Move(i, j, i-1, j-1));
            }
            if (this.isValidMove(current, i, j, i+1, j-1)) {
              legalMoves.push(new Move(i, j, i+1, j-1));
            }
            if (this.isValidMove(current, i, j, i-1, j+1)) {
              legalMoves.push(new Move(i, j, i-1, j+1));
            }
          }
        }
      }
    }

    return legalMoves;
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

  toString () {
    let str = "  A B C D E F G H\n";
    for (let i = 0; i < this.width; i++) {
      str += (8 - i) + " " + this.data[i].join(" ") + "\n";
    }
    return str;
  }
}


const initialBoard = require('fs').readFileSync('input_mid', 'utf-8').split('\n')

let board = new Board(BOARD_LENGTH, BOARD_LENGTH);
board.initialize(initialBoard);
console.log(board.toString());

let redValidMoves = board.getLegalMoves('r');
let blackValidMoves = board.getLegalMoves('b');

console.log("======== RED =========");
for(let i = 0; i < redValidMoves.length; i++) {
  console.log(redValidMoves[i].toString());
}

console.log("======== BLACK =========");
for(let i = 0; i < blackValidMoves.length; i++) {
  console.log(blackValidMoves[i].toString());
}
