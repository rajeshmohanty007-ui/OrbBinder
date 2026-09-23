import Phaser from "phaser";

export default class Particles {
    constructor(scene) {
        this.scene = scene;
    }
    Explosion(x, y) {
        const emitter = this.scene.add.particles(x, y, 'particles', {
            frame: 0,
            speed: 100,
            scale: 0.2,
            lifespan: 500,
            quantity: 20,
            blendMode: 'ADD',
        });
        emitter.emitParticle(10);
        setTimeout(() => {
            emitter.destroy();
        }, 500);
    }
    Smoke(x, y) {
        const emitter = this.scene.add.particles(x, y, 'particles', {
            frame: 1,
            speed: 100,
            scale: 0.2,
            lifespan: 500,
            quantity: 20,
            blendMode: 'ADD',
        });
        emitter.emitParticle(10);
        setTimeout(() => {
            emitter.destroy();
        }, 500);
    }
    AmbientParticles(x, y) {

        const ambientParticles = this.scene.add.particles(0, 0, 'particles', {
            frame: [0, 1, 2, 3], // Randomly picks from the 4 frames
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Rectangle(0, 150, 2880, 250) // Floating area above ground
            },
            speedY: { min: -20, max: -5 },      // Gentle upward drift
            speedX: { min: -10, max: 10 },
            scale: { start: 1.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: { min: 2500, max: 4000 },
            frequency: 150,                     // Spawns every 150ms
            blendMode: 'ADD'                    // Glowing effect
        });
        ambientParticles.setDepth(3);           // Set depth between background and hero

    }
}