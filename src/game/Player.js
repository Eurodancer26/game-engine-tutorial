import { GameObject } from './GameObject';

export class Player extends GameObject {
    /**
     * @param {number} x - начальная координата X
     * @param {number} y - начальная координата Y
     * @param {number} width - ширина
     * @param {number} height - высота
     * @param {number} speed - горизонтальная скорость (пиксели/сек)
     * @param {number} jumpForce - сила прыжка (отрицательная вертикальная скорость)
     * @param {number} canvasWidth - ширина поля
     * @param {number} canvasHeight - высота поля
     */
    constructor(x, y, width, height, speed, jumpForce, canvasWidth, canvasHeight) {
        super(x, y, width, height, '#0f0');
        this.speed = speed;
        this.jumpForce = jumpForce;   // сила прыжка (положительное число, будет преобразовано в отрицательную скорость)
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.gravity = 800;           // ускорение свободного падения (пиксели/сек²)
        this.vy = 0;                  // вертикальная скорость
        this.isOnGround = false;      // флаг: находится ли игрок на земле (полу/платформе)
    }

    update(deltaTime, input) {
        // --- Горизонтальное управление ---
        let moveX = 0;
        if (input.ArrowLeft) moveX = -1;
        if (input.ArrowRight) moveX = 1;

        // Нормализация диагонали (горизонталь + вертикаль) – пока только горизонталь
        // (вертикальное управление стрелкой вверх/вниз не нужно, т.к. прыжок отдельно)
        // Но если вы хотите оставить возможность ручного перемещения по вертикали (для тестов), 
        // то можно оставить, но обычно в платформерах вертикаль только от прыжка/гравитации.
        // Для простоты убираем управление по Y.
        this.vx = moveX * this.speed;
        this.x += this.vx * deltaTime;

        // --- Прыжок (только если на земле) ---
        if (input.ArrowUp && this.isOnGround) {
            this.vy = -this.jumpForce;   // задаём отрицательную скорость (вверх)
            this.isOnGround = false;     // больше не на земле
        }

        // --- Вертикальная физика ---
        this.vy += this.gravity * deltaTime;   // ускоряем вниз
        this.y += this.vy * deltaTime;         // перемещаем

        // --- Ограничение границами canvas ---
        // По горизонтали
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.canvasWidth) this.x = this.canvasWidth - this.width;

        // По вертикали
        // Пол (нижняя граница)
        if (this.y + this.height > this.canvasHeight) {
            this.y = this.canvasHeight - this.height;
            this.vy = 0;
            this.isOnGround = true;
        }
        // Потолок (верхняя граница) – опционально
        else if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
            this.isOnGround = false;
        }
        else {
            // Если не касаемся пола и не потолка, то мы в воздухе
            this.isOnGround = false;
        }
    }
}