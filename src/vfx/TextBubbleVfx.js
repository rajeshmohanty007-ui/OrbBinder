
export default class TextBubbleVfx {
    constructor(scene) {
        this.scene = scene;
    }
    async showText(text, x = 100, y = 100, duration = 1000, font = "Fantasy", fontSize = "32px", backgroundColor = "#000000", textColor = "#ffffff") {
        const bubbleText = this.scene.add.text(x, y, text, {
            fontFamily: font,
            fontSize: fontSize,
            color: textColor,
            backgroundColor: backgroundColor,
            padding: {
                x: 10,
                y: 5
            }
        })

        bubbleText.setOrigin(0.5);
        bubbleText.setScale(0.5);
        bubbleText.setDepth(1000);
        bubbleText.setScrollFactor(0);
        bubbleText.setAlpha(0)
        this.popIn(bubbleText)
    }
    popIn(target) {
        this.scene.tweens.add({
            targets: target,
            alpha: 1,
            scale: 1,
            y: target.y - 20,
            duration: 200,
            ease: "Back.Out",
            onComplete: () => {
                this.drift(target);
            }
        })
    }
    drift(target) {
        this.scene.tweens.add({
            targets: target,
            y: target.y - 50,
            duration: 600,
            ease: "Sine.easeOut",
            onComplete: () => {
                this.fadeOut(target);
            }
        })
    }
    fadeOut(target) {
        this.scene.tweens.add({
            targets: target,
            alpha: 0,
            scale: 0.5,
            y: target.y - 50,
            duration: 200,
            ease: "Sine.easeOut",
            onComplete: () => {
                target.destroy();
            }
        })
    }
    Breathe(target) {
        this.scene.tweens.add({
            targets: target,
            scale: 0.85,
            duration: 1000,
            yoyo: true,
            ease: "Sine.easeOut",
            repeat: -1,
        })
    }
    BreatheStop(target) {
        const tween = this.scene.tweens.getTweensOf(target);
        if (tween.length > 0) tween.forEach(t => t.stop());
    }
}