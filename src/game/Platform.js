import { GameObject } from './GameObject';

/**
 * Платформа — статичный объект, на который можно встать.
 * Не имеет собственной логики движения (vx, vy = 0), только коллизия и отрисовка.
 */
export class Platform extends GameObject {
    /**
     * @param {number} x - координата X верхнего левого угла
     * @param {number} y - координата Y верхнего левого угла
     * @param {number} width - ширина
     * @param {number} height - высота
     * @param {string} color - цвет платформы (по умолчанию серый)
     */
    constructor(x, y, width, height, color = '#888') {
        super(x, y, width, height, color);
        // Платформы не двигаются, поэтому vx, vy остаются 0 (уже установлены в родителе)
    }

    // Метод update не переопределяем — он остаётся пустым из GameObject
}