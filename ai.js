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
      let possibleMoves = legalMoves[i];
      let child = this.board.performMove(possibleMoves);
      let timer = Date.now();
      let childValue = this.alphabeta(child, this.depth, this.adversary, -Infinity, Infinity, timer);
      if (childValue > currentValue) {
        currentIndex = i;
        currentValue = childValue;
      }
    }

    let moves = legalMoves[currentIndex];
    if (moves.length === 1) {
      return moves[0].toString();
    }

    else {
      let moveStr = moves[0].toString();
      moveStr = moveStr.slice(0, 2);
      for (let i = 1; i < moves.length; i++) {
        moveStr += moves[i].toString();
        moveStr = moveStr.slice(0, 2 * (i + 1));
      }
      moveStr += moves[moves.length - 1].toString().slice(2, 4);
      return moveStr;
    }
  }

  alphabeta(board, depth, maximizingPlayer, alpha, beta, timer) {
    let legalMoves = board.getLegalMoves(this.color);
    let adversaryLegalMoves = board.getLegalMoves(this.adversary);
    let delta = Date.now() - timer;

    if (delta >= 30 || depth === 0 || legalMoves.length === 0 || adversaryLegalMoves.length === 0) {
      let h = board.heuristic();
      return h;
    }

    if (maximizingPlayer === this.color) {
      let value = -Infinity;
      for (let i = 0; i < legalMoves.length; i++) {
        let possibleMoves = legalMoves[i];
        let child = board.performMove(possibleMoves);
        value = Math.max(value, this.alphabeta(child, depth - 1, this.adversary, alpha, beta, timer))
        alpha = Math.max(alpha, value);
        if (alpha >= beta) {
          break;
        }
      }

      return value;
    }

    else {
      let value = Infinity;
      for (let i = 0; i < adversaryLegalMoves.length; i++) {
        let possibleMoves = adversaryLegalMoves[i];
        let child = board.performMove(possibleMoves);
        value = Math.min(value, this.alphabeta(child, depth - 1, this.color, alpha, beta, timer))
        beta = Math.min(beta, value);
        if (beta <= alpha) {
          break;
        }
      }

      return value;
    }
  }
}

module.exports.AI = AI;
