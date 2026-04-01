import { GameObject } from './GameObject';

/**
 * Класс игрока. Управляется стрелками, имеет гравитацию и прыжки.
 * Использует разбиение движения на подшаги для точных коллизий.
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
        // --- Горизонтальное движение ---
        let moveX = 0;
        if (input.ArrowLeft) moveX = -1;
        if (input.ArrowRight) moveX = 1;
        this.vx = moveX * this.speed;
        const dx = this.vx * deltaTime;
        // Разбиваем горизонтальное перемещение на подшаги
        this.x = this.moveWithSubsteps(this.x, dx, this.y, this.width, this.height, tileMap, 'x');

        // --- Прыжок ---
        if (input.ArrowUp && this.isOnGround) {
            this.vy = -this.jumpForce;
            this.isOnGround = false;
        }

        // --- Вертикальное движение ---
        if (!this.isOnGround) {
            this.vy += this.gravity * deltaTime;
        } else {
            this.vy = 0;
        }
        const dy = this.vy * deltaTime;
        // Разбиваем вертикальное перемещение на подшаги
        this.y = this.moveWithSubsteps(this.y, dy, this.x, this.width, this.height, tileMap, 'y');

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
     * Разбивает движение на подшаги, чтобы избежать пропуска коллизий.
     * @param {number} start - начальная координата (x или y)
     * @param {number} delta - полное приращение
     * @param {number} other - вторая координата (y или x) для проверки коллизий
     * @param {number} w - ширина
     * @param {number} h - высота
     * @param {TileMap} tileMap
     * @param {string} axis - 'x' или 'y'
     * @returns {number} скорректированная координата
     */
    moveWithSubsteps(start, delta, other, w, h, tileMap, axis) {
        if (delta === 0) return start;
        const steps = 4; // Количество подшагов
        const stepDelta = delta / steps;
        let current = start;
        for (let i = 0; i < steps; i++) {
            const next = current + stepDelta;
            let collision = false;
            if (axis === 'x') {
                const move = next - current;
                const corrected = this.checkCollisionX(current, next, other, w, h, tileMap, move);
                if (Math.abs(corrected - next) > 0.001) collision = true;
                current = corrected;
            } else {
                const move = next - current;
                const corrected = this.checkCollisionY(current, next, other, w, h, tileMap, move);
                if (Math.abs(corrected - next) > 0.001) collision = true;
                current = corrected;
            }
            // Если на каком-то подшаге произошла коллизия, прекращаем движение (останавливаемся)
            if (collision) break;
        }
        return current;
    }

    /**
     * Проверка коллизии по X для одного подшага.
     * @param {number} currentX - текущая X
     * @param {number} newX - желаемая X
     * @param {number} y - текущая Y
     * @param {number} w - ширина
     * @param {number} h - высота
     * @param {TileMap} tileMap
     * @param {number} move - полное приращение X
     * @returns {number} скорректированная X
     */
    checkCollisionX(currentX, newX, y, w, h, tileMap, move) {
        const tileW = tileMap.tileWidth;
        const tileH = tileMap.tileHeight;
        const leftTile = Math.floor(newX / tileW);
        const rightTile = Math.floor((newX + w - 1) / tileW);
        const topTile = Math.floor(y / tileH);
        const bottomTile = Math.floor((y + h - 1) / tileH);
        let resolvedX = newX;

        for (let row = topTile; row <= bottomTile; row++) {
            for (let col = leftTile; col <= rightTile; col++) {
                const tileId = tileMap.getTileAt(col * tileW, row * tileH);
                if (tileMap.isSolidTile(tileId)) {
                    const tileLeft = col * tileW;
                    const tileRight = tileLeft + tileW;
                    if (move > 0) {
                        resolvedX = Math.min(resolvedX, tileLeft - w);
                    } else if (move < 0) {
                        resolvedX = Math.max(resolvedX, tileRight);
                    }
                }
            }
        }
        return resolvedX;
    }

    /**
     * Проверка коллизии по Y для одного подшага.
     * @param {number} currentY - текущая Y
     * @param {number} newY - желаемая Y
     * @param {number} x - текущая X
     * @param {number} w - ширина
     * @param {number} h - высота
     * @param {TileMap} tileMap
     * @param {number} move - полное приращение Y
     * @returns {number} скорректированная Y
     */
    checkCollisionY(currentY, newY, x, w, h, tileMap, move) {
        const tileW = tileMap.tileWidth;
        const tileH = tileMap.tileHeight;
        const leftTile = Math.floor(x / tileW);
        const rightTile = Math.floor((x + w - 1) / tileW);
        const topTile = Math.floor(newY / tileH);
        const bottomTile = Math.floor((newY + h - 1) / tileH);
        let resolvedY = newY;

        for (let row = topTile; row <= bottomTile; row++) {
            for (let col = leftTile; col <= rightTile; col++) {
                const tileId = tileMap.getTileAt(col * tileW, row * tileH);
                if (tileMap.isSolidTile(tileId)) {
                    const tileTop = row * tileH;
                    const tileBottom = tileTop + tileH;
                    if (move > 0) {
                        resolvedY = Math.min(resolvedY, tileTop - h);
                    } else if (move < 0) {
                        resolvedY = Math.max(resolvedY, tileBottom);
                    }
                }
            }
        }
        return resolvedY;
    }
}