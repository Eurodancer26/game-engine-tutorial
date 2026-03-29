import { Enemy } from '../game/Enemy';
import { Platform } from '../game/Platform';

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
        this.addPlatformBtn = document.getElementById('addPlatform');

        this.enemiesCountSpan = document.getElementById('enemiesCount');
        this.platformsCountSpan = document.getElementById('platformsCount');
        this.enemiesListContainer = document.getElementById('enemiesList');
        this.platformsListContainer = document.getElementById('platformsList');

        this.playerSpeedSlider.value = this.player.speed;
        this.playerJumpSlider.value = this.player.jumpForce;
        this.playerWidthSlider.value = this.player.width;
        this.playerHeightSlider.value = this.player.height;
        this.playerYSlider.value = this.player.y;

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
        this.addPlatformBtn.addEventListener('click', () => this.addPlatform());

        this.renderEnemiesList();
        this.renderPlatformsList();

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

    addPlatform() {
        const viewLeft = this.camera.x;
        const viewRight = this.camera.x + this.canvas.width;
        const viewTop = this.camera.y;
        const viewBottom = this.camera.y + this.canvas.height;

        const margin = 50;
        let x = viewLeft + margin + Math.random() * (this.canvas.width - 2 * margin);
        let y = viewTop + margin + Math.random() * (this.canvas.height - 2 * margin);

        x = Math.min(Math.max(x, 0), this.worldWidth - 100);
        y = Math.min(Math.max(y, 0), this.worldHeight - 20);

        const newPlatform = new Platform(x, y, 100, 20, '#888', true);
        this.entityManager.add(newPlatform);
        this.renderPlatformsList();
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
            this.renderPlatformsList();
        });

        return div;
    }

    renderPlatformsList() {
        const platforms = this.entityManager.getEntitiesByType(Platform);
        this.platformsCountSpan.textContent = platforms.length;
        this.platformsListContainer.innerHTML = '';
        platforms.forEach((platform, index) => {
            const div = this.createPlatformItem(platform, index);
            this.platformsListContainer.appendChild(div);
        });
    }

    createPlatformItem(platform, index) {
        const div = document.createElement('div');
        div.className = 'control-panel__item';
        div.innerHTML = `
            <span>Платформа ${index + 1}</span>
            <div class="control-panel__item-controls">
                <label>X: <input type="number" class="platform-x" value="${Math.round(platform.x)}" step="5"></label>
                <label>Y: <input type="number" class="platform-y" value="${Math.round(platform.y)}" step="5"></label>
                <label>W: <input type="number" class="platform-w" value="${platform.width}" step="5"></label>
                <label>H: <input type="number" class="platform-h" value="${platform.height}" step="5"></label>
                <button class="delete-platform">Удалить</button>
            </div>
        `;

        const xInput = div.querySelector('.platform-x');
        const yInput = div.querySelector('.platform-y');
        const wInput = div.querySelector('.platform-w');
        const hInput = div.querySelector('.platform-h');
        const delBtn = div.querySelector('.delete-platform');

        xInput.addEventListener('change', () => {
            let newX = parseInt(xInput.value);
            if (isNaN(newX)) newX = 0;
            if (newX < 0) newX = 0;
            if (newX + platform.width > this.worldWidth) newX = this.worldWidth - platform.width;
            platform.x = newX;
            xInput.value = platform.x;
        });
        yInput.addEventListener('change', () => {
            let newY = parseInt(yInput.value);
            if (isNaN(newY)) newY = 0;
            if (newY < 0) newY = 0;
            if (newY + platform.height > this.worldHeight) newY = this.worldHeight - platform.height;
            platform.y = newY;
            yInput.value = platform.y;
        });
        wInput.addEventListener('change', () => {
            let newW = parseInt(wInput.value);
            if (isNaN(newW)) newW = 100;
            if (newW < 10) newW = 10;
            if (platform.x + newW > this.worldWidth) newW = this.worldWidth - platform.x;
            platform.width = newW;
            wInput.value = platform.width;
        });
        hInput.addEventListener('change', () => {
            let newH = parseInt(hInput.value);
            if (isNaN(newH)) newH = 20;
            if (newH < 5) newH = 5;
            if (platform.y + newH > this.worldHeight) newH = this.worldHeight - platform.y;
            platform.height = newH;
            hInput.value = platform.height;
        });
        delBtn.addEventListener('click', () => {
            this.entityManager.remove(platform);
            this.renderPlatformsList();
            this.renderEnemiesList();
        });

        return div;
    }
}