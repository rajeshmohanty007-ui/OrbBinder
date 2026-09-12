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
        const l = this.scale.width;
        const h = this.scale.height;

        const shade = this.add.rectangle(l / 2, h / 2, 3 * l, h, 0x000000, 0.5);
        this.pauseState = false;
        this.pauseMenu = this.add.container();
        this.pauseMenu.setScrollFactor(0);
        const resume = this.add.image(l * 0.4, h * 0.5, 'resume2');
        const exit = this.add.image(l * 0.6, h * 0.5, 'exit');
        resume.setDisplaySize(l * 0.1, l * 0.1);
        exit.setDisplaySize(l * 0.1, l * 0.1);
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