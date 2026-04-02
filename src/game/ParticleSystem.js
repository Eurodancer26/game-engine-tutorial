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
        for (const p of this.particles) {
            p.draw(ctx, camera);
        }
    }

    /**
     * Создаёт облачко пыли при приземлении.
     * @param {number} x
     * @param {number} y
     * @param {number} count
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
            this.add(new Particle(x, y, vx, vy, lifetime, color, size));
        }
    }

    /**
     * Создаёт облачко искр при столкновении с врагом.
     * @param {number} x
     * @param {number} y
     * @param {number} count
     */
    createSparkCloud(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 150;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const lifetime = 0.2 + Math.random() * 0.3;
            const size = 3 + Math.random() * 5;
            const color = `hsl(${20 + Math.random() * 40}, 100%, 60%)`; // красные/оранжевые оттенки
            this.add(new Particle(x, y, vx, vy, lifetime, color, size));
        }
    }
}