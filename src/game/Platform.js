import { GameObject } from './GameObject';

/**
 * Платформа — статичный объект, на который можно вставать.
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {string} color
 * @param {boolean} oneWay - true = односторонняя (можно пройти снизу вверх), false = двусторонняя
 */
export class Platform extends GameObject {
    constructor(x, y, width, height, color = '#888', oneWay = true) {
        super(x, y, width, height, color);
        this.oneWay = oneWay;   // сохраняем свойство односторонности
    }
}