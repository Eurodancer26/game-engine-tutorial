import { GameObject } from './GameObject';

/**
 * Класс врага. Движется горизонтально, отскакивая от границ мира и твёрдых тайлов.
 */
export class Enemy extends GameObject {
    /**
     * @param {number} x - начальная координата X
     * @param {number} y - начальная координата Y
     * @param {number} width - ширина
     * @param {number} height - высота
     * @param {number} speed - скорость (может быть отрицательной для начального направления)
     * @param {number} worldWidth - ширина мира
     * @param {number} worldHeight - высота мира
     */
    constructor(x, y, width, height, speed, worldWidth, worldHeight) {
        super(x, y, width, height, '#f00');
        this.speed = Math.abs(speed);
        this.vx = speed;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }

    /**
     * Обновление состояния врага с учётом тайловой карты.
     * @param {number} deltaTime
     * @param {Object} input - не используется
     * @param {Array} entities - не используется
     * @param {TileMap} tileMap - карта тайлов для коллизий
     */
    update(deltaTime, input, entities, tileMap) {
        let newX = this.x + this.vx * deltaTime;
        const collisionResult = this.resolveCollisionX(newX, this.y, this.width, this.height, tileMap);
        this.x = collisionResult.newX;
        if (collisionResult.collided) {
            this.vx = -this.vx; // меняем направление при столкновении
        }

        // Отскок от границ мира (если коллизии с тайлами не сработали)
        if (this.x <= 0) {
            this.x = 0;
            this.vx = this.speed;
        } else if (this.x + this.width >= this.worldWidth) {
            this.x = this.worldWidth - this.width;
            this.vx = -this.speed;
        }

        // Ограничение по Y (простое, чтобы не выходил за пределы)
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > this.worldHeight) this.y = this.worldHeight - this.height;
    }

    /**
     * Коррекция горизонтальной позиции с учётом коллизий с твёрдыми тайлами.
     * @param {number} newX
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {TileMap} tileMap
     * @returns {{newX: number, collided: boolean}}
     */
    resolveCollisionX(newX, y, w, h, tileMap) {
        const tileW = tileMap.tileWidth;
        const tileH = tileMap.tileHeight;
        const leftTile = Math.floor(newX / tileW);
        const rightTile = Math.floor((newX + w - 1) / tileW);
        const topTile = Math.floor(y / tileH);
        const bottomTile = Math.floor((y + h - 1) / tileH);
        let resolvedX = newX;
        let collided = false;
        for (let row = topTile; row <= bottomTile; row++) {
            for (let col = leftTile; col <= rightTile; col++) {
                const tileId = tileMap.getTileAt(col * tileW, row * tileH);
                if (tileMap.isSolidTile(tileId)) {
                    const tileLeft = col * tileW;
                    const tileRight = tileLeft + tileW;
                    if (this.vx > 0) {
                        resolvedX = tileLeft - w;
                        collided = true;
                    } else if (this.vx < 0) {
                        resolvedX = tileRight;
                        collided = true;
                    }
                }
            }
        }
        return { newX: resolvedX, collided };
    }
}