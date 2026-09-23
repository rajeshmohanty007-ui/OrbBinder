import Phaser from "phaser";

export default class LevelsScene extends Phaser.Scene {
    constructor() {
        super('LevelsScene');
    }

    create() {
        // Background image (loaded in StartScene)
        const bg = this.add.image(480, 270, 'bg');
        bg.setOrigin(0.5);
        bg.setDisplaySize(960, 540);

        // Dark overlay for readability
        const shade = this.add.rectangle(480, 270, 960, 540, 0x000000, 0.6);

        // Title
        const title = this.add.text(480, 81, 'SELECT LEVEL', {
            fontFamily: 'Arial',
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#ffd700',
            align: 'center'
        }).setOrigin(0.5);

        // Back Button
        const backBtn = this.add.image(60, 60, 'back');
        backBtn.setDisplaySize(48, 54);
        backBtn.setOrigin(0.5);
        backBtn.setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => {
            this.scene.start('StartScene');
        });
        backBtn.on('pointerover', () => {
            backBtn.setScale(1.1);
        });
        backBtn.on('pointerout', () => {
            backBtn.setScale(1.0);
        });

        // 2x5 Grid for Levels 1 to 10
        const cols = 5;
        const startX = 200; // Centering the 5 columns (step = 140, 480 - 2 * 140)
        const startY = 243;
        const stepX = 140;
        const stepY = 140;

        for (let i = 1; i <= 10; i++) {
            const col = (i - 1) % cols;
            const row = Math.floor((i - 1) / cols);
            const x = startX + col * stepX;
            const y = startY + row * stepY;

            const isUnlocked = i === 1 || i === 2;

            // Level Button Container
            const btnBg = this.add.rectangle(x, y, 100, 100, isUnlocked ? 0x1a2b5c : 0x2c2c2c, 0.9);
            btnBg.setStrokeStyle(3, isUnlocked ? 0xffd700 : 0x777777);
            
            const btnText = this.add.text(x, y, i.toString(), {
                fontFamily: 'Arial',
                fontSize: '32px',
                fontWeight: 'bold',
                color: isUnlocked ? '#ffffff' : '#777777'
            }).setOrigin(0.5);

            if (isUnlocked) {
                // Interactivity for unlocked levels
                btnBg.setInteractive({ useHandCursor: true });
                
                btnBg.on('pointerdown', () => {
                    if (i === 1) {
                        this.scene.start('InitialGameScene');
                    } else if (i === 2) {
                        this.scene.start('Level2Scene');
                    }
                });

                btnBg.on('pointerover', () => {
                    btnBg.setFillStyle(0x2a3d7c);
                    btnBg.setScale(1.05);
                    btnText.setScale(1.05);
                });

                btnBg.on('pointerout', () => {
                    btnBg.setFillStyle(0x1a2b5c);
                    btnBg.setScale(1);
                    btnText.setScale(1);
                });
            } else {
                // Lock Icon text indicator for locked levels (2-10)
                const lockIndicator = this.add.text(x, y + 30, 'LOCKED', {
                    fontFamily: 'Arial',
                    fontSize: '11px',
                    color: '#777777',
                    fontWeight: 'bold'
                }).setOrigin(0.5);

                btnBg.setInteractive({ useHandCursor: true });
                btnBg.on('pointerdown', () => {
                    this.showLockedFeedback(x, y);
                });
            }
        }
    }

    showLockedFeedback(x, y) {
        const feedback = this.add.text(x, y - 65, 'Locked!', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ff4444',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: feedback,
            y: y - 85,
            alpha: 0,
            duration: 800,
            onComplete: () => {
                feedback.destroy();
            }
        });
    }
}
