// Импорт стилей (Webpack добавит их в сборку)
import './styles/main.scss';

// Импорт классов игры
import { Player } from './game/Player';
import { Enemy } from './game/Enemy';
import { Input } from './game/Input';
import { EntityManager } from './game/EntityManager';
import { Platform } from './game/Platform';

// Получаем ссылку на canvas и контекст рисования
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Создаём менеджер сущностей
const entityManager = new EntityManager();

// --- Создание игрока ---
// Параметры: x, y, ширина, высота, скорость (пиксели/сек), ширина и высота canvas
// --- Создаём игрока с jumpForce ---
const player = new Player(
    canvas.width / 2 - 25,
    canvas.height / 2 - 25,
    50, 50,
    300,   // speed
    500,   // jumpForce
    canvas.width,
    canvas.height
);
entityManager.add(player);

// --- Создание врагов ---
// Первый враг: стартовая позиция (100,100), размер 40x40, скорость 200 вправо
const enemy1 = new Enemy(
    100, 100,
    40, 40, 200,
    canvas.width, canvas.height
);
entityManager.add(enemy1);

// Второй враг: (500,300), скорость -200 (влево)
const enemy2 = new Enemy(
    500, 150,
    40, 40, -200,
    canvas.width, canvas.height
);
entityManager.add(enemy2);

// --- Создаём платформы ---
// Пол (нижняя платформа) – двусторонняя, чтобы игрок не падал сквозь пол
const ground = new Platform(0, canvas.height - 40, canvas.width, 40, '#555', false);
entityManager.add(ground);

// Две платформы в воздухе – односторонние (можно прыгать снизу)
const platform1 = new Platform(400, 400, 150, 20, '#888', true);
entityManager.add(platform1);

const platform2 = new Platform(500, 300, 150, 20, '#888', true);
entityManager.add(platform2);

// --- Управление игроком ---
const playerSpeedSlider = document.getElementById('playerSpeed');
const playerJumpSlider = document.getElementById('playerJump');
const playerWidthSlider = document.getElementById('playerWidth');
const playerHeightSlider = document.getElementById('playerHeight');
const playerYSlider = document.getElementById('playerY');
const resetPlayerPosBtn = document.getElementById('resetPlayerPos');

playerSpeedSlider.value = player.speed;
playerJumpSlider.value = player.jumpForce;
playerWidthSlider.value = player.width;
playerHeightSlider.value = player.height;
playerYSlider.value = player.y;

playerSpeedSlider.addEventListener('input', (e) => {
    player.speed = parseInt(e.target.value);
});
playerJumpSlider.addEventListener('input', (e) => {
    player.jumpForce = parseInt(e.target.value);
});
playerWidthSlider.addEventListener('input', (e) => {
    const newWidth = parseInt(e.target.value);
    const delta = newWidth - player.width;
    player.width = newWidth;
    // Корректируем позицию, чтобы центр не смещался (опционально)
    player.x -= delta / 2;
});
playerHeightSlider.addEventListener('input', (e) => {
    const newHeight = parseInt(e.target.value);
    const delta = newHeight - player.height;
    player.height = newHeight;
    player.y -= delta; // смещаем вверх, чтобы игрок не уходил под землю
    // Ограничиваем Y
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});
playerYSlider.addEventListener('input', (e) => {
    let newY = parseInt(e.target.value);
    if (newY < 0) newY = 0;
    if (newY + player.height > canvas.height) newY = canvas.height - player.height;
    player.y = newY;
});
resetPlayerPosBtn.addEventListener('click', () => {
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height / 2 - player.height / 2;
    playerYSlider.value = player.y;
});

// --- Функции обновления списков ---
function renderEnemiesList() {
    const enemies = entityManager.getEntitiesByType(Enemy);
    const countSpan = document.getElementById('enemiesCount');
    const container = document.getElementById('enemiesList');
    countSpan.textContent = enemies.length;
    container.innerHTML = '';
    enemies.forEach((enemy, index) => {
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
        container.appendChild(div);

        // Обработчики для полей
        const xInput = div.querySelector('.enemy-x');
        const yInput = div.querySelector('.enemy-y');
        const wInput = div.querySelector('.enemy-w');
        const hInput = div.querySelector('.enemy-h');
        const delBtn = div.querySelector('.delete-enemy');

        xInput.addEventListener('change', (e) => {
            enemy.x = parseInt(e.target.value);
        });
        yInput.addEventListener('change', (e) => {
            enemy.y = parseInt(e.target.value);
        });
        wInput.addEventListener('change', (e) => {
            enemy.width = parseInt(e.target.value);
        });
        hInput.addEventListener('change', (e) => {
            enemy.height = parseInt(e.target.value);
        });
        delBtn.addEventListener('click', () => {
            entityManager.remove(enemy);
            renderEnemiesList();
            renderPlatformsList(); // обновляем платформы (не обязательно, но для единообразия)
        });
    });
}

function renderPlatformsList() {
    const platforms = entityManager.getEntitiesByType(Platform);
    const countSpan = document.getElementById('platformsCount');
    const container = document.getElementById('platformsList');
    countSpan.textContent = platforms.length;
    container.innerHTML = '';
    platforms.forEach((platform, index) => {
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
        container.appendChild(div);

        const xInput = div.querySelector('.platform-x');
        const yInput = div.querySelector('.platform-y');
        const wInput = div.querySelector('.platform-w');
        const hInput = div.querySelector('.platform-h');
        const delBtn = div.querySelector('.delete-platform');

        xInput.addEventListener('change', (e) => {
            platform.x = parseInt(e.target.value);
        });
        yInput.addEventListener('change', (e) => {
            platform.y = parseInt(e.target.value);
        });
        wInput.addEventListener('change', (e) => {
            platform.width = parseInt(e.target.value);
        });
        hInput.addEventListener('change', (e) => {
            platform.height = parseInt(e.target.value);
        });
        delBtn.addEventListener('click', () => {
            entityManager.remove(platform);
            renderPlatformsList();
            renderEnemiesList();
        });
    });
}

// --- Добавление врагов и платформ (с обновлением списков) ---
const addEnemyBtn = document.getElementById('addEnemy');
const addPlatformBtn = document.getElementById('addPlatform');

addEnemyBtn.addEventListener('click', () => {
    const x = Math.random() * (canvas.width - 40);
    const y = Math.random() * (canvas.height - 40);
    const newEnemy = new Enemy(x, y, 40, 40, 200, canvas.width, canvas.height);
    entityManager.add(newEnemy);
    renderEnemiesList();
});

addPlatformBtn.addEventListener('click', () => {
    const x = Math.random() * (canvas.width - 100);
    const y = Math.random() * (canvas.height - 50);
    const newPlatform = new Platform(x, y, 100, 20, '#888', true);
    entityManager.add(newPlatform);
    renderPlatformsList();
});

// Первоначальная отрисовка списков
renderEnemiesList();
renderPlatformsList();

// Обработчик ввода
const input = new Input();

// --- Переменные для UI ---
let collisionCount = 0;                 // количество столкновений
const collisionSpan = document.getElementById('collisionCount'); // элемент для отображения
const fpsSpan = document.getElementById('fpsValue');            // элемент для FPS

let frameCount = 0;                     // счётчик кадров для расчёта FPS
let lastFpsUpdate = performance.now();  // время последнего обновления FPS

// --- Игровой цикл с deltaTime ---
let lastTime = performance.now();       // время предыдущего кадра

/**
 * Обновление логики игры.
 * @param {number} deltaSec - время с предыдущего кадра в секундах
 */
function update(deltaSec) {
    // Обновляем все объекты (игрок, враги)
    entityManager.update(deltaSec, input.getState());

    // Проверяем столкновения игрока с каждым врагом
    const enemies = entityManager.getEntitiesByType(Enemy);
    for (const enemy of enemies) {
        if (player.collidesWith(enemy)) {
            // Увеличиваем счётчик и обновляем отображение
            collisionCount++;
            collisionSpan.textContent = collisionCount;

            // Визуальный эффект: игрок становится жёлтым, затем возвращается к зелёному
            player.color = '#ff0';
            setTimeout(() => {
                player.color = '#0f0';
            }, 200);

            // Возвращаем игрока в центр
            player.x = canvas.width / 2 - player.width / 2;
            player.y = canvas.height / 2 - player.height / 2;
        }
    }
}

/**
 * Отрисовка всех объектов.
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    entityManager.draw(ctx);
}


/**
 * Основной игровой цикл, вызывается браузером через requestAnimationFrame.
 * @param {number} now - текущее время в миллисекундах
 */
function gameLoop(now) {
    // Вычисляем deltaTime в миллисекундах, затем переводим в секунды
    let deltaMs = now - lastTime;
    lastTime = now;

    let deltaSec = deltaMs / 1000;
    // Защита от больших скачков (например, при переключении вкладок)
    if (deltaSec > 0.1) deltaSec = 0.1;

    update(deltaSec);
    draw();

    // --- Расчёт и отображение FPS (раз в секунду) ---
    frameCount++;
    const nowMs = performance.now();
    if (nowMs - lastFpsUpdate >= 1000) {
        // FPS = (число кадров * 1000) / реальное время в миллисекундах
        const fps = Math.round((frameCount * 1000) / (nowMs - lastFpsUpdate));
        fpsSpan.textContent = fps;
        frameCount = 0;
        lastFpsUpdate = nowMs;
    }

    // Запрашиваем следующий кадр
    requestAnimationFrame(gameLoop);
}

// Запускаем игровой цикл
requestAnimationFrame(gameLoop);