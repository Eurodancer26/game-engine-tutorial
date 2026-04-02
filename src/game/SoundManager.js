export class SoundManager {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
    }

    async resume() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        this.initialized = true;
    }

    _ensureReady() {
        if (!this.initialized || !this.audioContext || this.audioContext.state !== 'running') {
            console.warn('AudioContext не готов. Пропускаем звук.');
            return false;
        }
        return true;
    }

    playJump() {
        if (!this._ensureReady()) return;
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.frequency.value = 523.25;
        gain.gain.value = 0.3;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
        osc.stop(now + 0.3);
    }

    playLand() {
        if (!this._ensureReady()) return;
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.frequency.value = 220;
        gain.gain.value = 0.2;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.2);
        osc.stop(now + 0.2);
    }

    playHit() {
        if (!this._ensureReady()) return;
        const now = this.audioContext.currentTime;
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(this.audioContext.destination);
        osc1.frequency.value = 200;
        gain1.gain.value = 0.4;
        osc1.start();
        gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.1);
        osc1.stop(now + 0.1);

        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(this.audioContext.destination);
        osc2.frequency.value = 250;
        gain2.gain.value = 0.4;
        osc2.start(now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
        osc2.stop(now + 0.15);
    }
}