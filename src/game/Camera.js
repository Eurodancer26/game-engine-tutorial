/**
 * Камера, определяющая видимую область мира.
 * Координаты камеры дробные для плавности, округление происходит только при отрисовке.
 */
export class Camera {
    /**
     * @param {number} width - ширина видимой области (canvas.width)
     * @param {number} height - высота видимой области (canvas.height)
     * @param {number} worldWidth - общая ширина мира
     * @param {number} worldHeight - общая высота мира
     */
    constructor(width, height, worldWidth, worldHeight) {
        this.width = width;
        this.height = height;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.x = 0;
        this.y = 0;
    }

    /**
     * Слежение за целью (игроком). Камера позиционируется так,
     * чтобы цель была в центре, но не выходила за границы мира.
     * @param {GameObject} target
     */
    follow(target) {
        let targetX = target.x + target.width / 2 - this.width / 2;
        let targetY = target.y + target.height / 2 - this.height / 2;
        this.x = Math.max(0, Math.min(targetX, this.worldWidth - this.width));
        this.y = Math.max(0, Math.min(targetY, this.worldHeight - this.height));
    }

    /**
     * Преобразует мировые координаты в экранные.
     * Округляет результат до целых пикселей для устранения дрожи.
     * @param {number} worldX
     * @param {number} worldY
     * @returns {{x: number, y: number}}
     */
    apply(worldX, worldY) {
        return {
            x: Math.round(worldX - this.x),
            y: Math.round(worldY - this.y)
        };
    }
}