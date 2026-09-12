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
            this.scale.width / 2,
            this.scale.height / 2,
            'Rotate your device',
            { color: '#ffffffff' }
        ).setOrigin(0.5);
    }
    startUI() {
        const l = this.scale.width;
        const b = this.scale.height;
        const startBG = this.add.image(l / 2, b / 2, 'bg');
        startBG.setOrigin(0.5);
        startBG.setDisplaySize(l, b);
        const shade = this.add.rectangle(l / 2, b / 2, l, b, 0x000000, 0.5);
        let start = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            'start'
        )
        start.setOrigin(0.5);
        start.setDisplaySize(l * 0.2, b * 0.15)
        start.setInteractive({ useHandCursor: true });
        start.on('pointerdown', () => {
            this.scene.start('InitialGameScene');
        })
        let char = this.add.image(
            l * 0.4,
            b * 0.7,
            'char'
        );
        char.setOrigin(0.5);
        char.setDisplaySize(l * 0.05, b * 0.1);
        let re = this.add.image(
            l * 0.47,
            b * 0.7,
            'resume'
        );
        re.setOrigin(0.5);
        re.setDisplaySize(l * 0.05, b * 0.1);
        let set = this.add.image(
            l * 0.54,
            b * 0.7,
            'settings'
        );
        set.setOrigin(0.5);
        set.setDisplaySize(l * 0.05, b * 0.1);
        let tr = this.add.image(
            l * 0.61,
            b * 0.7,
            'trophy'
        );
        tr.setOrigin(0.5);
        tr.setDisplaySize(l * 0.05, b * 0.1);
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
        const l = this.scale.width;
        const b = this.scale.height;
        if (this.isPortrait()) {
            this.rotateMsg();
        }
        else {
            this.startUI();
        }
        this.menu = this.add.container(0, 0);

        this.menu.setVisible(false);


        const leaderBoardMenu = this.add.rectangle(l / 2, b / 2, l * 0.8, b * 0.8, 0x0319c3ff, 0.9);
        const settingsMenu = this.add.rectangle(l / 2, b / 2, l * 0.8, b * 0.8, 0x0310c3ff, 0.9);
        const resumeMenu = this.add.rectangle(l / 2, b / 2, l * 0.8, b * 0.8, 0x0319e3ff, 0.9);
        const charactersMenu = this.add.rectangle(l / 2, b / 2, l * 0.8, b * 0.8, 0x0e19c3ff, 0.9);
        const closeBtn = this.add.image(50, 50, 'back');
        closeBtn.setDisplaySize(l * 0.05, b * 0.1);
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