import { GameObject } from './GameObject';

/**
 * Класс врага. Движется горизонтально, отскакивая от границ мира и твёрдых тайлов.
 * Поддерживает анимацию ходьбы и флип спрайта.
 */
export class Enemy extends GameObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} speed - скорость (может быть отрицательной для начального направления)
     * @param {number} worldWidth
     * @param {number} worldHeight
     * @param {Animation} walkAnim - анимация ходьбы (может быть null для отображения цветом)
     */
    constructor(x, y, width, height, speed, worldWidth, worldHeight, walkAnim) {
        super(x, y, width, height, '#f00');
        this.speed = Math.abs(speed);
        this.vx = speed;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.animation = walkAnim;
        this.flipX = (speed < 0);
        if (this.animation) this.animation.setFlipX(this.flipX);
    }

    update(deltaTime, input, entities, tileMap) {
        let newX = this.x + this.vx * deltaTime;
        const collisionResult = this.resolveCollisionX(newX, this.y, this.width, this.height, tileMap);
        this.x = collisionResult.newX;
        if (collisionResult.collided) {
            this.vx = -this.vx;
            this.flipX = (this.vx < 0);
            if (this.animation) this.animation.setFlipX(this.flipX);
        }

        if (this.x <= 0) {
            this.x = 0;
            this.vx = this.speed;
            this.flipX = false;
            if (this.animation) this.animation.setFlipX(this.flipX);
        } else if (this.x + this.width >= this.worldWidth) {
            this.x = this.worldWidth - this.width;
            this.vx = -this.speed;
            this.flipX = true;
            if (this.animation) this.animation.setFlipX(this.flipX);
        }

        if (this.y < 0) this.y = 0;
        if (this.y + this.height > this.worldHeight) this.y = this.worldHeight - this.height;

        this.updateAnimation(deltaTime);
    }

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