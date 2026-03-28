import { GameObject } from './GameObject';
import { Platform } from './Platform';

export class Player extends GameObject {
    constructor(x, y, width, height, speed, jumpForce, canvasWidth, canvasHeight) {
        super(x, y, width, height, '#0f0');
        this.speed = speed;
        this.jumpForce = jumpForce;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.gravity = 800;
        this.vy = 0;
        this.isOnGround = false;
    }

    /**
     * Обновление игрока.
     * @param {number} deltaTime - время в секундах с прошлого кадра
     * @param {Object} input - состояние клавиш
     * @param {Array} entities - все объекты в игре (нужны для поиска платформ)
     */
    update(deltaTime, input, entities) {
        // --- 1. Горизонтальное движение ---
        let moveX = 0;
        if (input.ArrowLeft) moveX = -1;
        if (input.ArrowRight) moveX = 1;
        this.vx = moveX * this.speed;
        this.x += this.vx * deltaTime;

        // Получаем все платформы из списка сущностей
        const platforms = entities.filter(e => e instanceof Platform);

        // Коррекция по X: если столкнулись с платформой, отодвигаем
        for (const platform of platforms) {
            if (this.collidesWith(platform)) {
                if (this.vx > 0) {
                    // Двигались вправо -> прижимаем к левому краю платформы
                    this.x = platform.x - this.width;
                } else if (this.vx < 0) {
                    // Двигались влево -> прижимаем к правому краю
                    this.x = platform.x + platform.width;
                }
                // Если vx === 0, то игрок уже стоит вплотную, ничего не делаем
            }
        }

        // --- 2. Прыжок ---
        if (input.ArrowUp && this.isOnGround) {
            this.vy = -this.jumpForce;
            this.isOnGround = false;
        }

        // --- 3. Вертикальное движение ---
        this.vy += this.gravity * deltaTime;
        this.y += this.vy * deltaTime;

        let onGround = false;
        // Проверка столкновений по Y
        for (const platform of platforms) {
            if (this.collidesWith(platform)) {
                if (this.vy > 0) {
                    // Падаем вниз -> ставим на платформу
                    this.y = platform.y - this.height;
                    this.vy = 0;
                    onGround = true;
                } else if (this.vy < 0) {
                    // Поднимаемся вверх -> ударяемся головой
                    this.y = platform.y + platform.height;
                    this.vy = 0;
                }
            }
        }

        // --- 4. Ограничения границами canvas ---
        // Горизонталь
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.canvasWidth) this.x = this.canvasWidth - this.width;

        // Нижняя граница (пол)
        if (this.y + this.height > this.canvasHeight) {
            this.y = this.canvasHeight - this.height;
            this.vy = 0;
            onGround = true;
        }
        // Верхняя граница (потолок)
        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
            onGround = false;
        }

        this.isOnGround = onGround;
    }
}