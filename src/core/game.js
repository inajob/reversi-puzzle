import { Board, BLACK, WHITE, EMPTY } from './board.js';
import { generatePuzzle } from './puzzleGenerator.js';

export class Game {
    constructor(rows, cols, difficulty) {
        const puzzle = generatePuzzle(rows, cols, difficulty);
        this.board = puzzle.initialBoard;
        this.maxMoves = puzzle.moves;
        this.movesMade = 0;
        this.playerColor = BLACK;
        this.history = []; // To store board states for undo
    }

    get movesLeft() {
        return this.maxMoves - this.movesMade;
    }

    attemptMove(row, col) {
        if (this.isGameOver()) {
            return false;
        }

        // Create a snapshot of the current state BEFORE the move
        const currentBoardState = this.board.clone();

        const success = this.board.placeStone(row, col, this.playerColor);
        if (success) {
            this.history.push(currentBoardState); // Save the pre-move state
            this.movesMade++;
        }
        return success;
    }

    undoMove() {
        if (this.history.length === 0) {
            console.log("No moves to undo.");
            return false; // Nothing to undo
        }

        this.board = this.history.pop(); // Restore the last board state
        this.movesMade--;
        return true;
    }

    getPossibleMoves() {
        const possibleMoves = [];
        for (let r = 0; r < this.board.rows; r++) {
            for (let c = 0; c < this.board.cols; c++) {
                if (this.board.getStone(r, c) === EMPTY) {
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

        if (this.movesLeft <= 0 && this.getPossibleMoves().length > 0) {
             // Still have moves left, but ran out of turns
        } else if (this.movesLeft <= 0 || this.getPossibleMoves().length === 0) {
            return 'lose';
        }

        return 'playing';
    }

    isGameOver() {
        const state = this.getGameState();
        return state === 'win' || state === 'lose';
    }
}
