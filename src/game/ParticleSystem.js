import { Particle } from './Particle';

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    add(particle) {
        this.particles.push(particle);
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(deltaTime);
            if (!p.active) this.particles.splice(i, 1);
        }
    }

    draw(ctx, camera) {
        if (!camera) return;
        for (const p of this.particles) {
            p.draw(ctx, camera);
        }
    }

    /**
     * Создаёт облачко пыли при приземлении.
     * @param {number} x - мировая X
     * @param {number} y - мировая Y
     * @param {number} count - количество частиц
     */
    createDustCloud(x, y, count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 120;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 40;
            const lifetime = 0.4 + Math.random() * 0.5;
            const size = 6 + Math.random() * 10;
            const color = `hsl(${30 + Math.random() * 20}, 80%, 65%)`;
            this.add(new Particle(x, y, vx, vy, lifetime, color, size));
        }
    }

    /**
     * Создаёт облачко искр при столкновении с врагом.
     * @param {number} x - мировая X
     * @param {number} y - мировая Y
     * @param {number} count - количество частиц
     */
    createSparkCloud(x, y, count = 25) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 150 + Math.random() * 200;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const lifetime = 0.3 + Math.random() * 0.4;
            const size = 5 + Math.random() * 9;
            const color = `hsl(${20 + Math.random() * 40}, 100%, 70%)`;
            this.add(new Particle(x, y, vx, vy, lifetime, color, size));
        }
    }
}