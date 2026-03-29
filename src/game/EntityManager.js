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

    update(deltaTime, input) {
        const allEntities = this.getAllEntities();
        for (const entity of this.entities) {
            if (entity.update) {
                entity.update(deltaTime, input, allEntities);
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