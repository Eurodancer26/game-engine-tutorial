/**
 * Класс для работы со спрайт-листом (изображение, разбитое на кадры).
 */
export class Sprite {
    /**
     * @param {HTMLImageElement|HTMLCanvasElement} image - изображение или canvas
     * @param {number} frameWidth - ширина одного кадра в пикселях
     * @param {number} frameHeight - высота одного кадра в пикселях
     */
    constructor(image, frameWidth, frameHeight) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.columns = image.width / frameWidth; // количество кадров по горизонтали
    }

    /**
     * Отрисовка конкретного кадра без отражения.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - экранная координата X
     * @param {number} y - экранная координата Y
     * @param {number} frameIndex - индекс кадра (0,1,2...)
     */
    drawFrame(ctx, x, y, frameIndex) {
        const col = frameIndex % this.columns;
        const row = Math.floor(frameIndex / this.columns);
        const sx = col * this.frameWidth;
        const sy = row * this.frameHeight;
        ctx.drawImage(
            this.image,
            sx, sy, this.frameWidth, this.frameHeight,
            x, y, this.frameWidth, this.frameHeight
        );
    }

    /**
     * Отрисовка кадра с горизонтальным отражением (flipX).
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - экранная координата X
     * @param {number} y - экранная координата Y
     * @param {number} frameIndex - индекс кадра
     */
    drawFrameFlipped(ctx, x, y, frameIndex) {
        ctx.save();
        ctx.translate(x + this.frameWidth, y);
        ctx.scale(-1, 1);
        this.drawFrame(ctx, 0, 0, frameIndex);
        ctx.restore();
    }
}