import Phaser from "phaser";
export default class counter {
    constructor(scene, x, y, name, value) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.name = name;
        this.value = value;
        this.textObject = scene.add.text(x, y, name + ": " + value);
    }

    setValue(value, duration = 300) {
        this.scene.tweens.add({
            targets: this,
            value: value,
            duration: duration,
            ease: 'Linear',
            onUpdate: () => {
                this.textObject.setText(this.name + ": " + Math.floor(this.value));
            }
        });
    }
    destroy() {
        this.textObject.destroy();
    }
}