import { Board, BLACK, WHITE, EMPTY } from './board.js';
import { generatePuzzle } from './puzzleGenerator.js';

export class Game {
    constructor(rows, cols, difficulty) {
        const puzzle = generatePuzzle(rows, cols, difficulty);
        this.board = puzzle.initialBoard;
        this.maxMoves = puzzle.moves;
        this.movesMade = 0;
        this.playerColor = BLACK; // Player is always black
    }

    get movesLeft() {
        return this.maxMoves - this.movesMade;
    }

    attemptMove(row, col) {
        if (this.isGameOver()) {
            return false;
        }

        const success = this.board.placeStone(row, col, this.playerColor);
        if (success) {
            this.movesMade++;
        }
        return success;
    }

    getPossibleMoves() {
        const possibleMoves = [];
        for (let r = 0; r < this.board.rows; r++) {
            for (let c = 0; c < this.board.cols; c++) {
                if (this.board.getStone(r, c) === EMPTY) { // Check only empty squares
                    if (this.board.getFlippableStones(r, c, this.playerColor).length > 0) {
                        possibleMoves.push({ row: r, col: c });
                    }
                }
            }
        }
        return possibleMoves;
    }

    getGameState() {
        let whiteCount = 0;
        for (let r = 0; r < this.board.rows; r++) {
            for (let c = 0; c < this.board.cols; c++) {
                if (this.board.getStone(r, c) === WHITE) {
                    whiteCount++;
                }
            }
        }

        if (whiteCount === 0) {
            return 'win';
        }

        if (this.movesLeft <= 0) {
            return 'lose';
        }
        
        if (this.getPossibleMoves().length === 0) {
            return 'lose'; 
        }

        return 'playing';
    }

    isGameOver() {
        const state = this.getGameState();
        return state === 'win' || state === 'lose';
    }
}