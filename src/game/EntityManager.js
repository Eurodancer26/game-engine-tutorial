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

    getAllEntities() {
        return [...this.entities];
    }

    /**
     * Обновляет все сущности.
     * @param {number} deltaTime
     * @param {Object} input
     * @param {TileMap} tileMap - карта тайлов для коллизий
     */
    update(deltaTime, input, tileMap) {
        const allEntities = this.getAllEntities();
        for (const entity of this.entities) {
            if (entity.update) {
                // Передаём tileMap всем объектам (игроку и врагам)
                entity.update(deltaTime, input, allEntities, tileMap);
            }
        }
    }

    draw(ctx, camera) {
        for (const entity of this.entities) {
            if (entity.draw) {
                entity.draw(ctx, camera);
            }
        }
    }

    getEntitiesByType(type) {
        return this.entities.filter(entity => entity instanceof type);
    }
}