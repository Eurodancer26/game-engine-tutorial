import { Enemy } from '../game/Enemy';

export class ControlPanel {
    constructor(entityManager, player, canvas, camera, worldWidth, worldHeight) {
        this.entityManager = entityManager;
        this.player = player;
        this.canvas = canvas;
        this.camera = camera;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.init();
    }

    init() {
        this.playerSpeedSlider = document.getElementById('playerSpeed');
        this.playerJumpSlider = document.getElementById('playerJump');
        this.playerWidthSlider = document.getElementById('playerWidth');
        this.playerHeightSlider = document.getElementById('playerHeight');
        this.playerYSlider = document.getElementById('playerY');
        this.resetPlayerPosBtn = document.getElementById('resetPlayerPos');

        this.addEnemyBtn = document.getElementById('addEnemy');

        this.enemiesCountSpan = document.getElementById('enemiesCount');
        this.enemiesListContainer = document.getElementById('enemiesList');

        this.playerSpeedSlider.value = this.player.speed;
        this.playerJumpSlider.value = this.player.jumpForce;
        this.playerWidthSlider.value = this.player.width;
        this.playerHeightSlider.value = this.player.height;
        this.playerYSlider.value = this.player.y;

        // Обработчики игрока
        this.playerSpeedSlider.addEventListener('input', (e) => {
            this.player.speed = parseInt(e.target.value);
        });
        this.playerJumpSlider.addEventListener('input', (e) => {
            this.player.jumpForce = parseInt(e.target.value);
        });
        this.playerWidthSlider.addEventListener('input', (e) => {
            const newWidth = parseInt(e.target.value);
            const delta = newWidth - this.player.width;
            this.player.width = newWidth;
            this.player.x -= delta / 2;
            if (this.player.x < 0) this.player.x = 0;
            if (this.player.x + this.player.width > this.worldWidth) {
                this.player.x = this.worldWidth - this.player.width;
            }
        });
        this.playerHeightSlider.addEventListener('input', (e) => {
            const newHeight = parseInt(e.target.value);
            const delta = newHeight - this.player.height;
            this.player.height = newHeight;
            this.player.y -= delta;
            if (this.player.y < 0) this.player.y = 0;
            if (this.player.y + this.player.height > this.worldHeight) {
                this.player.y = this.worldHeight - this.player.height;
            }
            this.playerYSlider.value = this.player.y;
        });
        this.playerYSlider.addEventListener('input', (e) => {
            let newY = parseInt(e.target.value);
            if (isNaN(newY)) newY = 0;
            if (newY < 0) newY = 0;
            if (newY + this.player.height > this.worldHeight) {
                newY = this.worldHeight - this.player.height;
            }
            this.player.y = newY;
        });
        this.resetPlayerPosBtn.addEventListener('click', () => {
            this.player.x = this.worldWidth / 2 - this.player.width / 2;
            this.player.y = this.worldHeight / 2 - this.player.height / 2;
            if (this.player.x < 0) this.player.x = 0;
            if (this.player.x + this.player.width > this.worldWidth) {
                this.player.x = this.worldWidth - this.player.width;
            }
            if (this.player.y < 0) this.player.y = 0;
            if (this.player.y + this.player.height > this.worldHeight) {
                this.player.y = this.worldHeight - this.player.height;
            }
            this.playerYSlider.value = this.player.y;
        });

        this.addEnemyBtn.addEventListener('click', () => this.addEnemy());

        this.renderEnemiesList();

        // Синхронизация слайдера Y игрока
        setInterval(() => {
            if (this.playerYSlider && document.activeElement !== this.playerYSlider) {
                this.playerYSlider.value = this.player.y;
            }
        }, 50);
    }

    addEnemy() {
        const viewLeft = this.camera.x;
        const viewRight = this.camera.x + this.canvas.width;
        const viewTop = this.camera.y;
        const viewBottom = this.camera.y + this.canvas.height;

        const margin = 50;
        let x = viewLeft + margin + Math.random() * (this.canvas.width - 2 * margin);
        let y = viewTop + margin + Math.random() * (this.canvas.height - 2 * margin);

        x = Math.min(Math.max(x, 0), this.worldWidth - 40);
        y = Math.min(Math.max(y, 0), this.worldHeight - 40);

        const newEnemy = new Enemy(x, y, 40, 40, 200, this.worldWidth, this.worldHeight);
        this.entityManager.add(newEnemy);
        this.renderEnemiesList();
    }

    renderEnemiesList() {
        const enemies = this.entityManager.getEntitiesByType(Enemy);
        this.enemiesCountSpan.textContent = enemies.length;
        this.enemiesListContainer.innerHTML = '';
        enemies.forEach((enemy, index) => {
            const div = this.createEnemyItem(enemy, index);
            this.enemiesListContainer.appendChild(div);
        });
    }

    createEnemyItem(enemy, index) {
        const div = document.createElement('div');
        div.className = 'control-panel__item';
        div.innerHTML = `
            <span>Враг ${index + 1}</span>
            <div class="control-panel__item-controls">
                <label>X: <input type="number" class="enemy-x" value="${Math.round(enemy.x)}" step="5"></label>
                <label>Y: <input type="number" class="enemy-y" value="${Math.round(enemy.y)}" step="5"></label>
                <label>W: <input type="number" class="enemy-w" value="${enemy.width}" step="5"></label>
                <label>H: <input type="number" class="enemy-h" value="${enemy.height}" step="5"></label>
                <button class="delete-enemy">Удалить</button>
            </div>
        `;

        const xInput = div.querySelector('.enemy-x');
        const yInput = div.querySelector('.enemy-y');
        const wInput = div.querySelector('.enemy-w');
        const hInput = div.querySelector('.enemy-h');
        const delBtn = div.querySelector('.delete-enemy');

        xInput.addEventListener('change', () => {
            let newX = parseInt(xInput.value);
            if (isNaN(newX)) newX = 0;
            if (newX < 0) newX = 0;
            if (newX + enemy.width > this.worldWidth) newX = this.worldWidth - enemy.width;
            enemy.x = newX;
            xInput.value = enemy.x;
        });
        yInput.addEventListener('change', () => {
            let newY = parseInt(yInput.value);
            if (isNaN(newY)) newY = 0;
            if (newY < 0) newY = 0;
            if (newY + enemy.height > this.worldHeight) newY = this.worldHeight - enemy.height;
            enemy.y = newY;
            yInput.value = enemy.y;
        });
        wInput.addEventListener('change', () => {
            let newW = parseInt(wInput.value);
            if (isNaN(newW)) newW = 40;
            if (newW < 10) newW = 10;
            if (enemy.x + newW > this.worldWidth) newW = this.worldWidth - enemy.x;
            enemy.width = newW;
            wInput.value = enemy.width;
        });
        hInput.addEventListener('change', () => {
            let newH = parseInt(hInput.value);
            if (isNaN(newH)) newH = 40;
            if (newH < 10) newH = 10;
            if (enemy.y + newH > this.worldHeight) newH = this.worldHeight - enemy.y;
            enemy.height = newH;
            hInput.value = enemy.height;
        });
        delBtn.addEventListener('click', () => {
            this.entityManager.remove(enemy);
            this.renderEnemiesList();
        });

        return div;
    }
}