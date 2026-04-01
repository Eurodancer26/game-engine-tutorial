/**
 * Класс, представляющий одну частицу.
 */
export class Particle {
    /**
     * @param {number} x - начальная координата X (мировые)
     * @param {number} y - начальная координата Y (мировые)
     * @param {number} vx - скорость по X (пиксели/сек)
     * @param {number} vy - скорость по Y (пиксели/сек)
     * @param {number} lifetime - время жизни в секундах
     * @param {string} color - цвет в CSS формате
     * @param {number} size - размер (ширина и высота) в пикселях
     */
    constructor(x, y, vx, vy, lifetime, color, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
        this.color = color;
        this.size = size;
        this.active = true;
    }

    /**
     * Обновление частицы.
     * @param {number} deltaTime - время с предыдущего кадра (сек)
     */
    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.active = false;
        }
    }

    /**
     * Отрисовка частицы.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    draw(ctx, camera) {
        const screenPos = camera.apply(this.x, this.y);
        const alpha = Math.min(1, this.lifetime / this.maxLifetime);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(screenPos.x, screenPos.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}