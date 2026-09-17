import { delay } from "../utils/delay";

export default class MessageSystem {
    constructor(scene) {
        this.scene = scene;
    }
    async errorMessage() {
        const msg = this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2, 'One item for this section is selected already', { color: '#ffffff' });
        msg.setOrigin(0.5);
        msg.setScale(2);
        await delay(2000);
        msg.destroy();
    }
    async aukatMessage() {
        const msg = this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2, "You don't have sufficient currency", { color: '#f45369' });
        msg.setOrigin(0.5);
        msg.setScale(2);
        await delay(2000);
        msg.destroy();
    }
}