import Phaser from "phaser";
export default class Healthbar {
    constructor(scene, x, y, width, height, maxHP) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.maxHP = maxHP;
        this.currentHP = maxHP;
        this.graphics = scene.add.graphics();
        this.draw();
    }
    draw() {
        this.graphics.clear();

        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRect(this.x, this.y, this.width, this.height);

        const hpWidth = (this.currentHP / this.maxHP) * this.width;
        this.graphics.fillStyle(0x00ff00);
        this.graphics.fillRect(this.x, this.y, hpWidth, this.height);

        this.graphics.lineStyle(2, 0xffffff);
        this.graphics.strokeRect(this.x, this.y, this.width, this.height);
    }
    setHP(value) {
        const newHP = Phaser.Math.Clamp(value, 0, this.maxHP);

        this.scene.tweens.add({
            targets: this,
            currentHP: newHP,
            duration: 3900,
            onUpdate: () => {
                this.draw();
            }
        })
    }
    takeDamage(amount) {
        const newHP = Phaser.Math.Clamp(this.currentHP - amount, 0, this.maxHP);

        this.scene.tweens.add({
            targets: this,
            currentHP: newHP,
            duration: 4000,
            onUpdate: () => {
                this.draw();
            }
        })
    }
    destroy(){
        this.graphics.clear();
    }
}