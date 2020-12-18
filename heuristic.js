class BaseHeuristic {
  valueFor(board) {
    return -Infinity;
  }
}

class NaiveHeuristic extends BaseHeuristic {
  valueFor(board) {
    return board.numberOfPlayerPieces() * 2 +
      board.numberOfPlayerKings() * 100 -
      (board.numberOfAdversaryPieces() * 2 + board.numberOfAdversaryKings() * 100);
  }
}

module.exports.NaiveHeuristic = NaiveHeuristic;