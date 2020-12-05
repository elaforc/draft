class AI {
  constructor(board, color, depth) {
    this.board = board;
    this.color = color;
    this.adversary = color === 'b' ? 'r' : 'b';
    this.depth = depth;
  }

  determineMove() {
    let legalMoves = this.board.getLegalMoves(this.color);
    let currentIndex = 0;
    let currentValue = -Infinity;

    for (let i = 0; i < legalMoves.length; i++) {
      let possibleMove = legalMoves[i];
      let child = this.board.performMove(possibleMove);
      let childValue = this.minimax(child, this.depth, this.color);
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

module.exports.AI = AI;
