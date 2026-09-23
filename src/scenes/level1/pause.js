export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }
    preload() {
        this.load.image('exit', '/src/assets/UI/exit.png');
        this.load.image('potion', '/src/assets/UI/potion.png');
        this.load.image('resume2', '/src/assets/UI/forW.png');
    }
    create() {
        const shade = this.add.rectangle(480, 270, 2880, 540, 0x000000, 0.5);
        this.pauseState = false;
        this.pauseMenu = this.add.container();
        this.pauseMenu.setScrollFactor(0);
        const resume = this.add.image(384, 270, 'resume2');
        const exit = this.add.image(576, 270, 'exit');
        resume.setDisplaySize(96, 96);
        exit.setDisplaySize(96, 96);
        resume.setInteractive({ useHandCursor: true });
        exit.setInteractive({ useHandCursor: true });
        resume.setScrollFactor(0);
        exit.setScrollFactor(0);
        resume.on('pointerdown', () => {
            this.scene.resume('InitialGameScene');
            this.scene.resume('BeamScene');
            this.scene.resume('uiScene');
            this.scene.stop('PauseScene');
        });
        exit.on('pointerdown', () => {
            this.scene.stop('BeamScene');
            this.scene.stop('InitialGameScene');
            this.scene.stop('uiScene');
            this.scene.start('StartScene');
        })
        this.pauseMenu.add([shade, resume, exit]);
    }
}