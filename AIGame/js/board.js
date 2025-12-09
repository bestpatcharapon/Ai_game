const Board = {
    BOARD_SIZE: 100,
    ROWS: 10,
    COLS: 10,

    ladders: {
        4: 25,
        13: 46,
        33: 49,
        42: 63,
        50: 69,
        62: 81,
        74: 92
    },

    snakes: {
        27: 5,
        40: 3,
        43: 18,
        54: 31,
        66: 45,
        76: 58,
        89: 53,
        99: 41
    },

    eventCells: [12, 23, 35, 47, 56, 68, 78, 87, 95],

    createBoard() {
        const boardElement = document.getElementById('game-board');
        boardElement.innerHTML = '';

        for (let row = this.ROWS - 1; row >= 0; row--) {
            for (let col = 0; col < this.COLS; col++) {
                let position;
                
                if (row % 2 === 0) {
                    position = (row * this.COLS) + col + 1;
                } else {
                    position = (row * this.COLS) + (this.COLS - col);
                }
                
                const cell = this.createCell(position);
                boardElement.appendChild(cell);
            }
        }
    },

    createCell(position) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.position = position;
        cell.id = `cell-${position}`;

        const cellNumber = document.createElement('span');
        cellNumber.className = 'cell-number';
        cellNumber.textContent = position;
        cell.appendChild(cellNumber);

        if (position === this.BOARD_SIZE) {
            cell.classList.add('finish');
            cell.innerHTML += '<span style="font-size: 1.5em;">🏆</span>';
        } else if (this.ladders[position]) {
            cell.classList.add('ladder');
            cell.innerHTML += `<span style="font-size: 1.2em;">🪜</span>`;
        } else if (this.snakes[position]) {
            cell.classList.add('snake');
            cell.innerHTML += `<span style="font-size: 1.2em;">�</span>`;
        } else if (this.eventCells.includes(position)) {
            cell.classList.add('event');
            cell.innerHTML += `<span style="font-size: 1.2em;">❓</span>`;
        }

        return cell;
    },

    placePlayerToken(player) {
        const position = player.position;
        
        if (position === 0) {
            if (player.element) {
                player.element.style.display = 'none';
            }
            return;
        }

        const cell = document.getElementById(`cell-${position}`);
        if (cell && player.element) {
            player.element.style.display = 'flex';
            cell.appendChild(player.element);
        }
    },

    hasLadder(position) {
        return this.ladders[position] !== undefined;
    },

    hasSnake(position) {
        return this.snakes[position] !== undefined;
    },

    getLadderDestination(position) {
        return this.ladders[position];
    },

    getSnakeDestination(position) {
        return this.snakes[position];
    },

    hasEvent(position) {
        return this.eventCells.includes(position);
    }
};
