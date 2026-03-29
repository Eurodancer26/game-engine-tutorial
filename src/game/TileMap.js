/**
 * Класс для работы с тайловой картой.
 * Хранит массив тайлов, размер тайла, и умеет отрисовывать видимую область.
 */
export class TileMap {
    /**
     * @param {number} tileWidth - ширина одного тайла в пикселях
     * @param {number} tileHeight - высота одного тайла в пикселях
     * @param {number[][]} mapData - двумерный массив (строки, столбцы), где каждый элемент — ID тайла
     * @param {Object} tileset - объект, сопоставляющий ID тайла с цветом (пока просто цвет, позже можно заменить на изображения)
     */
    constructor(tileWidth, tileHeight, mapData, tileset) {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.mapData = mapData;
        this.tileset = tileset;   // например, { 0: '#000', 1: '#555', 2: '#888' }
        this.width = mapData[0].length * tileWidth;   // ширина мира в пикселях
        this.height = mapData.length * tileHeight;    // высота мира в пикселях
    }

    /**
     * Отрисовка только тех тайлов, которые видны камере.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    draw(ctx, camera) {
        // Вычисляем диапазон тайлов, попадающих в видимую область
        const startCol = Math.max(0, Math.floor(camera.x / this.tileWidth));
        const endCol = Math.min(this.mapData[0].length - 1, Math.floor((camera.x + camera.width) / this.tileWidth));
        const startRow = Math.max(0, Math.floor(camera.y / this.tileHeight));
        const endRow = Math.min(this.mapData.length - 1, Math.floor((camera.y + camera.height) / this.tileHeight));

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const tileId = this.mapData[row][col];
                if (tileId === 0) continue; // 0 = пустота, не рисуем
                const color = this.tileset[tileId];
                if (!color) continue;
                const worldX = col * this.tileWidth;
                const worldY = row * this.tileHeight;
                const screenPos = camera.apply(worldX, worldY);
                ctx.fillStyle = color;
                ctx.fillRect(screenPos.x, screenPos.y, this.tileWidth, this.tileHeight);
            }
        }
    }
}