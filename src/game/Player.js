/**
 * Класс игрока — управляемый объект, который может двигаться и отрисовываться.
 */
export class Player {
    /**
     * @param {number} x - начальная X-координата (верхний левый угол)
     * @param {number} y - начальная Y-координата
     * @param {number} width - ширина прямоугольника
     * @param {number} height - высота прямоугольника
     * @param {number} speed - скорость перемещения (пикселей за кадр)
     */
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    /**
     * Обновление позиции игрока на основе текущего состояния клавиш.
     * @param {Object} keys - объект с флагами нажатых клавиш (например, { ArrowUp: true })
     * @param {number} canvasWidth - ширина canvas (для ограничения)
     * @param {number} canvasHeight - высота canvas
     */
    update(keys, canvasWidth, canvasHeight) {
        // Изменяем координаты в зависимости от зажатых клавиш
        if (keys.ArrowUp) this.y -= this.speed;
        if (keys.ArrowDown) this.y += this.speed;
        if (keys.ArrowLeft) this.x -= this.speed;
        if (keys.ArrowRight) this.x += this.speed;

        // Ограничиваем, чтобы игрок не выходил за границы canvas
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
        if (this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
    }

    /**
     * Отрисовка игрока на canvas.
     * @param {CanvasRenderingContext2D} ctx - контекст 2D для рисования
     */
    draw(ctx) {
        ctx.fillStyle = '#0f0'; // ярко-зелёный цвет
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}