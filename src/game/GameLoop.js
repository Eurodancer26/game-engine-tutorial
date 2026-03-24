/**
 * Класс, управляющий игровым циклом через requestAnimationFrame.
 * Принимает функции обновления и отрисовки, вызывает их на каждом кадре.
 */
export class GameLoop {
    /**
     * @param {Function} updateCallback - функция, которая обновляет состояние игры
     * @param {Function} drawCallback - функция, которая рисует текущее состояние
     */
    constructor(updateCallback, drawCallback) {
        this.update = updateCallback;
        this.draw = drawCallback;
        this.animationId = null; // идентификатор текущего requestAnimationFrame
    }

    /**
     * Запускает цикл.
     */
    start() {
        // Рекурсивная функция (замыкание), которая вызывает саму себя через requestAnimationFrame
        const loop = () => {
            this.update(); // обновляем логику
            this.draw();   // отрисовываем
            // Запрашиваем следующий кадр и сохраняем ID для возможной остановки
            this.animationId = requestAnimationFrame(loop);
        };
        // Первый вызов
        this.animationId = requestAnimationFrame(loop);
    }

    /**
     * Останавливает цикл.
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}