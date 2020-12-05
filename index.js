const BOARD_LENGTH = 8;
const DEPTH = 5;

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

class BaseHeuristic {
  valueFor(board) {
    return -Infinity;
  }
}

class NaiveHeuristic extends BaseHeuristic {
  valueFor(board) {
    return board.numberOfRedPieces() - board.numberOfBlackPieces();
  }
}

class Board {
  constructor(height, width, heuristic) {
    this.height = height;
    this.width = width;
    this.data = [];
    this.heuristicStrategy = heuristic;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (j === 0) {
          this.data.push(new Array());
        }

        this.data[i][j] = ".";
      }
    }
  }

  heuristic() {
    return this.heuristicStrategy.valueFor(this);
  }

  numberOfBlackPieces() {
    let sum = 0;

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.data[i][j].toLowerCase() === 'b') {
          sum = sum + 1;
        }
      }
    }

    return sum;
  }

  numberOfRedPieces() {
    let sum = 0;

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.data[i][j].toLowerCase() === 'r') {
          sum = sum + 1;
        }
      }
    }

    return sum;
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

  performMove(move) {
    let c = Board.copy(this);
    c.data[move.yDst][move.xDst] = c.data[move.ySrc][move.xSrc];
    c.data[move.ySrc][move.xSrc] = ".";
    return c;
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
    let c = new Board(original.height, original.width, original.heuristicStrategy);
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

class AI {
  constructor(board, color) {
    this.board = board;
    this.color = color;
    this.adversary = color === 'b' ? 'r' : 'b';
  }

  determineMove() {
    let legalMoves = this.board.getLegalMoves(this.color);
    let currentIndex = 0;
    let currentValue = -Infinity;

    for (let i = 0; i < legalMoves.length; i++) {
      let possibleMove = legalMoves[i];
      let child = this.board.performMove(possibleMove);
      let childValue = this.minimax(child, DEPTH, this.color);
      if (childValue > currentValue) {
        currentIndex = i;
        currentValue = childValue;
      }
    }

    return legalMoves[currentIndex];
  }

  minimax(board, depth, maximizingPlayer) {
    if (depth === 0 || (board.getLegalMoves('r').length === 0 && board.getLegalMoves('b').length === 0)) {
      return board.heuristic();
    }

    if (maximizingPlayer === this.color) {
      let value = -Infinity;
      let legalMoves = board.getLegalMoves(this.color);
      for (let i = 0; i < legalMoves.length; i++) {
        let possibleMove = legalMoves[i];
        let child = board.performMove(possibleMove);
        value = Math.max(value, this.minimax(child, depth - 1, false))
      }

      return value;
    }

    else {
      let value = Infinity;
      let legalMoves = board.getLegalMoves(this.adversary);
      for (let i = 0; i < legalMoves.length; i++) {
        let possibleMove = legalMoves[i];
        let child = board.performMove(possibleMove);
        value = Math.min(value, this.minimax(child, depth - 1, true))
      }

      return value;
    }
  }
}

const initialBoard = require('fs').readFileSync('input_begin', 'utf-8').split('\n')

let board = new Board(BOARD_LENGTH, BOARD_LENGTH, new NaiveHeuristic());
board.initialize(initialBoard);
console.log(board.toString());

let ai = new AI(board, 'r');
console.log(ai.determineMove(board).toString());