import './styles/main.scss';
import { Player } from './game/Player';
import { Enemy } from './game/Enemy';
import { Platform } from './game/Platform';
import { Input } from './game/Input';
import { EntityManager } from './game/EntityManager';
import { ControlPanel } from './ui/ControlPanel';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const entityManager = new EntityManager();

// Игрок
const player = new Player(
    canvas.width / 2 - 25,
    canvas.height / 2 - 25,
    50, 50,
    300,   // speed
    400,   // jumpForce
    canvas.width,
    canvas.height
);
entityManager.add(player);

// Враги
const enemy1 = new Enemy(100, 100, 40, 40, 200, canvas.width, canvas.height);
entityManager.add(enemy1);
const enemy2 = new Enemy(500, 300, 40, 40, -200, canvas.width, canvas.height);
entityManager.add(enemy2);

// Платформы
const ground = new Platform(0, canvas.height - 40, canvas.width, 40, '#555', false);
entityManager.add(ground);
const platform1 = new Platform(200, 400, 150, 20, '#888', true);
entityManager.add(platform1);
const platform2 = new Platform(500, 300, 150, 20, '#888', true);
entityManager.add(platform2);

const input = new Input();

// Панель управления (создаём после добавления всех объектов)
const controlPanel = new ControlPanel(entityManager, player, canvas);

// UI: счётчик столкновений и FPS
let collisionCount = 0;
const collisionSpan = document.getElementById('collisionCount');
const fpsSpan = document.getElementById('fpsValue');

let frameCount = 0;
let lastFpsUpdate = performance.now();

let lastTime = performance.now();

function update(deltaSec) {
    entityManager.update(deltaSec, input.getState());

    const enemies = entityManager.getEntitiesByType(Enemy);
    for (const enemy of enemies) {
        if (player.collidesWith(enemy)) {
            collisionCount++;
            collisionSpan.textContent = collisionCount;

            player.color = '#ff0';
            setTimeout(() => { player.color = '#0f0'; }, 200);

            player.x = canvas.width / 2 - player.width / 2;
            player.y = canvas.height / 2 - player.height / 2;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    entityManager.draw(ctx);
}

function gameLoop(now) {
    let deltaMs = now - lastTime;
    lastTime = now;
    let deltaSec = deltaMs / 1000;
    if (deltaSec > 0.1) deltaSec = 0.1;

    update(deltaSec);
    draw();

    frameCount++;
    const nowMs = performance.now();
    if (nowMs - lastFpsUpdate >= 1000) {
        const fps = Math.round((frameCount * 1000) / (nowMs - lastFpsUpdate));
        fpsSpan.textContent = fps;
        frameCount = 0;
        lastFpsUpdate = nowMs;
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);