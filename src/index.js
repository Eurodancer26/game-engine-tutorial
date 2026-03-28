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
// Пол (нижняя платформа)
const ground = new Platform(0, canvas.height - 40, canvas.width, 40, '#555');
entityManager.add(ground);

// Две платформы в воздухе
const platform1 = new Platform(300, 400, 150, 20, '#888');
entityManager.add(platform1);

const platform2 = new Platform(500, 300, 150, 20, '#888');
entityManager.add(platform2);

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