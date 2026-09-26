import Phaser from "phaser";
import Healthbar from "../../components/Healthbar";
import SPbar from "../../components/Sheildbar";
import Calc from "../../data/logics/damageCalculator";
import status from "../../data/logics/status";
import InputManager from "../../controls/InputManager";
import counter from "../../components/counter";
import { delay } from "../../utils/delay";

export default class uiScene extends Phaser.Scene {
    constructor() {
        super('uiScene');
    }
    preload() {
        this.load.spritesheet('pauseCoin', '/src/assets/UI/pauseCoin.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('AoE', '/src/assets/UI/AoE.png', { frameWidth: 64, frameHeight: 64 });
    }
    create() {
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
            shield: 100,
            status: [],
            element: null
        };
        this.hpBar = new Healthbar(this, 50, 150, 160, 10, 100);
        this.hpcounter = new counter(this, 50, 120, "HP", 100);
        this.spBar = new SPbar(this, 50, 160, 120, 10, 100);
        this.spcounter = new counter(this, 50, 135, "SP", 100);

        // Pause Button
        this.pause = this.add.image(38.4, 38.4, 'pauseCoin', 0);
        this.pause.setScrollFactor(0);
        this.pause.setDisplaySize(38.4, 38.4);
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
            this.enemyHpCounter = new counter(this, 672, 130, "HP", data.health);
            this.enemySpCounter = new counter(this, 672, 145, "SP", data.shield);

            // Clean up any existing instances so they can't stack
            if (this.EhpBar) this.EhpBar.destroy();
            if (this.EspBar) this.EspBar.destroy();

            this.EhpBar = new Healthbar(this, 672, 162, 160, 10, data.health);
            this.EspBar = new SPbar(this, 672, 172, 120, 10, data.shield);
        });

        BeamScene.events.on('enemy-damaged', async (enemy) => {
            this.enemyStatus = enemy;
            await delay(900);
            this.EhpBar.setHP(enemy.health, 1000);
            this.EspBar.setSP(enemy.shield, 1000);

            this.enemyHpCounter.setValue(enemy.health, 1000);
            this.enemySpCounter.setValue(enemy.shield, 1000);
        });

        BeamScene.events.on('scene-over', (coins) => {
            this.coinCount = coins;
            this.coinText.setText(this.coinCount)
            this.EhpBar.destroy();
            this.EspBar.destroy();
            this.enemyHpCounter.destroy();
            this.enemySpCounter.destroy();
        })
        BeamScene.events.on('core_selected', coins => { this.coinCount = coins; this.coinText.setText(this.coinCount) });
        BeamScene.events.on('particle_selected', coins => { this.coinCount = coins; this.coinText.setText(this.coinCount) });
        BeamScene.events.on('ring_selected', coins => { this.coinCount = coins; this.coinText.setText(this.coinCount) });

        const InitialGameScene = this.scene.get('InitialGameScene');
        InitialGameScene.events.on('enemy-attack', (damage) => {
            this.playerStatus.health = Math.max(0, this.playerStatus.health - damage.health);
            this.playerStatus.shield = Math.max(0, this.playerStatus.shield - damage.shield);
            this.hpBar.setHP(this.playerStatus.health, 1900);
            this.spBar.setSP(this.playerStatus.shield, 1900);
            this.hpcounter.setValue(this.playerStatus.health, 1900);
            this.spcounter.setValue(this.playerStatus.shield, 1900);
        })
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