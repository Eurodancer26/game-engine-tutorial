import { GameObject } from './GameObject';

export class Player extends GameObject {
    constructor(x, y, width, height, speed, canvasWidth, canvasHeight) {
        super(x, y, width, height, '#0f0');
        this.speed = speed;            // горизонтальная скорость (пиксели/сек)
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Добавляем параметры физики
        this.gravity = 800;            // ускорение свободного падения (пиксели/сек²)
        this.vy = 0;                  // вертикальная скорость (пиксели/сек)
    }

    update(deltaTime, input) {
        // --- Горизонтальное управление (без изменений) ---
        let moveX = 0;
        let moveY = 0;
        if (input.ArrowLeft) moveX = -1;
        if (input.ArrowRight) moveX = 1;
        if (input.ArrowUp) moveY = -1;
        if (input.ArrowDown) moveY = 1;

        if (moveX !== 0 && moveY !== 0) {
            moveX /= Math.sqrt(2);
            moveY /= Math.sqrt(2);
        }

        this.vx = moveX * this.speed;
        // Горизонтальное движение
        this.x += this.vx * deltaTime;

        // --- Вертикальная физика (новая логика) ---
        // Применяем гравитацию: увеличиваем вертикальную скорость
        this.vy += this.gravity * deltaTime;
        // Обновляем позицию по Y
        this.y += this.vy * deltaTime;

        // --- Ограничение границами canvas ---
        // По горизонтали
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.canvasWidth) this.x = this.canvasWidth - this.width;

        // По вертикали: если касаемся пола, останавливаем падение
        if (this.y + this.height > this.canvasHeight) {
            this.y = this.canvasHeight - this.height;
            this.vy = 0;               // сбрасываем вертикальную скорость
        }
        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;               // если упёрлись в потолок (пока нет, но на будущее)
        }
    }
}