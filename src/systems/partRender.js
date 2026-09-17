export default class PartRender {
    constructor(scene) {
        this.scene = scene;
    }
    refreshCore(part) {
        const l = 960;
        const h = 540;
        this.scene.coreContainer.removeAll(true);
        for (let j = 0; j < 4; j++) {
            const n = Math.floor(Math.random() * 12);
            const name = part[n];
            const elData = this.scene.data.core[name];
            const el = this.scene.add.image(j * l * 0.05, 0, 'beamSheet', name);
            el.setOrigin(0, 0);
            el.setDisplaySize(l * 0.05, l * 0.05);
            el.setInteractive({ useHandCursor: true });
            if (elData.damage >= 212) {
                this.scene.textBubbleVfx.Breathe(el);
            }
            el.on('pointerdown', () => {
                this.scene.selectionSystem.selectCore(name, el);
            })
            this.scene.coreContainer.add(el);
        }
    }
    refreshParticle(part) {
        const l = 960;
        const h = 540;
        this.scene.particleContainer.removeAll(true);
        for (let j = 0; j < 4; j++) {
            const n = Math.floor(Math.random() * 12);
            const name = part[n];
            const el = this.scene.add.image(j * l * 0.05, 0, 'beamSheet', name);
            el.setOrigin(0, 0);
            el.setDisplaySize(l * 0.05, l * 0.05);
            el.setInteractive({ useHandCursor: true });
            el.on('pointerdown', () => {
                this.scene.selectionSystem.selectParticle(name, el);
            })
            this.scene.particleContainer.add(el);
        }
    }
    refreshRing() {
        const l = 960;
        const h = 540;
        this.scene.ringContainer.removeAll(true);
        for (let i = 0; i < 3; i++) {
            const el = this.scene.add.image(i * l * 0.05, 0, 'ringUI', i);
            el.setOrigin(0, 0);
            el.setDisplaySize(l * 0.05, l * 0.05);
            el.setInteractive({ useHandCursor: true });
            el.on('pointerdown', () => {
                this.scene.selectionSystem.selectRing(this.scene.rings[i], el);
            })
            this.scene.ringContainer.add(el);
        }
    }

}