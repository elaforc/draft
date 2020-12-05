const Move = require('./move.js').Move;

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
    if (i >= this.height || i < 0 || j >= this.width || j < 0) {
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

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
          let current = this.data[i][j];
          if (current === player || current === player.toUpperCase()) {
            if (this.isValidJump(current, i, j, i+2, j+2)) {
              legalMoves.push(new Move(i, j, i+2, j+2, this.height));
            }
            if (this.isValidJump(current, i, j, i-2, j-2)) {
              legalMoves.push(new Move(i, j, i-2, j-2, this.height));
            }
            if (this.isValidJump(current, i, j, i+2, j-2)) {
              legalMoves.push(new Move(i, j, i+2, j-2, this.height));
            }
            if (this.isValidJump(current, i, j, i-2, j+2)) {
              legalMoves.push(new Move(i, j, i-2, j+2, this.height));
            }
          }
      }
    }

    if (legalMoves.length === 0) {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          let current = this.data[i][j];
          if (current === player || current === player.toUpperCase()) {
            if (this.isValidMove(current, i, j, i+1, j+1)) {
              legalMoves.push(new Move(i, j, i+1, j+1, this.height));
            }
            if (this.isValidMove(current, i, j, i-1, j-1)) {
              legalMoves.push(new Move(i, j, i-1, j-1, this.height));
            }
            if (this.isValidMove(current, i, j, i+1, j-1)) {
              legalMoves.push(new Move(i, j, i+1, j-1, this.height));
            }
            if (this.isValidMove(current, i, j, i-1, j+1)) {
              legalMoves.push(new Move(i, j, i-1, j+1, this.height));
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
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
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

module.exports.Board = Board;
