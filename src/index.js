import './styles/main.scss';
import { Player } from './game/Player';
import { Enemy } from './game/Enemy';
import { Input } from './game/Input';
import { EntityManager } from './game/EntityManager';
import { Camera } from './game/Camera';
import { ControlPanel } from './ui/ControlPanel';
import { TileMap } from './game/TileMap';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Тайловая карта ---
const tileset = {
    1: '#555',
    2: '#888',
    3: '#aaa',
};
const mapData = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
const tileMap = new TileMap(40, 40, mapData, tileset);
const worldWidth = tileMap.width;
const worldHeight = tileMap.height;

const entityManager = new EntityManager();

// Игрок
const player = new Player(
    worldWidth / 2 - 25,
    worldHeight / 2 - 100,
    50, 50,
    300, 400, worldWidth, worldHeight
);
entityManager.add(player);

// Враги
const enemy1 = new Enemy(100, 100, 40, 40, 200, worldWidth, worldHeight);
entityManager.add(enemy1);
const enemy2 = new Enemy(500, 300, 40, 40, -200, worldWidth, worldHeight);
entityManager.add(enemy2);
// const enemy3 = new Enemy(1200, 800, 40, 40, 150, worldWidth, worldHeight);
// entityManager.add(enemy3);

const input = new Input();
const camera = new Camera(canvas.width, canvas.height, worldWidth, worldHeight);
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
    entityManager.update(deltaSec, input.getState(), tileMap);

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
    tileMap.draw(ctx, camera);
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