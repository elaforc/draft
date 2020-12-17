const constants = require('./constants.js').constants;
const Board = require('./board.js').Board;
const NaiveHeuristic = require('./heuristic.js').NaiveHeuristic;
const AI = require('./ai.js').AI;

const initialBoard = require('fs').readFileSync('input_mid', 'utf-8').split('\n')

let board = new Board(constants.BOARD_LENGTH, constants.BOARD_LENGTH, new NaiveHeuristic(), 'b');
board.initialize(initialBoard);
console.log(board.toString());

let ai = new AI(board, 'b', constants.DEPTH);
console.log(ai.determineMove(board).toString());