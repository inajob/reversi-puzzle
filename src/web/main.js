import { Game } from '../core/game.js';
import { BLACK, WHITE, EMPTY } from '../core/board.js';

// --- DOM Elements ---
const boardContainer = document.getElementById('board-container');
const movesLeftSpan = document.getElementById('moves-left');
const gameMessageP = document.getElementById('game-message');

// --- Game Setup ---
const difficulty = { moves: 5, maxLineLength: 2 };
const game = new Game(8, 8, difficulty);

// --- Rendering --- //
function renderBoard() {
    boardContainer.innerHTML = ''; // Clear previous state
    const board = game.board;

    boardContainer.style.gridTemplateColumns = `repeat(${board.cols}, 1fr)`;

    for (let r = 0; r < board.rows; r++) {
        for (let c = 0; c < board.cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;

            const stoneType = board.getStone(r, c);
            if (stoneType !== EMPTY) {
                const stone = document.createElement('div');
                stone.classList.add('stone');
                stone.classList.add(stoneType === BLACK ? 'black' : 'white');
                cell.appendChild(stone);
            }
            
            boardContainer.appendChild(cell);
        }
    }
}

function updateInfo() {
    movesLeftSpan.textContent = game.movesLeft;
    const state = game.getGameState();
    if (state === 'win') {
        gameMessageP.textContent = 'You win! Congratulations!';
    } else if (state === 'lose') {
        gameMessageP.textContent = 'You lose. Better luck next time.';
    } else {
        gameMessageP.textContent = '';
    }
}

// --- Event Handling ---
boardContainer.addEventListener('click', (event) => {
    if (game.isGameOver()) {
        return; // Don't allow moves if the game is over
    }

    const cell = event.target.closest('.cell');
    if (cell) {
        const row = parseInt(cell.dataset.row, 10);
        const col = parseInt(cell.dataset.col, 10);

        if (game.attemptMove(row, col)) {
            renderBoard();
            updateInfo();
        }
    }
});

// --- Initial Render ---
renderBoard();
updateInfo();
