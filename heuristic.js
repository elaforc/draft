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

module.exports.NaiveHeuristic = NaiveHeuristic;