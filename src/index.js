import './styles/main.scss';
import { Player } from './game/Player';
import { Enemy } from './game/Enemy';
import { Platform } from './game/Platform';
import { Input } from './game/Input';
import { EntityManager } from './game/EntityManager';
import { Camera } from './game/Camera';
import { ControlPanel } from './ui/ControlPanel';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Размеры мира (больше canvas)
const worldWidth = 2000;
const worldHeight = 1500;

const entityManager = new EntityManager();

// Игрок (в центре мира)
const player = new Player(
    worldWidth / 2 - 25,
    worldHeight / 2 - 25,
    50, 50,
    300,   // speed
    400,   // jumpForce
    worldWidth,
    worldHeight
);
entityManager.add(player);

// Враги
const enemy1 = new Enemy(100, 100, 40, 40, 200, worldWidth, worldHeight);
entityManager.add(enemy1);
const enemy2 = new Enemy(500, 300, 40, 40, -200, worldWidth, worldHeight);
entityManager.add(enemy2);
const enemy3 = new Enemy(1200, 800, 40, 40, 150, worldWidth, worldHeight);
entityManager.add(enemy3);

// Платформы
const ground = new Platform(0, worldHeight - 40, worldWidth, 40, '#555', false);
entityManager.add(ground);
const platform1 = new Platform(200, 400, 150, 20, '#888', true);
entityManager.add(platform1);
const platform2 = new Platform(500, 300, 150, 20, '#888', true);
entityManager.add(platform2);
const platform3 = new Platform(1200, 500, 150, 20, '#888', true);
entityManager.add(platform3);

const input = new Input();

// Камера
const camera = new Camera(canvas.width, canvas.height, worldWidth, worldHeight);

// Панель управления
const controlPanel = new ControlPanel(entityManager, player, canvas, camera, worldWidth, worldHeight);

// UI
let collisionCount = 0;
const collisionSpan = document.getElementById('collisionCount');
const fpsSpan = document.getElementById('fpsValue');

let frameCount = 0;
let lastFpsUpdate = performance.now();
let lastTime = performance.now();

function update(deltaSec) {
    camera.follow(player);
    entityManager.update(deltaSec, input.getState());

    const enemies = entityManager.getEntitiesByType(Enemy);
    for (const enemy of enemies) {
        if (player.collidesWith(enemy)) {
            collisionCount++;
            collisionSpan.textContent = collisionCount;

            player.color = '#ff0';
            setTimeout(() => { player.color = '#0f0'; }, 200);

            player.x = worldWidth / 2 - player.width / 2;
            player.y = worldHeight / 2 - player.height / 2;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    entityManager.draw(ctx, camera);
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