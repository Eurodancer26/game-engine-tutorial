import { GameObject } from './GameObject';
import { Platform } from './Platform';

export class Player extends GameObject {
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

    update(deltaTime, input, entities) {
        // Горизонтальное движение
        let moveX = 0;
        if (input.ArrowLeft) moveX = -1;
        if (input.ArrowRight) moveX = 1;
        this.vx = moveX * this.speed;
        this.x += this.vx * deltaTime;

        const platforms = entities.filter(e => e instanceof Platform);

        // Коррекция по X
        for (const platform of platforms) {
            if (this.collidesWith(platform)) {
                if (this.vx > 0) {
                    this.x = platform.x - this.width;
                } else if (this.vx < 0) {
                    this.x = platform.x + platform.width;
                }
            }
        }

        // Прыжок
        if (input.ArrowUp && this.isOnGround) {
            this.vy = -this.jumpForce;
            this.isOnGround = false;
        }

        // Вертикальное движение
        this.vy += this.gravity * deltaTime;
        this.y += this.vy * deltaTime;

        let onGround = false;
        for (const platform of platforms) {
            if (this.collidesWith(platform)) {
                if (platform.oneWay && this.vy < 0) continue;

                if (this.vy > 0) {
                    this.y = platform.y - this.height;
                    this.vy = 0;
                    onGround = true;
                } else if (this.vy < 0) {
                    this.y = platform.y + platform.height;
                    this.vy = 0;
                }
            }
        }

        // Границы мира
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > this.worldWidth) this.x = this.worldWidth - this.width;
        if (this.y + this.height > this.worldHeight) this.y = this.worldHeight - this.height;

        if (this.y + this.height >= this.worldHeight) {
            onGround = true;
        }

        this.isOnGround = onGround;
    }
}