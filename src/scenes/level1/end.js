import Phaser from "phaser";
export default class EndScene extends Phaser.Scene {
    constructor(){
        super('EndScene');
    }
    init(status){
        this.end = status;
    }
    preload(){}
    create(){
        this.bg = this.add.rectangle(0, 0, 960, 540, 0x00002f);
        this.bg.setOrigin(0,0);

        this.endText = this.add.text(480, 270, this.end, {fontSize: 32});
    }
}