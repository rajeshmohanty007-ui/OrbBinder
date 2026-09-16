import Shop from "../components/Shop";

export default class selectionSystem {
    constructor(scene) {
        this.scene = scene;
    }
    selectCore(name, el) {
        this.showHighLighter(name, el, this.scene.coreContainer);
    }
    selectParticle(name, el) {
        this.showHighLighter(name, el, this.scene.particleContainer);
    }
    selectRing(name, el) {
        this.showHighLighter(name, el, this.scene.ringContainer);
    }
    showHighLighter(name, el, container) {
        if (this.highLighter) this.highLighter.destroy();
        this.highLighter = this.scene.add.image(el.x, el.y, 'highlighter');
        this.highLighter.setDisplaySize(48, 48);
        this.highLighter.setOrigin(0, 0);
        container.add(this.highLighter);
        this.showShop(name, el);
    }
    showShop(name, el) {
        this.scene.shop.update(name, el);

    }
    clearSelection() {
        if (this.highLighter) this.highLighter.destroy();
    }
}