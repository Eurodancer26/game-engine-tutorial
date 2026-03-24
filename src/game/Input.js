/**
 * Класс для отслеживания состояния клавиатуры.
 */
export class Input {
    constructor() {
        // Объект, где ключ — название клавиши, значение — нажата ли
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        if (this.keys.hasOwnProperty(e.key)) {
            this.keys[e.key] = true;
            e.preventDefault(); // Отключаем прокрутку страницы стрелками
        }
    }

    handleKeyUp(e) {
        if (this.keys.hasOwnProperty(e.key)) {
            this.keys[e.key] = false;
            e.preventDefault();
        }
    }

    getState() {
        return { ...this.keys }; // Возвращаем копию, чтобы внешний код не мог изменить внутреннее состояние
    }
}