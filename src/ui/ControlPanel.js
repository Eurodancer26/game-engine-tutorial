import { Enemy } from '../game/Enemy';
import { Platform } from '../game/Platform';

export class ControlPanel {
    constructor(entityManager, player, canvas) {
        this.entityManager = entityManager;
        this.player = player;
        this.canvas = canvas;

        this.init();
    }

    init() {
        // Получаем ссылки на элементы DOM
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

        // Устанавливаем начальные значения слайдеров
        this.playerSpeedSlider.value = this.player.speed;
        this.playerJumpSlider.value = this.player.jumpForce;
        this.playerWidthSlider.value = this.player.width;
        this.playerHeightSlider.value = this.player.height;
        this.playerYSlider.value = this.player.y;

        // Обработчики для игрока
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
        });
        this.playerHeightSlider.addEventListener('input', (e) => {
            const newHeight = parseInt(e.target.value);
            const delta = newHeight - this.player.height;
            this.player.height = newHeight;
            this.player.y -= delta;
            if (this.player.y < 0) this.player.y = 0;
            if (this.player.y + this.player.height > this.canvas.height) {
                this.player.y = this.canvas.height - this.player.height;
            }
        });
        this.playerYSlider.addEventListener('input', (e) => {
            let newY = parseInt(e.target.value);
            if (newY < 0) newY = 0;
            if (newY + this.player.height > this.canvas.height) {
                newY = this.canvas.height - this.player.height;
            }
            this.player.y = newY;
        });
        this.resetPlayerPosBtn.addEventListener('click', () => {
            this.player.x = this.canvas.width / 2 - this.player.width / 2;
            this.player.y = this.canvas.height / 2 - this.player.height / 2;
            this.playerYSlider.value = this.player.y;
        });

        // Кнопки добавления
        this.addEnemyBtn.addEventListener('click', () => this.addEnemy());
        this.addPlatformBtn.addEventListener('click', () => this.addPlatform());

        // Первоначальная отрисовка списков
        this.renderEnemiesList();
        this.renderPlatformsList();
    }

    addEnemy() {
        const x = Math.random() * (this.canvas.width - 40);
        const y = Math.random() * (this.canvas.height - 40);
        const newEnemy = new Enemy(x, y, 40, 40, 200, this.canvas.width, this.canvas.height);
        this.entityManager.add(newEnemy);
        this.renderEnemiesList();
    }

    addPlatform() {
        const x = Math.random() * (this.canvas.width - 100);
        const y = Math.random() * (this.canvas.height - 50);
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
                <label>X: <input type="number" class="enemy-x" data-index="${index}" value="${Math.round(enemy.x)}" step="5"></label>
                <label>Y: <input type="number" class="enemy-y" data-index="${index}" value="${Math.round(enemy.y)}" step="5"></label>
                <label>W: <input type="number" class="enemy-w" data-index="${index}" value="${enemy.width}" step="5"></label>
                <label>H: <input type="number" class="enemy-h" data-index="${index}" value="${enemy.height}" step="5"></label>
                <button class="delete-enemy" data-index="${index}">Удалить</button>
            </div>
        `;

        const xInput = div.querySelector('.enemy-x');
        const yInput = div.querySelector('.enemy-y');
        const wInput = div.querySelector('.enemy-w');
        const hInput = div.querySelector('.enemy-h');
        const delBtn = div.querySelector('.delete-enemy');

        xInput.addEventListener('change', () => { enemy.x = parseInt(xInput.value); });
        yInput.addEventListener('change', () => { enemy.y = parseInt(yInput.value); });
        wInput.addEventListener('change', () => { enemy.width = parseInt(wInput.value); });
        hInput.addEventListener('change', () => { enemy.height = parseInt(hInput.value); });
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
                <label>X: <input type="number" class="platform-x" data-index="${index}" value="${Math.round(platform.x)}" step="5"></label>
                <label>Y: <input type="number" class="platform-y" data-index="${index}" value="${Math.round(platform.y)}" step="5"></label>
                <label>W: <input type="number" class="platform-w" data-index="${index}" value="${platform.width}" step="5"></label>
                <label>H: <input type="number" class="platform-h" data-index="${index}" value="${platform.height}" step="5"></label>
                <button class="delete-platform" data-index="${index}">Удалить</button>
            </div>
        `;

        const xInput = div.querySelector('.platform-x');
        const yInput = div.querySelector('.platform-y');
        const wInput = div.querySelector('.platform-w');
        const hInput = div.querySelector('.platform-h');
        const delBtn = div.querySelector('.delete-platform');

        xInput.addEventListener('change', () => { platform.x = parseInt(xInput.value); });
        yInput.addEventListener('change', () => { platform.y = parseInt(yInput.value); });
        wInput.addEventListener('change', () => { platform.width = parseInt(wInput.value); });
        hInput.addEventListener('change', () => { platform.height = parseInt(hInput.value); });
        delBtn.addEventListener('click', () => {
            this.entityManager.remove(platform);
            this.renderPlatformsList();
            this.renderEnemiesList();
        });

        return div;
    }
}