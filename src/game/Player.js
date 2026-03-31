import { GameObject } from './GameObject';

/**
 * Класс игрока. Управляется стрелками, имеет гравитацию и прыжки.
 * Использует проекцию движения (sweep) для точных коллизий.
 */
export class Player extends GameObject {
    /**
     * @param {number} x - начальная координата X (мировые)
     * @param {number} y - начальная координата Y (мировые)
     * @param {number} width - ширина
     * @param {number} height - высота
     * @param {number} speed - горизонтальная скорость (пиксели/сек)
     * @param {number} jumpForce - сила прыжка (положительная)
     * @param {number} worldWidth - ширина мира
     * @param {number} worldHeight - высота мира
     */
    constructor(x, y, width, height, speed, jumpForce, worldWidth, worldHeight) {
        super(x, y, width, height, '#0f0');
        this.speed = speed;
        this.jumpForce = jumpForce;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.gravity = 800;
        this.vy = 0;
        this.isOnGround = false;
    }

    /**
     * Обновление состояния игрока с учётом тайловой карты.
     * @param {number} deltaTime - время с предыдущего кадра (сек)
     * @param {Object} input - состояние клавиш
     * @param {Array} entities - не используется
     * @param {TileMap} tileMap - карта тайлов для коллизий
     */
    update(deltaTime, input, entities, tileMap) {
        // --- Горизонтальное движение с проекцией ---
        let moveX = 0;
        if (input.ArrowLeft) moveX = -1;
        if (input.ArrowRight) moveX = 1;
        this.vx = moveX * this.speed;
        const dx = this.vx * deltaTime;
        const newX = this.x + dx;

        // Проверяем коллизию по X до перемещения
        const xStep = this.checkCollisionX(newX, this.y, this.width, this.height, tileMap);
        this.x += xStep;

        // --- Прыжок ---
        if (input.ArrowUp && this.isOnGround) {
            this.vy = -this.jumpForce;
            this.isOnGround = false;
        }

        // --- Вертикальное движение с проекцией ---
        if (!this.isOnGround) {
            this.vy += this.gravity * deltaTime;
        } else {
            this.vy = 0;
        }
        const dy = this.vy * deltaTime;
        const newY = this.y + dy;

        const yStep = this.checkCollisionY(this.x, newY, this.width, this.height, tileMap);
        this.y += yStep;

        // Определяем, на земле ли игрок (проверяем тайл под ногами)
        if (this.vy >= 0) {
            const feetY = this.y + this.height;
            const row = Math.floor(feetY / tileMap.tileHeight);
            const col = Math.floor(this.x / tileMap.tileWidth);
            const tileBelow = tileMap.getTileAt(col * tileMap.tileWidth, row * tileMap.tileHeight);
            this.isOnGround = tileMap.isSolidTile(tileBelow);
        } else {
            this.isOnGround = false;
        }

        // --- Ограничения границами мира (страховка) ---
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > this.worldWidth) this.x = this.worldWidth - this.width;
        if (this.y + this.height > this.worldHeight) this.y = this.worldHeight - this.height;
    }

    /**
     * Проекция движения по X.
     * Возвращает реальное смещение (dx), которое безопасно.
     * @param {number} newX - желаемая новая X
     * @param {number} y - текущая Y
     * @param {number} w - ширина
     * @param {number} h - высота
     * @param {TileMap} tileMap
     * @returns {number} безопасное приращение X
     */
    checkCollisionX(newX, y, w, h, tileMap) {
        const tileW = tileMap.tileWidth;
        const tileH = tileMap.tileHeight;
        const leftTile = Math.floor(newX / tileW);
        const rightTile = Math.floor((newX + w - 1) / tileW);
        const topTile = Math.floor(y / tileH);
        const bottomTile = Math.floor((y + h - 1) / tileH);
        let move = newX - this.x;

        for (let row = topTile; row <= bottomTile; row++) {
            for (let col = leftTile; col <= rightTile; col++) {
                const tileId = tileMap.getTileAt(col * tileW, row * tileH);
                if (tileMap.isSolidTile(tileId)) {
                    const tileLeft = col * tileW;
                    const tileRight = tileLeft + tileW;
                    if (move > 0) {
                        // движение вправо
                        move = Math.min(move, tileLeft - this.x - w);
                    } else if (move < 0) {
                        // движение влево
                        move = Math.max(move, tileRight - this.x);
                    }
                }
            }
        }
        return move;
    }

    /**
     * Проекция движения по Y.
     * @param {number} x - текущая X
     * @param {number} newY - желаемая новая Y
     * @param {number} w - ширина
     * @param {number} h - высота
     * @param {TileMap} tileMap
     * @returns {number} безопасное приращение Y
     */
    checkCollisionY(x, newY, w, h, tileMap) {
        const tileW = tileMap.tileWidth;
        const tileH = tileMap.tileHeight;
        const leftTile = Math.floor(x / tileW);
        const rightTile = Math.floor((x + w - 1) / tileW);
        const topTile = Math.floor(newY / tileH);
        const bottomTile = Math.floor((newY + h - 1) / tileH);
        let move = newY - this.y;

        for (let row = topTile; row <= bottomTile; row++) {
            for (let col = leftTile; col <= rightTile; col++) {
                const tileId = tileMap.getTileAt(col * tileW, row * tileH);
                if (tileMap.isSolidTile(tileId)) {
                    const tileTop = row * tileH;
                    const tileBottom = tileTop + tileH;
                    if (move > 0) {
                        // падение
                        move = Math.min(move, tileTop - this.y - h);
                    } else if (move < 0) {
                        // подъём
                        move = Math.max(move, tileBottom - this.y);
                    }
                }
            }
        }
        return move;
    }
}