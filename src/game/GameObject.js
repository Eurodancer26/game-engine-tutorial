export class GameObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {string} color - цвет по умолчанию (если нет спрайта)
     */
    constructor(x, y, width, height, color = '#fff') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        /** @type {Animation|null} */
        this.animation = null;
    }

    update(deltaTime, input) {
        // переопределяется в наследниках
    }

    /**
     * Обновление текущей анимации.
     * @param {number} deltaTime
     */
    updateAnimation(deltaTime) {
        if (this.animation) {
            this.animation.update(deltaTime);
        }
    }

    /**
     * Отрисовка объекта.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    draw(ctx, camera) {
        const screenPos = camera.apply(this.x, this.y);
        if (this.animation) {
            this.animation.draw(ctx, screenPos.x, screenPos.y);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
        }
    }

    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
}