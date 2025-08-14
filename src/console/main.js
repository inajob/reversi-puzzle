import { Game } from '../core/game.js';
import { BLACK, WHITE, EMPTY } from '../core/board.js';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function printBoard(board) {
    let header = '   ';
    for (let i = 0; i < board.cols; i++) {
        header += `${String.fromCharCode(65 + i)}  `;
    }
    console.log(header);

    const separator = '  ' + '-'.repeat(board.cols * 3 + 1);
    console.log(separator);

    for (let r = 0; r < board.rows; r++) {
        let rowStr = `${String(r + 1).padEnd(2)}|`;
        for (let c = 0; c < board.cols; c++) {
            const stone = board.getStone(r, c);
            let char = ' . ';
            if (stone === BLACK) char = ' B ';
            if (stone === WHITE) char = ' W ';
            rowStr += char;
        }
        console.log(rowStr + '|');
    }
    console.log(separator);
}

function parseInput(input) {
    if (typeof input !== 'string' || input.length < 2) {
        return null;
    }
    const colChar = input.charAt(0).toUpperCase();
    const rowStr = input.substring(1);

    const col = colChar.charCodeAt(0) - 65;
    const row = parseInt(rowStr, 10) - 1;

    if (isNaN(col) || isNaN(row)) {
        return null;
    }
    return { row, col };
}

function gameLoop(game) {
    console.log(`\n\nMoves left: ${game.movesLeft}`);
    printBoard(game.board);
    const gameState = game.getGameState();

    if (gameState !== 'playing') {
        console.log("Game Over!");
        if (gameState === 'win') {
            console.log("You win! You turned all stones to black.");
        } else {
            console.log("You lose. Better luck next time.");
        }
        rl.close();
        return;
    }

    rl.question('Enter your move (e.g., C4) or "undo": ', (input) => {
        const lowerInput = input.toLowerCase();
        if (lowerInput === 'undo') {
            if (game.undoMove()) {
                console.log("Move undone.");
            } else {
                console.log("Cannot undo further.");
            }
            gameLoop(game); // Refresh display after undo
            return;
        }

        const coords = parseInput(input);
        if (!coords) {
            console.log("Invalid input. Please use format like 'C4' or 'undo'.");
            gameLoop(game);
            return;
        }

        if (game.attemptMove(coords.row, coords.col)) {
            console.log(`Placed a stone at ${input.toUpperCase()}.`);
        } else {
            console.log("Invalid move. Try again.");
        }
        gameLoop(game);
    });
}

const difficulty = { moves: 5, maxLineLength: 2 };
const game = new Game(8, 8, difficulty);
console.log("--- Reversi Puzzle ---");
console.log("Goal: Turn all stones to Black (B).");
gameLoop(game);
