import { Board, BLACK, WHITE, EMPTY } from './board.js';
import { generatePuzzle } from './puzzleGenerator.js';

export class Game {
    constructor(rows, cols, difficulty, seed = null, initialBlackStoneCount = 32) {
        const puzzle = generatePuzzle(rows, cols, difficulty, seed, initialBlackStoneCount);
        this.board = puzzle.initialBoard;
        this.maxMoves = puzzle.moves;
        this.movesMade = 0;
        this.playerColor = BLACK;
        this.history = []; // To store board states for undo
        this.unmoves = puzzle.unmoves; // Store the unmoves for solution display
        this.boardStatesBeforeUnmove = puzzle.boardStatesBeforeUnmove; // Store board states before each unmove
        this.seed = puzzle.seed; // Store the actual seed used
    }

    getSolutionMoves() {
        // Solution is the reverse of unmoves
        return this.unmoves.slice().reverse().map(unmove => {
            const colChar = String.fromCharCode(65 + unmove.emptySpot.c);
            const rowNum = unmove.emptySpot.r + 1;
            return `${colChar}${rowNum}`;
        }).join(', ');
    }

    simulateSolution() {
        console.log("--- Simulating Solution ---");
        const simulationBoard = this.board.clone(); // Start with the initial puzzle board
        const solutionSteps = this.unmoves.slice().reverse(); // Get the solution steps

        solutionSteps.forEach((unmove, index) => {
            const { r, c } = unmove.emptySpot;
            const moveCoord = `${String.fromCharCode(65 + c)}${r + 1}`;
            console.log(`Step ${index + 1}: Placing stone at ${moveCoord}`);
            console.log("Expected board state before move:");            console.log(this.boardStatesBeforeUnmove[this.boardStatesBeforeUnmove.length - 1 - index].grid.map(row => row.map(cell => {                if (cell === BLACK) return 'B';                if (cell === WHITE) return 'W';                return '.';            }).join(' ')).join('\n'));

            const success = simulationBoard.placeStone(r, c, BLACK);
            if (success) {
                console.log("Actual board state after move:");
                console.log(simulationBoard.grid.map(row => row.map(cell => {
                    if (cell === BLACK) return 'B';
                    if (cell === WHITE) return 'W';
                    return '.';
                }).join(' ')).join('\n'));
            } else {
                console.log(`Failed to place stone at ${moveCoord}. Board state unchanged.`);
            }
            console.log("\n");
        });
        console.log("--- Simulation End ---");
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
