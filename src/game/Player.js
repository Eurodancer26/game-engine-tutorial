import { GameObject } from './GameObject';

/**
 * Класс игрока. Управляется стрелками, имеет гравитацию и прыжки.
 * Поддерживает коллизии с тайловой картой (твёрдые тайлы).
 */
export class Player extends GameObject {
    /**
     * @param {number} x - начальная координата X (мировые)
     * @param {number} y - начальная координата Y (мировые)
     * @param {number} width - ширина
     * @param {number} height - высота
     * @param {number} speed - горизонтальная скорость (пиксели/сек)
     * @param {number} jumpForce - сила прыжка (положительная, будет преобразована в отрицательную скорость)
     * @param {number} worldWidth - ширина мира
     * @param {number} worldHeight - высота мира
     */
    constructor(x, y, width, height, speed, jumpForce, worldWidth, worldHeight) {
        super(x, y, width, height, '#0f0');
        this.speed = speed;
        this.jumpForce = jumpForce;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.gravity = 800;
        this.vy = 0;
        this.isOnGround = false;
    }

    /**
     * Обновление состояния игрока с учётом тайловой карты.
     * @param {number} deltaTime - время с предыдущего кадра (сек)
     * @param {Object} input - состояние клавиш
     * @param {Array} entities - не используется
     * @param {TileMap} tileMap - карта тайлов для коллизий
     */
    update(deltaTime, input, entities, tileMap) {
        // --- Горизонтальное движение ---
        let moveX = 0;
        if (input.ArrowLeft) moveX = -1;
        if (input.ArrowRight) moveX = 1;
        this.vx = moveX * this.speed;
        let newX = this.x + this.vx * deltaTime;
        this.x = this.resolveCollisionX(newX, this.y, this.width, this.height, tileMap);

        // --- Прыжок (только если на земле) ---
        if (input.ArrowUp && this.isOnGround) {
            this.vy = -this.jumpForce;
            this.isOnGround = false;
        }

        // --- Вертикальное движение ---
        // Если игрок на земле, не добавляем гравитацию (чтобы не накапливать скорость)
        if (!this.isOnGround) {
            this.vy += this.gravity * deltaTime;
        } else {
            this.vy = 0; // явно обнуляем скорость на земле
        }

        let newY = this.y + this.vy * deltaTime;
        const yResult = this.resolveCollisionY(this.x, newY, this.width, this.height, tileMap);
        this.y = yResult.newY;
        this.vy = yResult.newVy;
        this.isOnGround = yResult.onGround;

        // Дополнительная стабилизация: если после коррекции игрок на земле, обнуляем vy ещё раз
        if (this.isOnGround) {
            this.vy = 0;
        }

        // --- Ограничения границами мира (страховка) ---
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > this.worldWidth) this.x = this.worldWidth - this.width;
        if (this.y + this.height > this.worldHeight) this.y = this.worldHeight - this.height;
    }

    /**
     * Коррекция горизонтальной позиции с учётом коллизий.
     * @param {number} newX
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {TileMap} tileMap
     * @returns {number} скорректированная X
     */
    resolveCollisionX(newX, y, w, h, tileMap) {
        const tileW = tileMap.tileWidth;
        const tileH = tileMap.tileHeight;
        const leftTile = Math.floor(newX / tileW);
        const rightTile = Math.floor((newX + w - 1) / tileW);
        const topTile = Math.floor(y / tileH);
        const bottomTile = Math.floor((y + h - 1) / tileH);
        let resolvedX = newX;
        for (let row = topTile; row <= bottomTile; row++) {
            for (let col = leftTile; col <= rightTile; col++) {
                const tileId = tileMap.getTileAt(col * tileW, row * tileH);
                if (tileMap.isSolidTile(tileId)) {
                    const tileLeft = col * tileW;
                    const tileRight = tileLeft + tileW;
                    if (this.vx > 0) {
                        resolvedX = tileLeft - w;
                    } else if (this.vx < 0) {
                        resolvedX = tileRight;
                    }
                }
            }
        }
        return resolvedX;
    }

    /**
     * Коррекция вертикальной позиции с учётом коллизий.
     * @param {number} x
     * @param {number} newY
     * @param {number} w
     * @param {number} h
     * @param {TileMap} tileMap
     * @returns {{newY: number, newVy: number, onGround: boolean}}
     */
    resolveCollisionY(x, newY, w, h, tileMap) {
        const tileW = tileMap.tileWidth;
        const tileH = tileMap.tileHeight;
        const leftTile = Math.floor(x / tileW);
        const rightTile = Math.floor((x + w - 1) / tileW);
        const topTile = Math.floor(newY / tileH);
        const bottomTile = Math.floor((newY + h - 1) / tileH);
        let resolvedY = newY;
        let onGround = false;
        let newVy = this.vy;

        for (let row = topTile; row <= bottomTile; row++) {
            for (let col = leftTile; col <= rightTile; col++) {
                const tileId = tileMap.getTileAt(col * tileW, row * tileH);
                if (tileMap.isSolidTile(tileId)) {
                    const tileTop = row * tileH;
                    const tileBottom = tileTop + tileH;
                    if (this.vy > 0) {
                        resolvedY = tileTop - h;
                        onGround = true;
                        newVy = 0;
                    } else if (this.vy < 0) {
                        resolvedY = tileBottom;
                        newVy = 0;
                    }
                }
            }
        }
        // Добавляем эпсилон, чтобы игрок не "дрожал" на границе тайла
        if (onGround && resolvedY + h <= tileMap.height) {
            resolvedY += 0.01;
        }
        return { newY: resolvedY, newVy, onGround };
    }
}