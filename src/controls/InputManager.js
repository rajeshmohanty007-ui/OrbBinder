import Phaser from "phaser";

export default class InputManager {
    /**
     * @param {Phaser.Scene} scene The Phaser scene registering these controls
     */
    constructor(scene) {
        this.scene = scene;

        // Register custom keyboard inputs
        this.keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
            interact: Phaser.Input.Keyboard.KeyCodes.E,
            // Fallbacks for standard arrow keys
            arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
            arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            arrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
            arrowDown: Phaser.Input.Keyboard.KeyCodes.DOWN
        });
    }

    /**
     * True if Left Arrow or 'A' key is pressed
     * @returns {boolean}
     */
    get isMovingLeft() {
        return this.keys.left.isDown || this.keys.arrowLeft.isDown;
    }

    /**
     * True if Right Arrow or 'D' key is pressed
     * @returns {boolean}
     */
    get isMovingRight() {
        return this.keys.right.isDown || this.keys.arrowRight.isDown;
    }

    /**
     * True if Up Arrow or 'W' key is pressed
     * @returns {boolean}
     */
    get isClimbingUp() {
        return this.keys.up.isDown || this.keys.arrowUp.isDown;
    }

    /**
     * True if Down Arrow or 'S' key is pressed
     * @returns {boolean}
     */
    get isClimbingDown() {
        return this.keys.down.isDown || this.keys.arrowDown.isDown;
    }

    /**
     * True on the exact frame the Space key is pressed down
     * @returns {boolean}
     */
    get jumpJustPressed() {
        return Phaser.Input.Keyboard.JustDown(this.keys.jump);
    }

    /**
     * True on the exact frame the 'E' key is pressed down
     * @returns {boolean}
     */
    get interactJustPressed() {
        return Phaser.Input.Keyboard.JustDown(this.keys.interact);
    }
}
