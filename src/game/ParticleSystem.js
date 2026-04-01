import { Particle } from './Particle';

/**
 * Управляет коллекцией частиц.
 */
export class ParticleSystem {
    constructor() {
        /** @type {Particle[]} */
        this.particles = [];
    }

    /**
     * Добавляет новую частицу.
     * @param {Particle} particle
     */
    add(particle) {
        this.particles.push(particle);
    }

    /**
     * Обновляет все активные частицы, удаляет мёртвые.
     * @param {number} deltaTime
     */
    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(deltaTime);
            if (!p.active) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Отрисовывает все частицы.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    draw(ctx, camera) {
        for (const p of this.particles) {
            p.draw(ctx, camera);
        }
    }

    /**
     * Создаёт облачко пыли в заданной позиции.
     * @param {number} x - мировая X
     * @param {number} y - мировая Y
     * @param {number} count - количество частиц
     */
    createDustCloud(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 100;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 30;
            const lifetime = 0.3 + Math.random() * 0.4;
            const size = 4 + Math.random() * 6;
            const color = `hsl(${30 + Math.random() * 20}, 70%, 50%)`;
            const particle = new Particle(x, y, vx, vy, lifetime, color, size);
            this.add(particle);
        }
    }
}