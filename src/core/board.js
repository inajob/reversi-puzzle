export const EMPTY = 0;
export const BLACK = 1;
export const WHITE = -1;

export class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = this.createGrid(rows, cols);
    }

    createGrid(rows, cols) {
        return Array(rows).fill(null).map(() => Array(cols).fill(EMPTY));
    }

    setupInitialPosition() {
        const midRow = Math.floor(this.rows / 2) - 1;
        const midCol = Math.floor(this.cols / 2) - 1;
        this.grid[midRow][midCol] = WHITE;
        this.grid[midRow][midCol + 1] = BLACK;
        this.grid[midRow + 1][midCol] = BLACK;
        this.grid[midRow + 1][midCol + 1] = WHITE;
    }

    getStone(row, col) {
        if (this.isValidCoordinate(row, col)) {
            return this.grid[row][col];
        }
        return null;
    }

    isValidCoordinate(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    placeStone(row, col, color) {
        if (this.isValidCoordinate(row, col) && this.grid[row][col] === EMPTY) {
            const flippableStones = this.getFlippableStones(row, col, color);
            if (flippableStones.length > 0) {
                this.grid[row][col] = color;
                this.flipStones(flippableStones);
                return true; // Placement was successful
            }
        }
        return false; // Placement failed
    }

    flipStones(stonesToFlip) {
        for (const stone of stonesToFlip) {
            this.grid[stone.row][stone.col] *= -1; // Flip color
        }
    }

    getFlippableStones(row, col, color) {
        const directions = [
            { r: -1, c: -1 }, { r: -1, c: 0 }, { r: -1, c: 1 },
            { r: 0, c: -1 },                 { r: 0, c: 1 },
            { r: 1, c: -1 }, { r: 1, c: 0 }, { r: 1, c: 1 },
        ];

        const allFlippableStones = [];
        const opponentColor = color * -1;

        for (const dir of directions) {
            const stonesInDir = [];
            let r = row + dir.r;
            let c = col + dir.c;

            while (this.isValidCoordinate(r, c) && this.getStone(r, c) === opponentColor) {
                stonesInDir.push({ row: r, col: c });
                r += dir.r;
                c += dir.c;
            }

            if (this.isValidCoordinate(r, c) && this.getStone(r, c) === color) {
                allFlippableStones.push(...stonesInDir);
            }
        }

        return allFlippableStones;
    }

    clone() {
        const newBoard = new Board(this.rows, this.cols);
        newBoard.grid = this.grid.map(row => [...row]);
        return newBoard;
    }
}