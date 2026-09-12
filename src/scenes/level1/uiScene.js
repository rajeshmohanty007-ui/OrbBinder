import Phaser from "phaser";
import Healthbar from "../../components/Healthbar";
import SPbar from "../../components/Sheildbar";
import Calc from "../../data/logics/damageCalculator";
import status from "../../data/logics/status";
import InputManager from "../../controls/InputManager";

export default class uiScene extends Phaser.Scene {
    constructor() {
        super('uiScene');
    }
    preload() {
        this.load.spritesheet('pauseCoin', '/src/assets/UI/pauseCoin.png', { frameWidth: 32, frameHeight: 32 });
    }
    create() {
        const l = this.scale.width;
        const h = this.scale.height;
        const BeamScene = this.scene.get('BeamScene');

        //Status
        this.enemyStatus = {
            maxHP: 0,
            health: 0,
            shield: 0,
            status: [],
            element: null
        };
        this.playerStatus = {
            maxHP: 100,
            health: 100,
            shield: 0,
            status: [],
            element: null
        };
        this.hpBar = new Healthbar(this, 50, 150, 160, 10, 100);
        this.hptext = this.add.text(50, 120, "HP: 100").setOrigin(0, 0).setScrollFactor(0);
        this.spBar = new SPbar(this, 50, 160, 120, 10, 100);
        this.sptext = this.add.text(50, 135, "SP: 100").setOrigin(0, 0).setScrollFactor(0);

        // Pause Button
        this.pause = this.add.image(l * 0.04, l * 0.04, 'pauseCoin', 0);
        this.pause.setScrollFactor(0);
        this.pause.setDisplaySize(l * 0.04, l * 0.04);
        this.pause.setInteractive({ useHandCursor: true });
        this.pause.on('pointerdown', () => {
            this.scene.pause('InitialGameScene');
            this.scene.pause('BeamScene');
            this.scene.pause('uiScene');
            this.scene.launch('PauseScene');
        })
        // Coins
        this.coinContainer = this.add.rectangle(100, 28, 64, 24, 0x000000, 1);
        this.coinContainer.setOrigin(0, 0);
        this.coinCount = this.registry.get('initialCoins');
        this.coin = this.add.image(100, 40, 'pauseCoin', 1);
        this.coinText = this.add.text(124, 32, this.coinCount, { fontSize: 16 });

        this.controls = new InputManager(this);


        BeamScene.events.on('enemy-arrived', (data) => {
            this.enemyStatus = data;
            this.currentDisplayHp = data.health;
            this.currentDisplaySp = data.shield;

            // Clean up any existing instances so they can't stack
            if (this.EhpBar) this.EhpBar.destroy();
            if (this.EspBar) this.EspBar.destroy();
            if (this.enemyHpText) this.enemyHpText.destroy();
            if (this.enemySpText) this.enemySpText.destroy();

            this.EhpBar = new Healthbar(this, 672, 162, 160, 10, data.health);
            this.enemyHpText = this.add.text(672, 130, "HP: " + data.health).setOrigin(0, 0).setScrollFactor(0);
            this.EspBar = new SPbar(this, 672, 172, 120, 10, data.shield);
            this.enemySpText = this.add.text(672, 145, "SP: " + data.shield).setOrigin(0, 0).setScrollFactor(0);
        });

        BeamScene.events.on('enemy-damaged', (enemy) => {
            this.EhpBar.setHP(enemy.health);
            this.EspBar.setSP(enemy.shield);

            // Stop any existing text tweens before starting a new one
            if (this.hpTween) this.hpTween.stop();
            if (this.spTween) this.spTween.stop();

            const hpCounter = { val: this.currentDisplayHp ?? enemy.health };
            this.hpTween = this.tweens.add({
                targets: hpCounter,
                val: enemy.health,
                duration: 3900,
                ease: 'Linear',
                onUpdate: () => {
                    this.currentDisplayHp = Math.round(hpCounter.val);
                    if (this.enemyHpText && this.enemyHpText.active) {
                        this.enemyHpText.setText("HP: " + this.currentDisplayHp);
                    }
                }
            });

            const spCounter = { val: this.currentDisplaySp ?? enemy.shield };
            this.spTween = this.tweens.add({
                targets: spCounter,
                val: enemy.shield,
                duration: 3900,
                ease: 'Linear',
                onUpdate: () => {
                    this.currentDisplaySp = Math.round(spCounter.val);
                    if (this.enemySpText && this.enemySpText.active) {
                        this.enemySpText.setText("SP: " + this.currentDisplaySp);
                    }
                }
            });
        });

        BeamScene.events.on('scene-over', (coins) => {
            this.coinCount = coins;
            this.coinText.setText(this.coinCount)
            console.log("enemy died");
            this.EhpBar.destroy();
            this.EspBar.destroy();
            this.enemyHpText.destroy();
            this.enemySpText.destroy();
        })
        BeamScene.events.on('core_selected', coins => { this.coinCount = coins; this.coinText.setText(this.coinCount) });
        BeamScene.events.on('particle_selected', coins => { this.coinCount = coins; this.coinText.setText(this.coinCount) });
        BeamScene.events.on('ring_selected', coins => { this.coinCount = coins; this.coinText.setText(this.coinCount) });
    }
    update() {
        if (this.controls.jumpJustPressed) {
            this.hpBar.takeDamage(10);
        }
        if (Phaser.Input.Keyboard.JustDown(this.controls.keys.up) || Phaser.Input.Keyboard.JustDown(this.controls.keys.arrowUp)) {
            this.spBar.damage(6);
        }
    }
}