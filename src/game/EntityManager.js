/**
 * Управляет коллекцией игровых объектов.
 */
export class EntityManager {
    constructor() {
        this.entities = [];
    }

    add(entity) {
        this.entities.push(entity);
    }

    remove(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) this.entities.splice(index, 1);
    }

    /**
     * Обновляет все объекты.
     * @param {number} deltaTime - время с предыдущего кадра (сек)
     * @param {Object} input - состояние клавиш
     */
    update(deltaTime, input) {
        for (const entity of this.entities) {
            if (entity.update) {
                entity.update(deltaTime, input);
            }
        }
    }

    /**
     * Отрисовывает все объекты.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        for (const entity of this.entities) {
            if (entity.draw) {
                entity.draw(ctx);
            }
        }
    }

    /**
     * Возвращает массив объектов определённого типа.
     * @param {Function} type - класс (например, Enemy)
     */
    getEntitiesByType(type) {
        return this.entities.filter(entity => entity instanceof type);
    }
}