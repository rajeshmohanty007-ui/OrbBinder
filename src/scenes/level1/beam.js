import Phaser from "phaser";
import Calc from "../../data/logics/damageCalculator";
import status from "../../data/logics/status";
import { coinMapping } from "../../data/coinMapping";
import { delay } from "../../utils/delay";
import { registerBeamAnimations } from "../../Animations/BeamAnimation";
import SelectionSystem from "../../systems/SelectionSytem";
import { loadData } from "../../data/coinMapping";
import Shop from "../../components/Shop";


export default class BeamScene extends Phaser.Scene {
    constructor() {
        super('BeamScene');
    }

    preload() {
        this.load.spritesheet('ringUI', '/src/assets/UI/Rings.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('highlighter', '/src/assets/UI/highlighter.png');
        this.load.spritesheet('pyroSrt', '/src/assets/sprites/pyroStart.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('pyroMid', '/src/assets/sprites/pyroMid.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('pyroEnd', '/src/assets/sprites/pyroEnd.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('beamMaker', '/src/assets/UI/BeamMaker.png');
        this.load.image('refreshBtn', '/src/assets/UI/RefreshBtn.png');
        this.load.atlas('beamSheet', '/src/assets/UI/beamSheet.png', '/src/assets/UI/beamSheet.json');
    }
    async coinLoad() {
        this.data = await loadData();
        this.coinMap = await coinMapping();
    }
    refresh(part, i) {
        const l = this.scale.width;
        const h = this.scale.height;
        this.parts[i].removeAll(true);
        for (let j = 0; j < 4; j++) {
            const n = Math.floor(Math.random() * 12);
            const name = part[n];
            const el = this.add.image(j * l * 0.05, 0, 'beamSheet', name);
            el.setOrigin(0, 0);
            el.setDisplaySize(l * 0.05, l * 0.05);
            el.setInteractive({ useHandCursor: true });
            el.on('pointerdown', () => {
                (i === 0) ? this.selectionSystem.selectCore(name, el) : this.selectionSystem.selectParticle(name, el);
            })
            this.parts[i].add(el);
        }
    }
    errorMessage() {
        const msg = this.add.text(this.scale.width / 2, this.scale.height / 2, 'One item for this section is selected already', { color: '#ffffff' });
        msg.setOrigin(0.5);
        msg.setScale(2);
        this.time.delayedCall(2000, () => {
            msg.destroy();
        })
    }
    aukatMessage() {
        const msg = this.add.text(this.scale.width / 2, this.scale.height / 2, "You don't have sufficient currency", { color: '#f45369' });
        msg.setOrigin(0.5);
        msg.setScale(2);
        this.time.delayedCall(2000, () => {
            msg.destroy();
        })
    }
    clearBeam() {
        Object.keys(this.beam).forEach(key => this.beam[key] = null);
        this.beamAnimationRunning = false;
        this.midContainer.removeAll(true);
        this.refresh(this.cores, 0);
        this.refresh(this.particles, 1);
    }
    async damageHandler() {
        let damage = await Calc(this.beam.core, this.beam.particle, this.beam.ring);
        if ("attack_up" in this.playerStatus.status) damage *= 1.2;
        const shDamage = Math.min(this.enemyStatus.shield, damage * 0.3);

        this.enemyStatus.shield = Math.max(0, this.enemyStatus.shield - shDamage);
        this.enemyStatus.health = Math.max(0, this.enemyStatus.health - (damage - shDamage));

        await status(this.playerStatus, this.enemyStatus, this.beam.core, this.beam.particle);
        this.events.emit('enemy-damaged', { ...this.enemyStatus });
    }

    async beamAnimation() {
        const InitialGameScene = this.scene.get('InitialGameScene');
        if (!InitialGameScene) return;
        const cam = InitialGameScene.cameras.main;

        const heroPos = this.registry.get('hero-position');
        if (!heroPos) return;

        const screenX = (heroPos.x - cam.scrollX) * cam.zoom;
        const screenY = (heroPos.y - cam.scrollY) * cam.zoom;

        const beamContainer = this.add.container();

        const beamS = this.add.sprite(screenX + 10, screenY - 10, 'pyroSrt');
        beamS.setOrigin(0, 0);
        beamS.setScale(0.5);
        beamS.play('startBeam1-init');
        beamContainer.add(beamS);

        await delay(1000);
        beamS.play('startBeam1-rep');
        for (let i = 0; i < 20; i++) {
            const el = this.add.sprite(beamS.x + 32 * (i + 1), beamS.y, 'pyroMid');
            el.setOrigin(0, 0);
            el.setScale(0.5);
            el.play('midBeam1');
            beamContainer.add(el);
        }
        const beamE = this.add.sprite(beamS.x + 32 * 21, beamS.y, 'pyroEnd');
        beamE.setOrigin(0, 0);
        beamE.setScale(0.5);
        beamE.play('endBeam1');
        beamContainer.add(beamE);

        await this.damageHandler();

        await delay(4000);
        beamContainer.destroy(true);
        this.clearBeam()

        if (this.enemyStatus.health <= 0) {
            const gameScene = this.scene.get('InitialGameScene');
            gameScene.enemy1.destroy();
            this.coinCount += 60;
            if (this.coinCount >= 100) {
                this.scene.start('EndScene', "win");
            }
            this.events.emit('scene-over', this.coinCount);
            this.scene.stop('BeamScene');
        }

    }
    create() {
        this.cores = ["pyro", "blaze", "magma", "litho", "stone", "flora", "gale", "cyclone", "tornado", "flood", "aqua", "hydro"];
        this.particles = ["amber", "cinder", "ash", "waves", "foam", "rain", "zephyr", "gust", "draft", "leaves", "sand", "fossil"];
        this.rings = ["yellow", "purple", "black"];

        this.selectionSystem = new SelectionSystem(this);
        this.shop = new Shop(this);

        if (!this.anims.exists('startBeam1-init')) registerBeamAnimations(this);
        const l = this.scale.width;
        const h = this.scale.height;

        this.events.emit('enemy-arrived', {
            maxHP: 300,
            health: 300,
            shield: 200,
            status: [],
            element: "earth"
        })

        //Initial State
        this.coinLoad();
        this.coinCount = this.scene.get('uiScene').coinCount;
        this.beam = {
            core: null,
            particle: null,
            ring: null
        }
        this.enemyStatus = {
            maxHP: 300,
            health: 300,
            shield: 200,
            status: [],
            element: "earth"
        };
        this.playerStatus = {
            maxHP: 100,
            health: 100,
            shield: 0,
            status: [],
            element: null
        };
        // initiating Booleans
        this.enemyDead = true;
        this.coreSelected = false;
        this.particleSelected = false;
        this.ringSelected = false;
        this.beamAnimationRunning = false;

        // Beam maker logic
        this.beamMakerBG = this.add.rectangle(l * 0.01, h * 0.02, l * 0.13, l * 0.13, 0x000000, 1).setOrigin(0, 0);
        this.beamMaker = this.add.image(0, 0, 'beamMaker');
        this.beamMaker.setDisplaySize(l * 0.15, l * 0.15);
        this.beamMaker.setOrigin(0, 0);
        this.beamMakerContainer = this.add.container(l * 0.1, h * 0.65);
        this.midContainer = this.add.container(0, 0);
        this.beamMakerContainer.add(this.beamMakerBG);
        this.beamMakerContainer.add(this.midContainer);
        this.beamMakerContainer.add(this.beamMaker);

        // Adding Refresh Buttons
        this.refreshBtn = this.add.container(l * 0.35, h * 0.65);
        const refreshCore = this.add.image(0, 0, 'refreshBtn');
        refreshCore.setOrigin(0, 0);
        refreshCore.setDisplaySize(l * 0.05, l * 0.05);
        const refreshParticle = this.add.image(0, l * 0.05, 'refreshBtn');
        refreshParticle.setOrigin(0, 0);
        refreshParticle.setDisplaySize(l * 0.05, l * 0.05);
        for (let i = 0; i < 2; i++) {
            const el = (i === 0) ? refreshCore : refreshParticle;
            const part = (i === 0) ? this.cores : this.particles;
            el.setInteractive({ useHandCursor: true });
            el.on('pointerdown', () => {
                this.refresh(part, i);
            })
        }
        this.refreshBtn.add([refreshCore, refreshParticle]);

        // Adding UI elements
        this.coreContainer = this.add.container(l * 0.4, h * 0.65);
        this.particleContainer = this.add.container(l * 0.4, h * 0.65 + l * 0.05);
        this.ringContainer = this.add.container(l * 0.4, h * 0.65 + l * 0.1);
        this.parts = [this.coreContainer, this.particleContainer, this.ringContainer];
        this.refresh(this.cores, 0);
        this.refresh(this.particles, 1);
        for (let i = 0; i < 3; i++) {
            const el = this.add.image(i * l * 0.05, 0, 'ringUI', i);
            el.setOrigin(0, 0);
            el.setDisplaySize(l * 0.05, l * 0.05);
            el.setInteractive({ useHandCursor: true });
            el.on('pointerdown', () => {
                this.selectionSystem.selectRing(this.rings[i], el);
            })
            this.ringContainer.add(el);
        }

    }
    update() {
        if (!this.beamAnimationRunning && this.beam.core && this.beam.particle && this.beam.ring) {
            this.beamAnimationRunning = true;
            this.beamAnimation();
        }
    }
}