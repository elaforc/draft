class BaseHeuristic {
  valueFor(board) {
    return -Infinity;
  }
}

class NaiveHeuristic extends BaseHeuristic {
  valueFor(board) {
    return board.numberOfPlayerPieces()*2 + board.numberOfPlayerKings()*5 - (board.numberOfAdversaryPieces()*2 + board.numberOfAdversaryKings()*5);
  }
}

module.exports.NaiveHeuristic = NaiveHeuristic;