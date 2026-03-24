import { GameObject } from './GameObject';

/**
 * Класс игрока. Управляется стрелками.
 */
export class Player extends GameObject {
    /**
     * @param {number} x - начальная X
     * @param {number} y - начальная Y
     * @param {number} width - ширина
     * @param {number} height - высота
     * @param {number} speed - скорость в пикселях в секунду
     * @param {number} canvasWidth - ширина поля для ограничения
     * @param {number} canvasHeight - высота поля
     */
    constructor(x, y, width, height, speed, canvasWidth, canvasHeight) {
        // Вызываем конструктор родителя, задаём зелёный цвет
        super(x, y, width, height, '#0f0');
        this.speed = speed;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    /**
     * Обновление позиции игрока на основе ввода и deltaTime.
     * @param {number} deltaTime - время с предыдущего кадра (сек)
     * @param {Object} input - объект с флагами клавиш
     */
    update(deltaTime, input) {
        // Направление движения по осям (-1, 0, 1)
        let moveX = 0;
        let moveY = 0;
        if (input.ArrowLeft) moveX = -1;
        if (input.ArrowRight) moveX = 1;
        if (input.ArrowUp) moveY = -1;
        if (input.ArrowDown) moveY = 1;

        // Нормализация диагонального движения: если движемся по диагонали,
        // длина вектора (1,1) = √2 ≈ 1.41, делим на √2, чтобы сохранить единичную длину.
        if (moveX !== 0 && moveY !== 0) {
            moveX /= Math.sqrt(2);
            moveY /= Math.sqrt(2);
        }

        // Устанавливаем скорость по осям (пиксели/сек)
        this.vx = moveX * this.speed;
        this.vy = moveY * this.speed;

        // Перемещаем объект с учётом deltaTime (пиксели = скорость * время)
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Ограничение, чтобы игрок не выходил за пределы canvas
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > this.canvasWidth) this.x = this.canvasWidth - this.width;
        if (this.y + this.height > this.canvasHeight) this.y = this.canvasHeight - this.height;
    }
}