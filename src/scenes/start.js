import Phaser from "phaser";
export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    isPortrait() {
        return window.innerHeight > window.innerWidth;
    }
    rotateMsg() {
        this.add.text(
            480,
            270,
            'Rotate your device',
            { color: '#ffffffff' }
        ).setOrigin(0.5);
    }
    startUI() {
        const startBG = this.add.image(480, 270, 'bg');
        startBG.setOrigin(0.5);
        startBG.setDisplaySize(960, 540);
        const shade = this.add.rectangle(480, 270, 960, 540, 0x000000, 0.5);
        let start = this.add.image(
            480,
            270,
            'start'
        )
        start.setOrigin(0.5);
        start.setDisplaySize(192, 81)
        start.setInteractive({ useHandCursor: true });
        start.on('pointerdown', () => {
            this.scene.start('InitialGameScene');
        })
        let char = this.add.image(
            384,
            378,
            'char'
        );
        char.setOrigin(0.5);
        char.setDisplaySize(48, 54);
        let re = this.add.image(
            451.2,
            378,
            'resume'
        );
        re.setOrigin(0.5);
        re.setDisplaySize(48, 54);
        let set = this.add.image(
            518.4,
            378,
            'settings'
        );
        set.setOrigin(0.5);
        set.setDisplaySize(48, 54);
        let tr = this.add.image(
            585.6,
            378,
            'trophy'
        );
        tr.setOrigin(0.5);
        tr.setDisplaySize(48, 54);
        this.linkBtn(char, 'char');
        this.linkBtn(set, 'set');
        this.linkBtn(re, 're');
        this.linkBtn(tr, 'tr');
    }
    open(key) {
        this.mAr.forEach(e => {
            e.setVisible(false);
        })
        this.menuList[key].setVisible(true);
        this.menu.setVisible(true);
    }
    linkBtn(btn, key) {
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => {
            this.open(key);
        })
    }
    preload() {
        this.load.image("start", '/src/assets/UI/st.png');
        this.load.image("char", '/src/assets/UI/ch.png');
        this.load.image("settings", '/src/assets/UI/se.png');
        this.load.image("trophy", '/src/assets/UI/tr.png');
        this.load.image("resume", '/src/assets/UI/pl.png');
        this.load.image("back", '/src/assets/UI/back.png');
        this.load.image('bg', '/src/assets/UI/bg.png');
    }
    create() {
        this.registry.set('initialCoins', 40);
        if (this.isPortrait()) {
            this.rotateMsg();
        }
        else {
            this.startUI();
        }
        this.menu = this.add.container(0, 0);

        this.menu.setVisible(false);


        const leaderBoardMenu = this.add.rectangle(480, 270, 768, 432, 0x0319c3ff, 0.9);
        const settingsMenu = this.add.rectangle(480, 270, 768, 432, 0x0310c3ff, 0.9);
        const resumeMenu = this.add.rectangle(480, 270, 768, 432, 0x0319e3ff, 0.9);
        const charactersMenu = this.add.rectangle(480, 270, 768, 432, 0x0e19c3ff, 0.9);
        const closeBtn = this.add.image(50, 50, 'back');
        closeBtn.setDisplaySize(48, 54);
        closeBtn.setOrigin(0.5);
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => {
            this.menu.setVisible(false);
        })
        this.menuList = { tr: leaderBoardMenu, set: settingsMenu, re: resumeMenu, char: charactersMenu };
        this.mAr = [leaderBoardMenu, settingsMenu, resumeMenu, charactersMenu];
        this.menu.add([...this.mAr, closeBtn])
    }

    update() { }
}