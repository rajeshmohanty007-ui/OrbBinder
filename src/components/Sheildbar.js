export default class SPbar {
    constructor(scene, x, y, width, height, maxSP) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.maxSP = maxSP;
        this.currentSP = maxSP;
        this.graphics = scene.add.graphics();
        this.draw();
    }
    draw() {
        this.graphics.clear();
        // Background Color
        this.graphics.fillStyle(0x2b2b2b);
        this.graphics.fillRect(this.x, this.y, this.width, this.height);
        // Filling the Value
        const spWidth = (this.currentSP / this.maxSP) * this.width;
        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillRect(this.x, this.y, spWidth, this.height);
        // Adding a Border
        this.graphics.lineStyle(2, 0xffffff);
        this.graphics.strokeRect(this.x, this.y, this.width, this.height);
    }
    setSP(value, duration = 1900) {
        const newSP = Phaser.Math.Clamp(value, 0, this.maxSP);
        this.scene.tweens.add({
            targets: this,
            currentSP: newSP,
            duration: duration,
            onUpdate: () => {
                this.draw();
            }
        })
    }
    damage(amount) {
        this.setSP(this.currentSP - amount);
    }
    destroy() {
        this.graphics.clear();
    }
}