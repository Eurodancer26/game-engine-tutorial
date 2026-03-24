/**
 * Класс для отслеживания состояния клавиатуры.
 * Сохраняет текущее состояние нужных клавиш и обрабатывает события keydown/keyup.
 */
export class Input {
    constructor() {
        // Объект, где ключи — названия клавиш, значения — boolean (нажата/не нажата)
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };

        // Привязываем обработчики событий к окну
        // Используем bind или стрелочные функции, чтобы сохранить контекст this
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    /**
     * Обработчик нажатия клавиши.
     * @param {KeyboardEvent} e
     */
    handleKeyDown(e) {
        // Проверяем, есть ли такая клавиша в нашем объекте keys
        if (this.keys.hasOwnProperty(e.key)) {
            this.keys[e.key] = true;
            // Предотвращаем стандартное поведение браузера (например, прокрутку страницы стрелками)
            e.preventDefault();
        }
    }

    /**
     * Обработчик отпускания клавиши.
     * @param {KeyboardEvent} e
     */
    handleKeyUp(e) {
        if (this.keys.hasOwnProperty(e.key)) {
            this.keys[e.key] = false;
            e.preventDefault();
        }
    }

    /**
     * Возвращает текущее состояние клавиш.
     * @returns {Object} копия объекта keys (чтобы внешний код не мог изменить напрямую)
     */
    getState() {
        return { ...this.keys }; // возвращаем поверхностную копию
    }
}