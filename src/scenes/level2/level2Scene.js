import Phaser from "phaser";
import Healthbar from "../../components/Healthbar";
import InputManager from "../../controls/InputManager";

export default class Level2Scene extends Phaser.Scene {
    constructor() {
        super('Level2Scene');
    }

    preload() {
        // Preload assets for self-containment
        this.load.image('bg', '/src/assets/UI/bg.png');
        this.load.image('back', '/src/assets/UI/back.png');
        this.load.spritesheet('hero', '/src/assets/sprites/warrior-sps.png', { frameWidth: 69, frameHeight: 44 });
        this.load.spritesheet('dungeon-tiles', '/src/assets/tiles/TrapmoorTileset_v03.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('goal-crystal', '/src/assets/sprites/UI_crystalball.png', { frameWidth: 16, frameHeight: 16 });
    }

    animations() {
        // Register animations with unique keys if they don't already exist
        if (!this.anims.exists('hero-idle')) {
            this.anims.create({
                key: 'hero-idle',
                frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 5 }),
                frameRate: 6,
                repeat: -1
            });
        }
        if (!this.anims.exists('hero-run')) {
            this.anims.create({
                key: 'hero-run',
                frames: this.anims.generateFrameNumbers('hero', { start: 6, end: 11 }),
                frameRate: 8,
                repeat: -1
            });
        }
        if (!this.anims.exists('hero-jump')) {
            this.anims.create({
                key: 'hero-jump',
                frames: this.anims.generateFrameNumbers('hero', { start: 42, end: 44 }),
                frameRate: 6,
                repeat: 0
            });
        }
        if (!this.anims.exists('hero-fall')) {
            this.anims.create({
                key: 'hero-fall',
                frames: this.anims.generateFrameNumbers('hero', { start: 45, end: 47 }),
                frameRate: 6,
                repeat: 0
            });
        }
        if (!this.anims.exists('hero-doublejump')) {
            this.anims.create({
                key: 'hero-doublejump',
                frames: this.anims.generateFrameNumbers('hero', { start: 38, end: 41 }),
                frameRate: 12,
                repeat: 0
            });
        }
        if (!this.anims.exists('hero-climb')) {
            this.anims.create({
                key: 'hero-climb',
                frames: this.anims.generateFrameNumbers('hero', { start: 60, end: 65 }),
                frameRate: 6,
                repeat: -1
            });
        }
        if (!this.anims.exists('crystal-spin')) {
            this.anims.create({
                key: 'crystal-spin',
                frames: this.anims.generateFrameNumbers('goal-crystal', { start: 0, end: 3 }),
                frameRate: 6,
                repeat: -1
            });
        }
    }

    create() {
        this.animations();

        // 1. Level Design Background
        // Since the world is 2880px wide (60 columns * 48px), tile background horizontally 3 times
        this.bgs = this.add.group();
        for (let i = 0; i < 3; i++) {
            const bgImg = this.add.image(i * 960, 0, 'bg');
            bgImg.setOrigin(0, 0);
            bgImg.setDisplaySize(960, 540);
        }

        // 2. Physics Groups for Tilemap
        this.platforms = this.physics.add.staticGroup();
        this.ladders = this.physics.add.staticGroup();
        this.spikes = this.physics.add.staticGroup();
        this.goals = this.physics.add.staticGroup();

        // 3. Grid-based Map Layout (11 rows x 60 columns)
        // 0: Empty, 1: Top brick, 2: Left corner brick, 3: Right corner brick, 4: Center brick, L: Ladder, S: Spikes, G: Goal Chest
        const mapGrid = [
            "000000000000000000000000000000000000000000000000000000000000",
            "000000000000000000000000000000000000000000000000000000000000",
            "000000000000000000000000000000000000000000000000000000000000",
            "000000000000000000000000000000211111111111130000000000000000",
            "000000000000000000000000000000000L00000000000000021113000000",
            "000000000000000000000000000000000L00000000000000000000000000",
            "000000000021111113000000021111111L11130000000000000000000000",
            "0000000000000L000000000000000L000000000000000000000000000G00",
            "0000000000000L000000000000000L000000000000000000000000002113",
            "0000000000000L000000000000000L000000000000000000000000000000",
            "1111111111111L111111100001111L11111111111SSSSSS11111111111111"
        ];

        const tileWidth = 48;
        const tileHeight = 48;

        for (let r = 0; r < mapGrid.length; r++) {
            for (let c = 0; c < mapGrid[r].length; c++) {
                const char = mapGrid[r].charAt(c);
                const x = c * tileWidth + tileWidth / 2;
                const y = r * tileHeight + tileHeight / 2;

                if (char === '1' || char === '2' || char === '3' || char === '4') {
                    let tileIdx = 7; // default flat teal stone top
                    if (char === '2') tileIdx = 6; // left edge rock
                    else if (char === '3') tileIdx = 8; // right edge rock
                    else if (char === '4') tileIdx = 19; // center stone fill

                    const tile = this.platforms.create(x, y, 'dungeon-tiles', tileIdx);
                    tile.setDisplaySize(tileWidth, tileHeight);
                    tile.refreshBody();
                } else if (char === 'L') {
                    // Smart ladder wooden pillar selection
                    let tileIdx = 66; // default middle
                    const above = r > 0 ? mapGrid[r - 1].charAt(c) : '0';

                    if (above !== 'L') tileIdx = 54; // top wooden post cap

                    const tile = this.ladders.create(x, y, 'dungeon-tiles', tileIdx);
                    tile.setDisplaySize(tileWidth, tileHeight);
                    // Disable solid physics but keep physics body enabled for overlaps
                    tile.body.enable = true;
                } else if (char === 'S') {
                    // Spikes hazard (Purple spikes from Trapmoor)
                    const tile = this.spikes.create(x, y, 'dungeon-tiles', 74);
                    tile.setDisplaySize(tileWidth, tileHeight);
                    tile.refreshBody();
                } else if (char === 'G') {
                    // Goal Crystal Ball (Animated)
                    this.goalChest = this.physics.add.staticSprite(x, y, 'goal-crystal');
                    this.goalChest.setDisplaySize(tileWidth, tileHeight);
                    this.goalChest.refreshBody();
                    this.goalChest.play('crystal-spin');
                }
            }
        }

        // 4. Hero Character Spawning
        this.spawnX = 100;
        this.spawnY = 400;
        this.hero = this.physics.add.sprite(this.spawnX, this.spawnY, 'hero', 0);
        this.hero.setScale(2);
        this.hero.setOrigin(0.5);
        this.hero.setCollideWorldBounds(true);
        this.hero.setSize(25, 36);
        this.hero.setOffset(18, 8);

        // 5. Collisions & Overlaps
        this.physics.add.collider(this.hero, this.platforms);
        this.physics.add.overlap(this.hero, this.ladders, () => {
            this.onLadder = true;
        });
        this.physics.add.overlap(this.hero, this.spikes, () => {
            this.handleSpikesHit();
        });
        this.physics.add.overlap(this.hero, this.goalChest, () => {
            this.nearGoal = true;
        });

        // Interactive tooltip hint
        this.interactHint = this.add.text(0, 0, 'Press E to Interact', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#ffd700',
            backgroundColor: '#111111',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setDepth(20).setVisible(false);

        // 6. Camera Settings
        const totalWorldWidth = tileWidth * 60; // 2880px
        const totalWorldHeight = tileHeight * 11; // 528px (fits 540px height)
        this.physics.world.setBounds(0, 0, totalWorldWidth, totalWorldHeight);
        this.cameras.main.setBounds(0, 0, totalWorldWidth, totalWorldHeight);
        this.cameras.main.startFollow(this.hero, true, 0.1, 0.1);

        // 7. Inputs
        this.controls = new InputManager(this);

        // 8. Player Health and State Variables
        this.maxHealth = 100;
        this.health = 100;
        this.doubleJumpAvailable = true;
        this.onLadder = false;
        this.climbing = false;
        this.levelCompleted = false;

        // 9. HUD Display (Fixed to Camera)
        this.hudContainer = this.add.container(0, 0).setScrollFactor(0);

        // Health bar
        this.hpBar = new Healthbar(this, 30, 30, 160, 10, this.maxHealth);

        // HUD Level title text
        const hudTitle = this.add.text(30, 50, 'LEVEL 2: DUNGEON RUN', {
            fontFamily: 'Arial',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ffd700'
        });
        this.hudContainer.add(hudTitle);

        // Back button to level select
        const backBtn = this.add.image(910, 40, 'back');
        backBtn.setDisplaySize(38.4, 43.2);
        backBtn.setOrigin(0.5);
        backBtn.setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => {
            this.scene.start('LevelsScene');
        });
        this.hudContainer.add(backBtn);

        // 10. Pause Menu (Triggered with ESC key)
        this.isPaused = false;
        this.pauseContainer = this.add.container(480, 270).setScrollFactor(0).setVisible(false);
        const pauseBG = this.add.rectangle(0, 0, 960, 540, 0x000000, 0.6);
        const pauseText = this.add.text(0, -50, 'GAME PAUSED', {
            fontFamily: 'Arial',
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#ffd700'
        }).setOrigin(0.5);
        const resumeBtn = this.add.text(0, 20, 'Resume Game (Press P)', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        resumeBtn.on('pointerdown', () => {
            this.togglePause();
        });

        this.pauseContainer.add([pauseBG, pauseText, resumeBtn]);

        this.input.keyboard.on('keydown-P', () => {
            this.togglePause();
        });
    }

    togglePause() {
        if (this.levelCompleted) return;
        this.isPaused = !this.isPaused;
        this.pauseContainer.setVisible(this.isPaused);
        if (this.isPaused) {
            this.physics.pause();
            this.hero.anims.pause();
        } else {
            this.physics.resume();
        }
    }

    handleSpikesHit() {
        if (this.invulnerable || this.levelCompleted) return;

        // Damage Player
        this.health -= 25;
        this.hpBar.setHP(this.health);

        // Visual flash response
        this.invulnerable = true;
        this.tweens.add({
            targets: this.hero,
            alpha: 0.2,
            duration: 100,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                this.hero.setAlpha(1.0);
                this.invulnerable = false;
            }
        });

        // Check for Game Over
        if (this.health <= 0) {
            this.handleGameOver();
        } else {
            // Knock back and respawn to safety
            this.respawnPlayer();
        }
    }

    respawnPlayer() {
        this.climbing = false;
        this.hero.body.setAllowGravity(true);
        this.hero.setVelocity(0, 0);
        this.hero.setPosition(this.spawnX, this.spawnY);
    }

    handleGameOver() {
        this.physics.pause();
        this.levelCompleted = true;

        const gameOverText = this.add.text(480, 220, 'GAME OVER', {
            fontFamily: 'Arial',
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#ff3333'
        }).setOrigin(0.5).setScrollFactor(0);

        const restartText = this.add.text(480, 290, 'Click to Restart', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });

        restartText.on('pointerdown', () => {
            this.scene.restart();
        });
    }

    handleLevelClear() {
        if (this.levelCompleted) return;
        this.levelCompleted = true;
        this.physics.pause();

        // Stop crystal ball spin animation
        this.goalChest.anims.stop();
        this.goalChest.setAlpha(0.6);

        // Success panel overlay
        const clearText = this.add.text(480, 220, 'LEVEL COMPLETED!', {
            fontFamily: 'Arial',
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#ffd700'
        }).setOrigin(0.5).setScrollFactor(0);

        const nextText = this.add.text(480, 290, 'Return to Level Menu', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });

        nextText.on('pointerdown', () => {
            this.scene.start('LevelsScene');
        });
    }

    update() {
        if (this.isPaused || this.levelCompleted) return;

        // Reset frame-specific flags
        const wasOnLadder = this.onLadder;
        this.onLadder = false;

        const wasNearGoal = this.nearGoal;
        this.nearGoal = false;

        // 1. Goal Interaction Check (E key)
        if (wasNearGoal && !this.levelCompleted) {
            this.interactHint.setVisible(true);
            this.interactHint.setPosition(this.hero.x, this.hero.y - 45);
            if (this.controls.interactJustPressed) {
                this.handleLevelClear();
            }
        } else {
            this.interactHint.setVisible(false);
        }

        // 2. Ladder interaction logic
        if (wasOnLadder) {
            if (this.controls.isClimbingUp || this.controls.isClimbingDown) {
                if (!this.climbing) {
                    this.climbing = true;
                    this.hero.body.setAllowGravity(false);
                    this.hero.setVelocity(0, 0);
                }
            }
        } else {
            if (this.climbing) {
                this.climbing = false;
                this.hero.body.setAllowGravity(true);
            }
        }

        // 3. Control execution
        if (this.climbing) {
            // Climb controls
            this.hero.setVelocityX(0); // Lock horizontal velocity

            if (this.controls.isClimbingUp) {
                this.hero.setVelocityY(-150);
                this.hero.play('hero-climb', true);
            } else if (this.controls.isClimbingDown) {
                this.hero.setVelocityY(150);
                this.hero.play('hero-climb', true);
            } else {
                this.hero.setVelocityY(0);
                this.hero.anims.pause(); // Pause climb animation frame
            }

            // Let player jump off the ladder
            if (this.controls.jumpJustPressed) {
                this.climbing = false;
                this.hero.body.setAllowGravity(true);
                this.hero.setVelocityY(-400);
                this.doubleJumpAvailable = true;
                this.hero.play('hero-jump', true);
            }
        } else {
            // Standard platformer walk controls
            if (this.controls.isMovingLeft) {
                this.hero.setVelocityX(-200);
                this.hero.setFlipX(true);
                if (this.hero.body.blocked.down || this.hero.body.touching.down) {
                    this.hero.play('hero-run', true);
                }
            } else if (this.controls.isMovingRight) {
                this.hero.setVelocityX(200);
                this.hero.setFlipX(false);
                if (this.hero.body.blocked.down || this.hero.body.touching.down) {
                    this.hero.play('hero-run', true);
                }
            } else {
                this.hero.setVelocityX(0);
                if (this.hero.body.blocked.down || this.hero.body.touching.down) {
                    this.hero.play('hero-idle', true);
                }
            }

            // Jump & Double Jump controls
            const isGrounded = this.hero.body.blocked.down || this.hero.body.touching.down;
            if (isGrounded) {
                this.doubleJumpAvailable = true;
            }

            if (this.controls.jumpJustPressed) {
                if (isGrounded) {
                    this.hero.setVelocityY(-480);
                    this.hero.play('hero-jump', true);
                } else if (this.doubleJumpAvailable) {
                    this.hero.setVelocityY(-360);
                    this.hero.play('hero-doublejump', true);
                    this.doubleJumpAvailable = false;
                }
            }

            // Handle Jump & Fall animation transitions
            if (!isGrounded) {
                const currentAnim = this.hero.anims.currentAnim ? this.hero.anims.currentAnim.key : '';
                if (currentAnim !== 'hero-doublejump') {
                    if (this.hero.body.velocity.y < 0) {
                        this.hero.play('hero-jump', true);
                    } else if (this.hero.body.velocity.y > 0) {
                        this.hero.play('hero-fall', true);
                    }
                }
            }
        }

        // 4. Fall out of bounds check
        if (this.hero.y > 540) {
            this.handleSpikesHit();
        }
    }
}
