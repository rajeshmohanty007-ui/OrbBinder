export default class Shop {
    constructor(scene) {
        this.scene = scene;
        this.container = scene.add.container(648, 358);

        this.create();
    }

    create() {
        this.container.setVisible(false);
        this.shopElement = this.scene.add.image(0, 0);
        this.shopElement.setOrigin(0, 0);
        this.shopElement.setScale(2);

        this.name = this.scene.add.text(132, 16, '');

        this.damageLabel = this.scene.add.text(132, 48, 'Damage', { color: '#eece2eff' });

        this.damageValue = this.scene.add.text(200, 48, '', { color: '#eece2eff' });

        this.buyBtn = this.scene.add.rectangle(
            132, 96, 100, 40, 0x1d5f00
        );
        this.buyBtn.setOrigin(0, 0);
        this.buyBtn.setInteractive({ useHandCursor: true });

        this.buyBtnText = this.scene.add.text(136, 106, 'Buy');
        this.costText = this.scene.add.text(180, 106, '');
        this.coinIcon = this.scene.add.image(210, 114, 'pauseCoin', 1);
        this.coinIcon.setScale(0.5);

        this.container.add([
            this.shopElement,
            this.name,
            this.damageLabel,
            this.damageValue,
            this.buyBtn,
            this.buyBtnText,
            this.costText,
            this.coinIcon
        ]);
    }
    update(el) {
        this.container.setVisible(true);
        const key = el.frame.name;

        const currentElement =
            this.scene.data.core[key] ||
            this.scene.data.particle[key] ||
            this.scene.data.rings[key];

        this.shopElement.setTexture(
            el.texture.key,
            el.frame.name
        );

        this.name.setText(key);
        this.damageValue.setText(currentElement.damage);
        this.costText.setText(currentElement.cost);

        this.selectedItem = el;
    }
}