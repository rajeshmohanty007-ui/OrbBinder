import Shop from "../components/Shop";

export default class selectionSystem {
    constructor(scene) {
        this.scene = scene;
    }
    selectCore(name, el) {
        this.showHighLighter(el, this.scene.coreContainer);
        // if (this.scene.beam.core) this.scene.errorMessage();
        // else if (this.scene.coinMap[name] >= this.scene.coinCount) {
        //     this.scene.aukatMessage();
        // }
        // else {
        //     this.scene.coinCount -= this.scene.coinMap[name];
        //     this.scene.coreContainer.remove(el);
        //     el.setPosition(45, 15);
        //     el.setScale(0.9);
        //     this.scene.midContainer.add(el);
        //     this.scene.beam.core = name;
        //     this.scene.events.emit('core_selected', this.scene.coinCount);
        // }
    }
    selectParticle(name, el) {
        this.showHighLighter(el, this.scene.particleContainer);
        // if (this.scene.beam.particle) this.scene.errorMessage();
        // else if (this.scene.coinMap[name] >= this.scene.coinCount) {
        //     this.scene.aukatMessage();
        // }
        // else {
        //     this.scene.coinCount -= this.scene.coinMap[name];
        //     this.scene.particleContainer.remove(el);
        //     el.setPosition(16, 71);
        //     el.setScale(0.9);
        //     this.scene.midContainer.add(el);
        //     this.scene.beam.particle = name;
        //     this.scene.events.emit('particle_selected', this.scene.coinCount);
        // }
    }
    selectRing(name, el) {
        this.showHighLighter(el, this.scene.ringContainer);
        // if (this.scene.beam.ring) this.scene.errorMessage();
        // else if (this.scene.coinMap[name] >= this.scene.coinCount) {
        //     this.scene.aukatMessage();
        // }
        // else {
        //     this.scene.coinCount -= this.scene.coinMap[name];
        //     this.scene.ringContainer.remove(el);
        //     el.setPosition(76, 72);
        //     el.setScale(0.9);
        //     this.scene.midContainer.add(el);
        //     this.scene.beam.ring = name;
        //     this.scene.events.emit('ring_selected', this.scene.coinCount);
        // }
    }
    showHighLighter(el, container) {
        if (this.highLighter) this.highLighter.destroy();
        this.highLighter = this.scene.add.image(el.x, el.y, 'highlighter');
        this.highLighter.setDisplaySize(48, 48);
        this.highLighter.setOrigin(0, 0);
        container.add(this.highLighter);
        this.showShop(el);
    }
    showShop(el) {
        this.scene.shop.update(el);

    }
}