import { Board, BLACK, WHITE, EMPTY } from './board.js';

/**
 * Finds all possible "un-moves" on the board.
 * @param {Board} board The current board state.
 * @param {object} difficulty The difficulty settings.
 * @returns {Array} A list of possible un-moves.
 */
function findAllPossibleUnmoves(board, difficulty) {
    const { maxLineLength } = difficulty;
    const allUnmoves = [];
    const { rows, cols } = board;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board.getStone(r, c) !== BLACK) {
                continue;
            }

            const potentialEmptySpot = { r, c };
            const linesFromThisSpot = [];
            const directions = [
                { r: -1, c: -1 }, { r: -1, c: 0 }, { r: -1, c: 1 },
                { r: 0, c: -1 },                 { r: 0, c: 1 },
                { r: 1, c: -1 }, { r: 1, c: 0 }, { r: 1, c: 1 },
            ];

            for (const dir of directions) {
                const line = [];
                let pathR = r + dir.r;
                let pathC = c + dir.c;

                while (board.isValidCoordinate(pathR, pathC) && board.getStone(pathR, pathC) === BLACK) {
                    line.push({ r: pathR, c: pathC });
                    linesFromThisSpot.push([...line]);
                    pathR += dir.r;
                    pathC += dir.c;
                }
            }

            if (linesFromThisSpot.length > 0) {
                const validLines = linesFromThisSpot.filter(line => line.length <= maxLineLength);

                if (validLines.length > 0) {
                    const getPowerSet = arr => arr.reduce((acc, val) => acc.concat(acc.map(subset => [...subset, val])), [[]]);
                    const lineCombinations = getPowerSet(validLines).filter(subset => subset.length > 0);

                    for (const combo of lineCombinations) {
                        allUnmoves.push({
                            emptySpot: potentialEmptySpot,
                            stonesToWhite: combo.flat()
                        });
                    }
                }
            }
        }
    }
    return allUnmoves;
}

function generatePuzzle(rows, cols, difficulty) {
    const { moves } = difficulty;
    const board = new Board(rows, cols);
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            board.grid[r][c] = BLACK;
        }
    }

    for (let i = 0; i < moves; i++) {
        let possibleUnmoves = findAllPossibleUnmoves(board, difficulty);

        possibleUnmoves = possibleUnmoves.filter(unmove => {
            return !unmove.stonesToWhite.some(stone => {
                const isEdge = stone.r === 0 || stone.r === rows - 1 ||
                               stone.c === 0 || stone.c === cols - 1;
                return isEdge;
            });
        });

        if (possibleUnmoves.length === 0) {
            break;
        }

        const unmove = possibleUnmoves[Math.floor(Math.random() * possibleUnmoves.length)];

        board.grid[unmove.emptySpot.r][unmove.emptySpot.c] = EMPTY;
        for (const stone of unmove.stonesToWhite) {
            board.grid[stone.r][stone.c] = WHITE;
        }
    }

    return {
        initialBoard: board,
        moves: moves
    };
}

export { generatePuzzle };
