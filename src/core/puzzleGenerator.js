import { Board, BLACK, WHITE, EMPTY } from './board.js';

// Simple Linear Congruential Generator (LCG) for seeded random numbers
function createSeededRandom(seed) {
    let state = seed || Math.floor(Math.random() * 2147483647); // Default to a random seed if none provided
    return {
        random: function() {
            state = (state * 9301 + 49297) % 233280;
            return state / 233280;
        },
        seed: state // Return the actual seed used
    };
}


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

            // If placing a BLACK stone at this position would flip WHITE stones, skip it.
            // This ensures the 'emptySpot' of an unmove is not a valid move for BLACK.
            if (board.getFlippableStones(r, c, BLACK).length > 0) {
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
                    pathR += dir.r;
                    pathC += dir.c;

                    if(pathR >= rows || pathC >= cols || pathR < 0 || pathC < 0){
                        break;
                    }
                    
                    // Check if the stone immediately after the line is WHITE
                    if (line.length > 0 && board.isValidCoordinate(pathR, pathC) && board.getStone(pathR, pathC) === WHITE) {
                        // If there's a WHITE stone immediately after the line, this is not a valid unmove line
                        continue;
                    }
                    if (line.length > 2) {
                        linesFromThisSpot.push([...line.slice(0, -1)]);
                    }
                }

                
            }

            if (linesFromThisSpot.length > 0) {
                const validLines = linesFromThisSpot.filter(line => line.length <= maxLineLength);

                if (validLines.length > 0) {
                    const getPowerSet = arr => arr.reduce((acc, val) => acc.concat(acc.map(subset => [...subset, val])), [[]]);
                    const lineCombinations = getPowerSet(validLines).filter(subset => subset.length > 0);
                    //window.lineCombinations = lineCombinations

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

function generatePuzzle(rows, cols, difficulty, seed = null, initialBlackStoneCount = 32) {
    const rngObject = createSeededRandom(seed);
    const rng = rngObject.random;
    const actualSeed = rngObject.seed;
    const { moves } = difficulty;
    const board = new Board(rows, cols);
    
    // Randomly place initial BLACK stones
    let placedStones = 0;
    while (placedStones < initialBlackStoneCount) {
        const r = Math.floor(rng() * rows);
        const c = Math.floor(rng() * cols);
        if (board.getStone(r, c) === EMPTY) {
            board.grid[r][c] = BLACK;
            placedStones++;
        }
    }

    const unmovesMade = [];
    const boardStatesBeforeUnmove = []; // Store board states before each unmove

    for (let i = 0; i < moves; i++) {
        boardStatesBeforeUnmove.push(board.clone()); // Save the current board state

        let possibleUnmoves = findAllPossibleUnmoves(board, difficulty);
        /*
        possibleUnmoves = possibleUnmoves.filter(unmove => {
            return !unmove.stonesToWhite.some(stone => {
                const isEdge = stone.r === 0 || stone.r === rows - 1 ||
                               stone.c === 0 || stone.c === cols - 1;
                return isEdge;
            });
        });
        */
        if (possibleUnmoves.length === 0) {
            break;
        }

        const unmove = possibleUnmoves[Math.floor(rng() * possibleUnmoves.length)];
        unmovesMade.push(unmove);

        board.grid[unmove.emptySpot.r][unmove.emptySpot.c] = EMPTY;
        for (let j = 0; j < unmove.stonesToWhite.length; j ++) {
            board.grid[unmove.stonesToWhite[j].r][unmove.stonesToWhite[j].c] = WHITE;
        }
    }

    return {
        initialBoard: board,
        moves: moves,
        unmoves: unmovesMade,
        boardStatesBeforeUnmove: boardStatesBeforeUnmove,
        seed: actualSeed
    };
}

export { generatePuzzle };
