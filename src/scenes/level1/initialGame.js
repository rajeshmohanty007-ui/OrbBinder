import Phaser from "phaser";
import Healthbar from "../../components/Healthbar";
import SPbar from "../../components/Sheildbar";
import InputManager from "../../controls/InputManager";
export default class InitialGameScene extends Phaser.Scene {
    constructor() {
        super('InitialGameScene');
    }
    preload() {
        this.load.image('dun-gr', '/src/assets/tiles/dun-ground.png');
        this.load.image('dun-bg', '/src/assets/tiles/bg2.png');
        this.load.spritesheet('hero', '/src/assets/sprites/warrior-sps.png', { frameWidth: 69, frameHeight: 44 });
        this.load.spritesheet('creeper', '/src/assets/sprites/Creeper.png', { frameWidth: 64, frameHeight: 64 });
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
    }
    create() {
        // Initalisation
        this.index = 0;
        let l = this.scale.width;
        let h = this.scale.height;
        const worldWidth = l * 3;
        const worldHeight = h;

        //BG Rendering
        const grTileW = 96;
        this.gameBG = this.add.group();
        for (let i = 0; i < 30; i++) {
            for (let j = 0; j < 5; j++) {
                const tile = this.gameBG.create(i * grTileW, j * grTileW, 'dun-bg');
                tile.setOrigin(0, 0);
                tile.setDisplaySize(grTileW, grTileW);
            }
        }
        this.gameBG.setAlpha(0.5);

        //Hero Rendering
        this.animations();
        this.hero = this.physics.add.sprite(l * 0.1, h * 0.4, 'hero', 0);
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
        const cols = 30;
        const rows = 3;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const tile = this.groundGroup.create(j * grTileW, h * 0.6 + i * grTileW, 'dun-gr');
                tile.setOrigin(0, 0);
                tile.setDisplaySize(grTileW, grTileW);
                tile.refreshBody();
            }
        }
        this.physics.add.collider(this.hero, this.groundGroup);

        //Enemy Rendering
        this.enemy1 = this.physics.add.sprite(l * 2, h * 0.4, 'creeper');
        this.enemy1.play('creeper-idle');
        this.enemy1.setScale(2);
        this.physics.add.collider(this.enemy1, this.groundGroup);

        //Launching UI
        this.scene.launch('uiScene');
        this.scene.bringToTop(10);

        //Camera Setup
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(this.hero, true, 0.08, 0.08);

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
        this.physics.world.setBounds(this.scale.width * index, 0, this.scale.width * 3, this.scale.height);
        this.cameras.main.setBounds(this.scale.width * index, 0, this.scale.width * 3, this.scale.height);

        this.groundGroup.clear(true, true);
        this.gameBG.clear(true, true);

        const l = this.scale.width;
        const h = this.scale.height;
        const cols = 30;
        const rows = 3;
        const grTileW = this.scale.width * 0.1;
        for (let i = 0; i < 30; i++) {
            for (let j = 0; j < 5; j++) {
                const tile = this.gameBG.create(this.scale.width * index + i * grTileW, j * grTileW, 'dun-bg');
                tile.setOrigin(0, 0);
                tile.setDisplaySize(grTileW, grTileW);
            }
        }
        this.gameBG.setAlpha(0.5);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const tile = this.groundGroup.create(this.scale.width * index + j * grTileW, this.scale.height * 0.6 + i * grTileW, 'dun-gr');
                tile.setOrigin(0, 0);
                tile.setDisplaySize(grTileW, grTileW);
                tile.refreshBody();
            }
        }
        this.hero.setDepth(10);

        this.enemy1 = this.physics.add.sprite(l * (2 + index), h * 0.4, 'creeper');
        this.enemy1.play('creeper-idle');
        this.enemy1.setScale(2);
        this.physics.add.collider(this.enemy1, this.groundGroup);

    }
    update() {
        if (this.enemy1.active) {
            const distance = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, this.enemy1.x, this.enemy1.y);
            if (distance < this.scale.width * 0.6 && !this.camShotRunning) {
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