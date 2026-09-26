import Phaser from "phaser";
import Healthbar from "../../components/Healthbar";
import SPbar from "../../components/Sheildbar";
import InputManager from "../../controls/InputManager";
import Particles from "../../vfx/Particles";
import EnemyReact from "./EnemyReact";
import { delay } from "../../utils/delay";
import { registerBeamAnimations } from "../../Animations/BeamAnimation";

export default class InitialGameScene extends Phaser.Scene {
    constructor() {
        super('InitialGameScene');
    }
    preload() {
        this.load.image('dun-gr', '/src/assets/tiles/dun-ground.png');
        this.load.image('dun-bg', '/src/assets/tiles/bg2.png');
        this.load.spritesheet('hero', '/src/assets/sprites/warrior-sps.png', { frameWidth: 69, frameHeight: 44 });
        this.load.spritesheet('creeper', '/src/assets/sprites/creeper_sps.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('sky', '/src/assets/tiles/sky.png');
        this.load.spritesheet('ground', '/src/assets/tiles/OB_gr.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('lamp', '/src/assets/sprites/lamp.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('plant_top', '/src/assets/sprites/TallPlantTop.png', { frameWidth: 16, frameHeight: 8 });
        this.load.spritesheet('plant_bot', '/src/assets/sprites/TallPlantBottom.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('particles', '/src/assets/sprites/ParticlesSpritesheet.png', { frameWidth: 8, frameHeight: 8 });
        this.load.spritesheet('pyroSrt', '/src/assets/sprites/pyroStart.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('pyroMid', '/src/assets/sprites/pyroMid.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('pyroEnd', '/src/assets/sprites/pyroEnd.png', { frameWidth: 64, frameHeight: 64 });
    }
    async beamFire() {

        this.beamContainer = this.add.container();
        this.beamContainer.setDepth(12);

        const beamS = this.add.sprite(this.hero.x, this.hero.y - 10, 'pyroSrt');
        beamS.setOrigin(0, 0);
        beamS.setScale(0.5);
        beamS.play('startBeam1-init');
        this.beamContainer.add(beamS);

        await delay(1000);
        beamS.play('startBeam1-rep');
        for (let i = 0; i < 20; i++) {
            const el = this.add.sprite(beamS.x + 32 * (i + 1), beamS.y, 'pyroMid');
            el.setOrigin(0, 0);
            el.setScale(0.5);
            el.play('midBeam1');
            this.beamContainer.add(el);
        }
        const beamE = this.add.sprite(beamS.x + 32 * 21, beamS.y, 'pyroEnd');
        beamE.setOrigin(0, 0);
        beamE.setScale(0.5);
        beamE.play('endBeam1');
        this.beamContainer.add(beamE);
    }
    clearBeam() {
        this.beamContainer.destroy(true);
    }
    animations() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'sprint-right',
            frames: this.anims.generateFrameNumbers('hero', { start: 6, end: 11 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'creeper-idle',
            frames: this.anims.generateFrameNumbers('creeper', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'creeper-attack',
            frames: this.anims.generateFrameNumbers('creeper', { start: 3, end: 11 }),
            frameRate: 5,
            repeat: 0
        })
        registerBeamAnimations(this);
    }
    create() {
        // Initalisation
        this.particles = new Particles(this);
        this.index = 0;
        const worldWidth = 2880;
        const worldHeight = 540;

        //Sky Rendering
        this.sky = this.add.image(0, 0, 'sky');
        this.sky.setDisplaySize(960, 400);
        this.sky.setDepth(0);
        this.sky.setScrollFactor(0);
        this.sky.setOrigin(0, 0);

        //Hero Rendering
        this.animations();
        this.hero = this.physics.add.sprite(96, 216, 'hero', 0);
        this.hero.setDepth(10);
        this.hero.setScale(2);
        this.cameras.main.setRoundPixels(true);
        this.hero.play('idle');
        this.hero.setOrigin(0.5);
        this.hero.setCollideWorldBounds(true);
        this.heroState = 'idle';
        this.hero.setSize(25, 36);
        this.hero.setOffset(18, 8);

        //Ground Rendering
        this.groundGroup = this.physics.add.staticGroup();
        this.groundGroup.setDepth(2);
        const cols = 40;
        const rows = 3;
        for (let i = 0; i < cols; i++) {
            const tile = this.groundGroup.create(i * 64, 360, 'ground', 0);
            tile.setOrigin(0, 0);
            tile.refreshBody();
            tile.setSize(64, 52);
            tile.setOffset(0, 12);
        }
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const tile = this.groundGroup.create(j * 64, 424 + i * 64, 'ground', 2);
                tile.setOrigin(0, 0);
                tile.refreshBody();
            }
        }
        this.physics.add.collider(this.hero, this.groundGroup);

        //Objects Rendering
        this.objectsConstruct(this.index);
        this.particles.AmbientParticles();

        //Enemy Rendering
        this.enemy1 = this.physics.add.sprite(1920, 216, 'creeper');
        this.enemy1.play('creeper-idle');
        this.enemy1.setScale(2);
        this.enemy1.setDepth(3);
        this.physics.add.collider(this.enemy1, this.groundGroup);

        //Launching UI
        this.scene.launch('uiScene');
        this.scene.bringToTop(10);

        //Camera Setup
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(this.hero, true, 0.08, 0.08);

        //Beam Scene Events
        this.pauseState = false;
        this.camShotRunning = false;
        this.controls = new InputManager(this);
        const BeamScene = this.scene.get('BeamScene');
        BeamScene.events.off('scene-over');
        BeamScene.events.on('scene-over', () => {
            this.index++
            this.reconstruction(this.index);
            this.resetCamera();
        })
        this.enemyReact = new EnemyReact(this);
        BeamScene.events.on('Enemy-turn', () => {
            if (!this.enemy1.active) {
                this.scene.sleep('BeamScene');
                return;
            }
            this.scene.sleep('BeamScene');
            this.enemyReact.Attack(this.enemy1);
        })
        this.events.on('enemy-attack-over', () => {
            if (!this.enemy1.active) return;
            this.scene.wake('BeamScene');
            const beamscene = this.scene.get('BeamScene');
            beamscene.partRender.refresh();

        })


    }
    camShot(player, enemy) {
        const cam = this.cameras.main;
        this.pauseState = true;
        this.camShotRunning = true;
        cam.stopFollow();
        cam.pan(enemy.x, enemy.y, 600, 'Sine.easeInOut');
        cam.zoomTo(1.4, 600, 'Sine.easeInOut');
        this.time.delayedCall(700, () => {
            this.fitInCamera(player, enemy);
        })
    }
    fitInCamera(player, enemy) {
        const cam = this.cameras.main;
        const midX = (player.x + enemy.x) / 2;
        const midY = (player.y + enemy.y) / 2;
        cam.pan(midX, midY, 500, 'Sine.easeInOut');
        cam.zoomTo(1, 500, 'Sine.easeInOut');
    }
    resetCamera() {
        this.cameras.main.startFollow(this.hero, true, 0.5, 0.5);
        this.camShotRunning = false;
        this.pauseState = false;
    }
    reconstruction(index) {
        this.physics.world.setBounds(960 * index, 0, 2880, 540);
        this.cameras.main.setBounds(960 * index, 0, 2880, 540);

        this.groundGroup.clear(true, true);

        const cols = 40;
        const rows = 3;
        const grTileW = 64;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const tile = this.groundGroup.create(960 * index + j * grTileW, 360 + i * grTileW, 'ground', i == 0 ? 0 : 2);
                tile.setOrigin(0, 0);
                tile.refreshBody();
                if (i == 0) {
                    tile.setSize(64, 52);
                    tile.setOffset(0, 12);
                } else {
                    tile.setSize(64, 64);
                    tile.setOffset(0, 0);
                }
            }
        }
        this.hero.setDepth(10);

        this.enemy1 = this.physics.add.sprite(960 * (2 + index), 216, 'creeper');
        this.enemy1.play('creeper-idle');
        this.enemy1.setScale(2);
        this.physics.add.collider(this.enemy1, this.groundGroup);
        this.enemy1.setDepth(3);

        this.objectsConstruct(index);

    }
    objectsConstruct(index) {
        this.physics.world.setBounds(960 * index, 0, 2880, 540);
        this.cameras.main.setBounds(960 * index, 0, 2880, 540);
        let n = 0;

        for (let i = 1; n < 2000; i++) {
            n += Math.floor(Math.random() * 500 + 10);

            const plant = this.add.image(960 * index + n, 316, 'plant_top');
            plant.setOrigin(0, 0);
            plant.setScale(2);
            plant.setDepth(1);

            const plantBot = this.add.image(960 * index + n, 332, 'plant_bot');
            plantBot.setOrigin(0, 0);
            plantBot.setScale(2);
            plantBot.setDepth(1);

        }


    }
    update() {
        if (this.enemy1.active) {
            const distance = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, this.enemy1.x, this.enemy1.y);
            if (distance < 576 && !this.camShotRunning) {
                this.hero.setVelocityX(0);
                this.hero.play('idle');
                this.heroState = 'idle';
                this.camShot(this.hero, this.enemy1);
                this.time.delayedCall(2000, () => {
                    this.scene.launch('BeamScene');
                })
            }
        }

        if (this.pauseState) return;
        if (this.controls.isMovingRight) {
            if (this.heroState !== 'runR') {
                this.hero.setFlipX(false);
                this.hero.play('sprint-right', true);
                this.heroState = 'runR';
            }
            this.hero.setVelocityX(900);
        }
        else if (this.controls.isMovingLeft) {
            if (this.heroState !== 'runL') {
                this.hero.setFlipX(true);
                this.hero.play('sprint-right', true);
                this.heroState = 'runL'
            }
            this.hero.setVelocityX(-300);
        }
        else {
            this.hero.setVelocityX(0);
            if (this.heroState !== 'idle') {
                this.hero.setFlipX(false);
                this.hero.play('idle', true);
                this.heroState = 'idle'
            }
        }
        this.registry.set('hero-position', {
            x: this.hero.x,
            y: this.hero.y,
        })
    }
}