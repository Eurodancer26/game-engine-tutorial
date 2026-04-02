/**
 * Класс для работы с тайловой картой.
 * Хранит массив тайлов, размер тайла, и умеет отрисовывать видимую область,
 * а также проверять коллизии с твёрдыми тайлами.
 */
export class TileMap {
    /**
     * @param {number} tileWidth - ширина одного тайла в пикселях
     * @param {number} tileHeight - высота одного тайла в пикселях
     * @param {number[][]} mapData - двумерный массив (строки, столбцы), где каждый элемент — ID тайла
     * @param {Object} tileset - объект, сопоставляющий ID тайла с цветом (позже можно заменить на изображения)
     * @param {Set<number>} solidTiles - множество ID твёрдых тайлов (по умолчанию {1,2,3})
     */
    constructor(tileWidth, tileHeight, mapData, tileset, solidTiles = new Set([1, 2, 3])) {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.mapData = mapData;
        this.tileset = tileset;
        this.solidTiles = solidTiles;
        this.width = mapData[0].length * tileWidth;
        this.height = mapData.length * tileHeight;
    }

    /**
     * Отрисовка только тех тайлов, которые видны камере.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    draw(ctx, camera) {
        const startCol = Math.max(0, Math.floor(camera.x / this.tileWidth));
        const endCol = Math.min(this.mapData[0].length - 1, Math.floor((camera.x + camera.width) / this.tileWidth));
        const startRow = Math.max(0, Math.floor(camera.y / this.tileHeight));
        const endRow = Math.min(this.mapData.length - 1, Math.floor((camera.y + camera.height) / this.tileHeight));

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const tileId = this.mapData[row][col];
                if (tileId === 0) continue;
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

    /**
     * Возвращает ID тайла по мировым координатам (пиксели).
     * @param {number} worldX
     * @param {number} worldY
     * @returns {number} ID тайла (0, если вне границ)
     */
    getTileAt(worldX, worldY) {
        const col = Math.floor(worldX / this.tileWidth);
        const row = Math.floor(worldY / this.tileHeight);
        if (row < 0 || row >= this.mapData.length || col < 0 || col >= this.mapData[0].length) {
            return 0;
        }
        return this.mapData[row][col];
    }

    /**
     * Устанавливает ID тайла в указанных мировых координатах.
     * @param {number} worldX
     * @param {number} worldY
     * @param {number} tileId - ID тайла (0 для стирания)
     * @returns {boolean} true, если координаты в пределах карты
     */
    setTileAt(worldX, worldY, tileId) {
        const col = Math.floor(worldX / this.tileWidth);
        const row = Math.floor(worldY / this.tileHeight);
        if (row < 0 || row >= this.mapData.length || col < 0 || col >= this.mapData[0].length) {
            return false;
        }
        this.mapData[row][col] = tileId;
        return true;
    }

    /**
     * Проверяет, является ли тайл твёрдым (препятствием).
     * @param {number} tileId
     * @returns {boolean}
     */
    isSolidTile(tileId) {
        return this.solidTiles.has(tileId);
    }

    /**
     * Проверяет, пересекается ли прямоугольник с твёрдыми тайлами.
     * @param {number} x - левый верхний угол прямоугольника (мировые координаты)
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {boolean} true, если есть пересечение с любым твёрдым тайлом
     */
    collidesWithSolid(x, y, width, height) {
        const startCol = Math.floor(x / this.tileWidth);
        const endCol = Math.floor((x + width - 1) / this.tileWidth);
        const startRow = Math.floor(y / this.tileHeight);
        const endRow = Math.floor((y + height - 1) / this.tileHeight);

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                if (row < 0 || row >= this.mapData.length || col < 0 || col >= this.mapData[0].length) continue;
                const tileId = this.mapData[row][col];
                if (this.isSolidTile(tileId)) return true;
            }
        }
        return false;
    }
}