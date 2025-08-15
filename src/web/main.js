import { Game } from '../core/game.js';
import { BLACK, WHITE, EMPTY } from '../core/board.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const boardContainer = document.getElementById('board-container');
    const movesLeftSpan = document.getElementById('moves-left');
    const gameMessageP = document.getElementById('game-message');
    const undoButton = document.getElementById('undo-button');
    const solutionDisplayP = document.getElementById('solution-display');
    const showSolutionButton = document.getElementById('show-solution-button');
    const seedDisplayP = document.getElementById('seed-display');

    // --- Game Setup ---
    const difficulty = { moves: 50, maxLineLength: 4 };

    let seed = null;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('seed')) {
        const seedParam = urlParams.get('seed');
        seed = parseInt(seedParam, 10);
        if (isNaN(seed)) {
            console.warn("Invalid seed provided in URL. Using random seed.");
            seed = null;
        }
    }

    const game = new Game(8, 8, difficulty, seed, 64);

    console.log(`Solution: ${game.getSolutionMoves()}`);
    game.simulateSolution();

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

    undoButton.addEventListener('click', () => {
        if (game.undoMove()) {
            renderBoard();
            updateInfo();
        }
    });

    // --- Initial Render ---
    renderBoard();
    updateInfo();
    solutionDisplayP.textContent = `Solution: ${game.getSolutionMoves()}`;
    solutionDisplayP.style.display = 'none'; // Hide by default

    console.log(`Debug - Seed value: ${seed}`);
    seedDisplayP.textContent = `Seed: ${game.seed}`;

    showSolutionButton.addEventListener('click', () => {
        solutionDisplayP.style.display = 'block'; // Show when button is clicked
    });
});