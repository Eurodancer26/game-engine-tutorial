/**
 * Создаёт спрайт-лист программно (canvas) для демонстрации.
 * @param {number} frameWidth - ширина кадра
 * @param {number} frameHeight - высота кадра
 * @param {number} framesCount - количество кадров
 * @param {Function} drawFrame - функция отрисовки кадра (ctx, frameIndex)
 * @returns {HTMLCanvasElement}
 */
export function createSpriteCanvas(frameWidth, frameHeight, framesCount, drawFrame) {
    const canvas = document.createElement('canvas');
    canvas.width = frameWidth * framesCount;
    canvas.height = frameHeight;
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < framesCount; i++) {
        ctx.save();
        ctx.translate(i * frameWidth, 0);
        drawFrame(ctx, i);
        ctx.restore();
    }
    return canvas;
}