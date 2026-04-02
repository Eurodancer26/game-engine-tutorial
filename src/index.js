import './styles/main.scss';
import { Player } from './game/Player';
import { Enemy } from './game/Enemy';
import { Input } from './game/Input';
import { EntityManager } from './game/EntityManager';
import { Camera } from './game/Camera';
import { ControlPanel } from './ui/ControlPanel';
import { TileMap } from './game/TileMap';
import { ParticleSystem } from './game/ParticleSystem';
import { Sprite } from './game/Sprite';
import { Animation } from './game/Animation';
import { createSpriteCanvas } from './utils/createSprite';
import { SoundManager } from './game/SoundManager';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Тайловая карта ---
const tileset = { 1: '#555', 2: '#888', 3: '#aaa' };
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
const particleSystem = new ParticleSystem();
const soundManager = new SoundManager();

// --- Спрайты и анимации для игрока ---
const playerSpriteCanvas = createSpriteCanvas(50, 50, 4, (ctx, frame) => {
    if (frame === 0) {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(0, 0, 50, 50);
        ctx.fillStyle = '#000';
        ctx.fillRect(10, 20, 8, 8);
        ctx.fillRect(32, 20, 8, 8);
    } else if (frame === 1) {
        ctx.fillStyle = '#2f2';
        ctx.fillRect(0, 0, 50, 50);
        ctx.fillStyle = '#000';
        ctx.fillRect(10, 25, 8, 8);
        ctx.fillRect(32, 25, 8, 8);
    } else if (frame === 2) {
        ctx.fillStyle = '#4f4';
        ctx.fillRect(0, 0, 50, 50);
        ctx.fillStyle = '#000';
        ctx.fillRect(10, 15, 8, 8);
        ctx.fillRect(32, 15, 8, 8);
    } else if (frame === 3) {
        ctx.fillStyle = '#ff0';
        ctx.fillRect(0, 0, 50, 50);
        ctx.fillStyle = '#000';
        ctx.fillRect(10, 20, 8, 8);
        ctx.fillRect(32, 20, 8, 8);
    }
});
const playerSprite = new Sprite(playerSpriteCanvas, 50, 50);
const idleAnim = new Animation(playerSprite, [0], 0.2, true);
const runAnim = new Animation(playerSprite, [1, 2], 0.1, true);
const jumpAnim = new Animation(playerSprite, [3], 0.1, false);

// --- Игрок ---
const player = new Player(
    worldWidth / 2 - 25,
    worldHeight / 2 - 100,
    50, 50,
    300, 400, worldWidth, worldHeight,
    particleSystem,
    idleAnim, runAnim, jumpAnim,
    soundManager
);
entityManager.add(player);

// --- Спрайты и анимации для врага ---
const enemySpriteCanvas = createSpriteCanvas(40, 40, 2, (ctx, frame) => {
    if (frame === 0) {
        ctx.fillStyle = '#f00';
        ctx.fillRect(0, 0, 40, 40);
        ctx.fillStyle = '#000';
        ctx.fillRect(8, 16, 6, 6);
        ctx.fillRect(26, 16, 6, 6);
    } else {
        ctx.fillStyle = '#c00';
        ctx.fillRect(0, 0, 40, 40);
        ctx.fillStyle = '#000';
        ctx.fillRect(8, 20, 6, 6);
        ctx.fillRect(26, 20, 6, 6);
    }
});
const enemySprite = new Sprite(enemySpriteCanvas, 40, 40);
const enemyWalkAnim = new Animation(enemySprite, [0, 1], 0.2, true);

// --- Враги ---
const enemy1 = new Enemy(100, 100, 40, 40, 200, worldWidth, worldHeight, enemyWalkAnim);
entityManager.add(enemy1);
const enemy2 = new Enemy(500, 300, 40, 40, -200, worldWidth, worldHeight, enemyWalkAnim);
entityManager.add(enemy2);

const input = new Input();
const camera = new Camera(canvas.width, canvas.height, worldWidth, worldHeight);
const controlPanel = new ControlPanel(entityManager, player, canvas, camera, worldWidth, worldHeight, enemyWalkAnim);

// UI
let collisionCount = 0;
const collisionSpan = document.getElementById('collisionCount');
const fpsSpan = document.getElementById('fpsValue');
let frameCount = 0;
let lastFpsUpdate = performance.now();
let lastTime = performance.now();

function update(deltaSec) {
    entityManager.update(deltaSec, input.getState(), tileMap);
    particleSystem.update(deltaSec);
    camera.follow(player);

    const enemies = entityManager.getEntitiesByType(Enemy);
    for (const enemy of enemies) {
        if (player.collidesWith(enemy)) {
            collisionCount++;
            collisionSpan.textContent = collisionCount;
            player.color = '#ff0';
            setTimeout(() => { player.color = '#0f0'; }, 200);
            player.x = worldWidth / 2 - player.width / 2;
            player.y = worldHeight / 2 - player.height / 2;
            soundManager.playHit();

            // Эффект искр при столкновении
            const sparkX = player.x + player.width / 2;
            const sparkY = player.y + player.height / 2;
            particleSystem.createSparkCloud(sparkX, sparkY, 20);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tileMap.draw(ctx, camera);
    entityManager.draw(ctx, camera);
    particleSystem.draw(ctx, camera);
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