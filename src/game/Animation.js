import { Sprite } from './Sprite';

/**
 * Управляет анимацией: последовательностью кадров, длительностью, зацикливанием.
 */
export class Animation {
    /**
     * @param {Sprite} sprite - спрайт-лист
     * @param {number[]} frames - массив индексов кадров (например, [0,1,2,1])
     * @param {number} frameDuration - длительность одного кадра в секундах
     * @param {boolean} loop - повторять ли анимацию зацикленно
     */
    constructor(sprite, frames, frameDuration, loop = true) {
        this.sprite = sprite;
        this.frames = frames;
        this.frameDuration = frameDuration;
        this.loop = loop;
        this.currentTime = 0;
        this.currentFrame = 0;
        this.playing = true;
    }

    /**
     * Обновление анимации (вызывается каждый кадр).
     * @param {number} deltaTime - время с предыдущего кадра (сек)
     */
    update(deltaTime) {
        if (!this.playing) return;
        this.currentTime += deltaTime;
        if (this.currentTime >= this.frameDuration) {
            this.currentTime = 0;
            this.currentFrame++;
            if (this.currentFrame >= this.frames.length) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.frames.length - 1;
                    this.playing = false;
                }
            }
        }
    }

    /**
     * Получить текущий индекс кадра.
     * @returns {number}
     */
    getCurrentFrame() {
        return this.frames[this.currentFrame];
    }

    /**
     * Отрисовать текущий кадр.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - экранная X
     * @param {number} y - экранная Y
     */
    draw(ctx, x, y) {
        const frame = this.getCurrentFrame();
        this.sprite.drawFrame(ctx, x, y, frame);
    }

    /**
     * Сброс анимации в начало.
     */
    reset() {
        this.currentTime = 0;
        this.currentFrame = 0;
        this.playing = true;
    }
}