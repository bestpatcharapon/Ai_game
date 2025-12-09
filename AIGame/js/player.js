class Player {
    constructor(id, name, color, emoji) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.emoji = emoji;
        this.position = 0;
        this.element = null;
    }

    createToken() {
        const token = document.createElement('div');
        token.className = `player-token player${this.id}`;
        token.textContent = this.emoji;
        token.id = `player${this.id}-token`;
        this.element = token;
        return token;
    }

    moveTo(newPosition) {
        this.position = newPosition;
        this.updatePositionDisplay();
    }

    updatePositionDisplay() {
        const posElement = document.getElementById(`player${this.id}-pos`);
        if (posElement) {
            posElement.textContent = this.position;
        }
    }

    hasWon(finishPosition) {
        return this.position >= finishPosition;
    }

    reset() {
        this.position = 0;
        this.updatePositionDisplay();
    }
}
