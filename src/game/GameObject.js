/**
 * Базовый класс для всех игровых объектов.
 * Содержит общие свойства и методы.
 */
export class GameObject {
    /**
     * @param {number} x - координата X верхнего левого угла
     * @param {number} y - координата Y верхнего левого угла
     * @param {number} width - ширина объекта
     * @param {number} height - высота объекта
     * @param {string} color - цвет (CSS-формат)
     */
    constructor(x, y, width, height, color = '#fff') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.vx = 0;  // скорость по X (пиксели/сек)
        this.vy = 0;  // скорость по Y
    }

    /**
     * Обновление состояния объекта. Переопределяется в наследниках.
     * @param {number} deltaTime - время с предыдущего кадра (в секундах)
     * @param {Object} input - состояние клавиш
     */
    update(deltaTime, input) {
        // По умолчанию ничего не делаем
    }

    /**
     * Отрисовка объекта. По умолчанию рисует прямоугольник.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Проверка столкновения двух прямоугольников (AABB).
     * @param {GameObject} other
     * @returns {boolean}
     */
    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
}