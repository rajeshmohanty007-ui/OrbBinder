export default class StatusSystem {
    constructor(scene) {
        this.status = {};
        this.scene = scene;
    }
    indexHelper = {
        "poison": 0,
        "burn": 1,
        "attack_down": 3,
        "attack_up": 2,
        "break_shield": 10,
        "spGain": 8,
        "ignore": 9
    }
    updatePlayerStatus(status) {
        this.scene.playerStatusBox.removeAll(true);
        status.forEach((s, i) => {
            const index = this.indexHelper[s.type];
            const img = this.scene.add.image(i * 16, 0, 'AoE', index);
            img.setOrigin(0, 0);
            img.setScale(0.25);
            this.scene.playerStatusBox.add(img);
        });
    }
    updateEnemyStatus(status) {
        this.scene.enemyStatusBox.removeAll(true);
        status.forEach((s, i) => {
            const index = this.indexHelper[s.type];
            const img = this.scene.add.image(i * 16, 0, 'AoE', index);
            img.setOrigin(0, 0);
            img.setScale(0.25);
            this.scene.enemyStatusBox.add(img);
        });
    }
}