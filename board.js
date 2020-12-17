const Move = require('./move.js').Move;

class Board {
  constructor(height, width, heuristic, color) {
    this.height = height;
    this.width = width;
    this.data = [];
    this.heuristicStrategy = heuristic;
    this.blackPieces = 0;
    this.redPieces = 0;
    this.blackKings = 0;
    this.redKings = 0;
    this.color = color;

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

  numberOfPlayerPieces() {
    if (this.color === 'r') {
      return this.redPieces;
    } else {
      return this.blackPieces;
    }
  }

  numberOfAdversaryPieces() {
    if (this.color === 'r') {
      return this.blackPieces
    } else {
      return this.redPieces;
    }
  }

  numberOfPlayerKings() {
    if (this.color === 'r') {
      return this.redKings;
    } else {
      return this.blackKings;
    }
  }

  numberOfAdversaryKings() {
    if (this.color === 'r') {
      return this.blackKings;
    } else {
      return this.redKings;
    }
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

  update() {
    let redSum = 0;
    let redKingSum = 0;
    let blackSum = 0;
    let blackKingSum = 0;

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.data[i][j] === 'r') {
          redSum = redSum + 1;
        }
        if (this.data[i][j] === 'b') {
          blackSum = blackSum + 1;
        }
        if (this.data[i][j] === 'R') {
          redKingSum = redKingSum + 1;
        }
        if (this.data[i][j] === 'B') {
          blackKingSum = blackKingSum + 1;
        }
      }
    }

    this.blackPieces = blackSum;
    this.redPieces = redSum;
    this.blackKings = blackKingSum;
    this.redKings = redKingSum;
  }

  performJump(move) {
    let c = Board.copy(this);

    let iIntermediate = move.yDst > move.ySrc ? move.yDst - 1 : move.yDst + 1;
    let jIntermediate = move.xDst > move.xSrc ? move.xDst - 1 : move.xDst + 1;

    c.data[move.yDst][move.xDst] = c.data[move.ySrc][move.xSrc];
    c.data[move.ySrc][move.xSrc] = ".";
    c.data[iIntermediate][jIntermediate] = ".";
    c.update();
    return c;
  }

  performMove(move) {
    let c = Board.copy(this);
    c.data[move.yDst][move.xDst] = c.data[move.ySrc][move.xSrc];
    c.data[move.ySrc][move.xSrc] = ".";
    c.update();
    return c;
  }

  doubleJump(player, src, move, board) {
    let nextMove = null;
    if (board.isValidJump(player, move.yDst, move.xDst, move.yDst + 2, move.xDst + 2)) {
      nextMove = new Move(move.yDst, move.xDst, move.yDst + 2, move.xDst + 2, board.height);
    }
    if (board.isValidJump(player, move.yDst, move.xDst, move.yDst - 2, move.xDst - 2)) {
      nextMove = new Move(move.yDst, move.xDst, move.yDst - 2, move.xDst - 2, board.height);
    }
    if (board.isValidJump(player, move.yDst, move.xDst, move.yDst + 2, move.xDst - 2)) {
      nextMove = new Move(move.yDst, move.xDst, move.yDst + 2, move.xDst - 2, board.height);
    }
    if (board.isValidJump(player, move.yDst, move.xDst, move.yDst - 2, move.xDst + 2)) {
      nextMove = new Move(move.yDst, move.xDst, move.yDst - 2, move.xDst + 2, board.height);
    }

    if (nextMove === null) {
      return new Move(src.ySrc, src.xSrc, move.yDst, move.xDst, this.height);
    } else {
      return board.doubleJump(player, src, nextMove, board.performJump(nextMove));
    }
  }

  getLegalMoves(player) {
    let legalMoves = [];

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let current = this.data[i][j];
        if (current === player || current === player.toUpperCase()) {
          if (this.isValidJump(current, i, j, i + 2, j + 2)) {
            legalMoves.push(this.doubleJump(current, new Move(i, j, i + 2, j + 2, this.height), new Move(i, j, i + 2, j + 2, this.height), Board.copy(this)));
          }
          if (this.isValidJump(current, i, j, i - 2, j - 2)) {
            legalMoves.push(this.doubleJump(current, new Move(i, j, i - 2, j - 2, this.height), new Move(i, j, i - 2, j - 2, this.height), Board.copy(this)));
          }
          if (this.isValidJump(current, i, j, i + 2, j - 2)) {
            legalMoves.push(this.doubleJump(current, new Move(i, j, i + 2, j - 2, this.height), new Move(i, j, i + 2, j - 2, this.height), Board.copy(this)));
          }
          if (this.isValidJump(current, i, j, i - 2, j + 2)) {
            legalMoves.push(this.doubleJump(current, new Move(i, j, i - 2, j + 2, this.height), new Move(i, j, i - 2, j + 2, this.height), Board.copy(this)));
          }
        }
      }
    }

    if (legalMoves.length === 0) {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          let current = this.data[i][j];
          if (current === player || current === player.toUpperCase()) {
            if (this.isValidMove(current, i, j, i + 1, j + 1)) {
              legalMoves.push(new Move(i, j, i + 1, j + 1, this.height));
            }
            if (this.isValidMove(current, i, j, i - 1, j - 1)) {
              legalMoves.push(new Move(i, j, i - 1, j - 1, this.height));
            }
            if (this.isValidMove(current, i, j, i + 1, j - 1)) {
              legalMoves.push(new Move(i, j, i + 1, j - 1, this.height));
            }
            if (this.isValidMove(current, i, j, i - 1, j + 1)) {
              legalMoves.push(new Move(i, j, i - 1, j + 1, this.height));
            }
          }
        }
      }
    }

    return legalMoves;
  }

  static copy(original) {
    let c = new Board(original.height, original.width, original.heuristicStrategy, original.color);
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

  toString() {
    let str = "  A B C D E F G H\n";
    for (let i = 0; i < this.width; i++) {
      str += (8 - i) + " " + this.data[i].join(" ") + "\n";
    }
    return str;
  }
}

module.exports.Board = Board;
