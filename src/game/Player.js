import { GameObject } from './GameObject';

export class Player extends GameObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} speed
     * @param {number} jumpForce
     * @param {number} worldWidth
     * @param {number} worldHeight
     * @param {ParticleSystem} particleSystem
     * @param {Animation} idleAnim
     * @param {Animation} runAnim
     * @param {Animation} jumpAnim
     */
    constructor(x, y, width, height, speed, jumpForce, worldWidth, worldHeight, particleSystem, idleAnim, runAnim, jumpAnim) {
        super(x, y, width, height, '#0f0');
        this.speed = speed;
        this.jumpForce = jumpForce;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.gravity = 800;
        this.vy = 0;
        this.isOnGround = false;
        this.particleSystem = particleSystem;
        this.wasOnGround = false;
        this.idleAnim = idleAnim;
        this.runAnim = runAnim;
        this.jumpAnim = jumpAnim;
        this.animation = idleAnim;
        this.lastMoveX = 0;
    }

    update(deltaTime, input, entities, tileMap) {
        // --- Горизонтальное движение ---
        let moveX = 0;
        if (input.ArrowLeft) moveX = -1;
        if (input.ArrowRight) moveX = 1;
        this.vx = moveX * this.speed;
        const dx = this.vx * deltaTime;
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
        this.y = this.moveWithSubsteps(this.y, dy, this.x, this.width, this.height, tileMap, 'y');

        // --- Определение земли ---
        if (this.vy >= 0) {
            const feetY = this.y + this.height;
            const row = Math.floor(feetY / tileMap.tileHeight);
            const col = Math.floor(this.x / tileMap.tileWidth);
            const tileBelow = tileMap.getTileAt(col * tileMap.tileWidth, row * tileMap.tileHeight);
            this.isOnGround = tileMap.isSolidTile(tileBelow);
        } else {
            this.isOnGround = false;
        }

        // --- Эффект пыли при приземлении ---
        if (!this.wasOnGround && this.isOnGround) {
            const dustX = this.x + this.width / 2;
            const dustY = this.y + this.height;
            this.particleSystem.createDustCloud(dustX, dustY, 12);
        }
        this.wasOnGround = this.isOnGround;

        // --- Выбор анимации ---
        if (!this.isOnGround) {
            if (this.animation !== this.jumpAnim) {
                this.animation = this.jumpAnim;
                this.jumpAnim.reset();
            }
        } else {
            if (moveX !== 0) {
                if (this.animation !== this.runAnim) {
                    this.animation = this.runAnim;
                }
            } else {
                if (this.animation !== this.idleAnim) {
                    this.animation = this.idleAnim;
                }
            }
        }

        // Обновляем текущую анимацию
        this.updateAnimation(deltaTime);

        // --- Ограничения границами мира ---
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > this.worldWidth) this.x = this.worldWidth - this.width;
        if (this.y + this.height > this.worldHeight) this.y = this.worldHeight - this.height;
    }

    moveWithSubsteps(start, delta, other, w, h, tileMap, axis) {
        if (delta === 0) return start;
        const steps = 4;
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
            if (collision) break;
        }
        return current;
    }

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