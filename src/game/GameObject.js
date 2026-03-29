export class GameObject {
    constructor(x, y, width, height, color = '#fff') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
    }

    update(deltaTime, input) {
        // переопределяется в наследниках
    }

    /**
     * Отрисовка с учётом камеры.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    draw(ctx, camera) {
        const screenPos = camera.apply(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
    }

    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
}