import { GameObject } from './GameObject';

export class Enemy extends GameObject {
    constructor(x, y, width, height, speed, worldWidth, worldHeight) {
        super(x, y, width, height, '#f00');
        this.speed = Math.abs(speed);
        this.vx = speed;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }

    update(deltaTime, input) {
        this.x += this.vx * deltaTime;

        if (this.x <= 0) {
            this.x = 0;
            this.vx = this.speed;
        } else if (this.x + this.width >= this.worldWidth) {
            this.x = this.worldWidth - this.width;
            this.vx = -this.speed;
        }

        if (this.y < 0) this.y = 0;
        if (this.y + this.height > this.worldHeight) this.y = this.worldHeight - this.height;
    }
}