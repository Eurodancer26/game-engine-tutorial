import { GameObject } from './GameObject';

/**
 * Класс врага. Движется горизонтально, отскакивая от границ.
 */
export class Enemy extends GameObject {
    /**
     * @param {number} x - начальная X
     * @param {number} y - начальная Y
     * @param {number} width - ширина
     * @param {number} height - высота
     * @param {number} speed - скорость (может быть отрицательной для начального направления)
     * @param {number} canvasWidth - ширина поля
     * @param {number} canvasHeight - высота поля
     */
    constructor(x, y, width, height, speed, canvasWidth, canvasHeight) {
        super(x, y, width, height, '#f00');
        // Модуль скорости (всегда положительный) для отскока
        this.speed = Math.abs(speed);
        // Текущая скорость по X (со знаком, может меняться при отскоке)
        this.vx = speed;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    /**
     * Обновление позиции врага.
     * @param {number} deltaTime - время с предыдущего кадра (сек)
     * @param {Object} input - не используется, но оставляем для единообразия
     */
    update(deltaTime, input) {
        // Движение по X с учётом времени
        this.x += this.vx * deltaTime;

        // Отскок от левой границы
        if (this.x <= 0) {
            this.x = 0;
            this.vx = this.speed;          // меняем направление на положительное
        }
        // Отскок от правой границы
        else if (this.x + this.width >= this.canvasWidth) {
            this.x = this.canvasWidth - this.width;
            this.vx = -this.speed;         // меняем направление на отрицательное
        }

        // Ограничение по Y (на случай будущего вертикального движения)
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > this.canvasHeight) this.y = this.canvasHeight - this.height;
    }
}