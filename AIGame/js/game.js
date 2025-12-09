const Game = {
    players: [],
    currentPlayerIndex: 0,
    isGameOver: false,
    isRolling: false,
    skipNextTurn: false,

    init() {
        this.players = [
            new Player(1, 'ผู้เล่น 1', '#e74c3c', '🔴'),
            new Player(2, 'ผู้เล่น 2', '#3498db', '🔵')
        ];

        Board.createBoard();

        this.players.forEach(player => {
            player.createToken();
        });

        this.currentPlayerIndex = 0;
        this.isGameOver = false;
        this.skipNextTurn = false;

        this.updateCurrentPlayerDisplay();

        this.bindEvents();

        this.addLog('🎮 เกมเริ่มต้นแล้ว! ผู้เล่น 1 เริ่มก่อน');
    },

    bindEvents() {
        const rollBtn = document.getElementById('roll-btn');
        const restartBtn = document.getElementById('restart-btn');
        const playAgainBtn = document.getElementById('play-again-btn');

        rollBtn.addEventListener('click', () => this.rollDice());
        restartBtn.addEventListener('click', () => this.restart());
        playAgainBtn.addEventListener('click', () => this.restart());
    },

    rollDice() {
        if (this.isGameOver || this.isRolling) return;

        const rollBtn = document.getElementById('roll-btn');
        const diceElement = document.getElementById('dice');
        const diceValue = document.getElementById('dice-value');

        this.isRolling = true;
        rollBtn.disabled = true;

        if (this.skipNextTurn) {
            diceValue.textContent = '😴';
            const currentPlayer = this.getCurrentPlayer();
            this.addLog(`${currentPlayer.emoji} ${currentPlayer.name} พลาดเทิร์นนี้!`);
            
            setTimeout(() => {
                this.skipNextTurn = false;
                this.nextTurn();
                this.isRolling = false;
                rollBtn.disabled = false;
            }, 1500);
            return;
        }

        diceElement.classList.add('rolling');
        let rollCount = 0;
        const rollInterval = setInterval(() => {
            diceValue.textContent = Math.floor(Math.random() * 6) + 1;
            rollCount++;
            
            if (rollCount >= 10) {
                clearInterval(rollInterval);
                
                const finalRoll = Math.floor(Math.random() * 6) + 1;
                diceValue.textContent = finalRoll;
                diceElement.classList.remove('rolling');
                
                setTimeout(() => {
                    this.moveCurrentPlayer(finalRoll);
                }, 300);
            }
        }, 100);
    },

    moveCurrentPlayer(steps) {
        const player = this.getCurrentPlayer();
        const oldPosition = player.position;
        let newPosition = oldPosition + steps;

        if (newPosition > Board.BOARD_SIZE) {
            newPosition = Board.BOARD_SIZE - (newPosition - Board.BOARD_SIZE);
        }

        this.addLog(`${player.emoji} ${player.name} ทอยได้ ${steps} เดินจาก ${oldPosition} → ${newPosition}`);

        player.moveTo(newPosition);
        Board.placePlayerToken(player);

        setTimeout(() => {
            this.checkSpecialCells(player);
        }, 500);
    },

    checkSpecialCells(player) {
        const position = player.position;
        let needsExtraTurn = false;

        if (Board.hasLadder(position)) {
            const destination = Board.getLadderDestination(position);
            this.addLog(`🪜 ${player.name} เจอบันได! ปีนขึ้นจาก ${position} → ${destination}`, 'ladder');
            player.moveTo(destination);
            Board.placePlayerToken(player);
            needsExtraTurn = true;
        }
        else if (Board.hasSnake(position)) {
            const destination = Board.getSnakeDestination(position);
            this.addLog(`🐍 ${player.name} โดนงูกัด! ตกลงจาก ${position} → ${destination}`, 'snake');
            player.moveTo(destination);
            Board.placePlayerToken(player);
            needsExtraTurn = true;
        }
        else if (Board.hasEvent(position)) {
            const event = GameEvents.getRandomEvent();
            const eventResult = GameEvents.applyEventEffect(player, event, Board.BOARD_SIZE);
            
            this.addLog(GameEvents.getEventLogMessage(player, event), 'event');
            
            if (event.effect !== 0) {
                this.addLog(`${player.emoji} ${player.name} เคลื่อนที่จาก ${position} → ${eventResult.newPosition}`, 'event');
                player.moveTo(eventResult.newPosition);
                Board.placePlayerToken(player);
            }
            
            if (eventResult.skipNextTurn) {
                this.skipNextTurn = true;
            }
            
            needsExtraTurn = true;
        }

        setTimeout(() => {
            if (this.checkWin(player)) {
                this.endGame(player);
            } else {
                if (needsExtraTurn) {
                    setTimeout(() => this.nextTurn(), 1000);
                } else {
                    this.nextTurn();
                }
            }
        }, needsExtraTurn ? 800 : 300);
    },

    checkWin(player) {
        return player.position >= Board.BOARD_SIZE;
    },

    endGame(winner) {
        this.isGameOver = true;
        this.addLog(`🎉 ${winner.name} ชนะเกม! 🎉`);
        
        const modal = document.getElementById('win-modal');
        const winnerText = document.getElementById('winner-text');
        winnerText.textContent = `${winner.emoji} ${winner.name} เป็นผู้ชนะ!`;
        modal.classList.remove('hidden');

        document.getElementById('roll-btn').disabled = true;
    },

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.updateCurrentPlayerDisplay();
        
        const rollBtn = document.getElementById('roll-btn');
        rollBtn.disabled = false;
        this.isRolling = false;
    },

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    },

    updateCurrentPlayerDisplay() {
        const currentPlayer = this.getCurrentPlayer();
        document.getElementById('current-player').textContent = currentPlayer.name;

        this.players.forEach((player, index) => {
            const card = document.getElementById(`player${player.id}-card`);
            if (index === this.currentPlayerIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    },

    addLog(message, type = '') {
        const logContent = document.getElementById('log-content');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = message;
        
        logContent.insertBefore(logEntry, logContent.firstChild);

        while (logContent.children.length > 20) {
            logContent.removeChild(logContent.lastChild);
        }
    },

    restart() {
        document.getElementById('win-modal').classList.add('hidden');

        document.getElementById('log-content').innerHTML = '';

        document.getElementById('dice-value').textContent = '?';

        this.init();
    }
};

window.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
