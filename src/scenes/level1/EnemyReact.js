import Phaser from "phaser";
import { delay } from "../../utils/delay";
export default class EnemyReact {
    constructor(scene) {
        this.scene = scene;
    }
    Attack(enemy) {
        const damage = { health: 25, shield: 10 };
        enemy.play('creeper-attack');
        this.scene.events.emit('enemy-attack', damage);
        enemy.once('animationcomplete', () => {
            enemy.play('creeper-idle');
            this.scene.events.emit('enemy-attack-over');
        })
    }
}