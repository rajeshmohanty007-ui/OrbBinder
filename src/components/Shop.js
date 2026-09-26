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

        this.name = this.scene.add.text(132, 16, '', { color: "#7ee326ff", backgroundColor: "#000000", padding: { x: 10, y: 5 } });

        this.damageLabel = this.scene.add.text(132, 48, 'Damage', { color: '#eece2eff', backgroundColor: "#000000", padding: { x: 10, y: 5 } });

        this.damageValue = this.scene.add.text(200, 48, '', { color: '#eece2eff', backgroundColor: "#000000", padding: { x: 10, y: 5 } });

        this.buyBtn = this.scene.add.rectangle(
            132, 96, 100, 40, 0x1d5f00
        );
        this.buyBtn.setOrigin(0, 0);
        this.buyBtn.setInteractive({
            useHandCursor: true
        });

        this.buyBtn.on('pointerdown', () => {
            this.buyItem(
                this.selectedType,
                this.selectedName,
                this.selectedItem
            );
        });
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
    update(name, el) {
        const elementColor = {
            fire: "#ff4400ff",
            earth: "#eeee09ff",
            water: "#14cfefff",
            wind: "#f7f6e7ff"
        }
        this.selectedItem = el;
        this.container.setVisible(true);

        const currentElement =
            this.scene.data.core[name] ||
            this.scene.data.particle[name] ||
            this.scene.data.rings[name];
        let type = '';

        if (this.scene.data.core[name]) type = 'core';
        else if (this.scene.data.particle[name]) type = 'particle';
        else if (this.scene.data.rings[name]) type = 'ring';

        this.shopElement.setTexture(
            el.texture.key,
            el.frame.name
        );

        this.name.setText(name);
        this.name.setColor(elementColor[currentElement.element] || "#ffffffff");
        this.damageValue.setText(currentElement.damage);
        this.costText.setText(currentElement.cost);

        this.selectedName = name;
        this.selectedType = type;
        this.selectedItem = el;
    }
    buyItem(type, name, el) {
        const containerHelper = {
            core: this.scene.coreContainer,
            particle: this.scene.particleContainer,
            ring: this.scene.ringContainer
        }
        const posHelper = {
            core: [45, 15],
            particle: [16, 71],
            ring: [76, 72]
        }
        if (this.scene.beam[type]) {
            this.scene.textBubbleVfx.showText("Already Selected " + type, 790, 454, 1000, "arial", "24px", "#000", "#ff0000");
            return;
        }
        else if (this.scene.coinMap[name] >= this.scene.coinCount) {
            this.scene.textBubbleVfx.showText("Not Enough Money", 790, 454, 1000, "arial", "24px", "#000", "#ff0000");
            return;
        }
        else {
            const cost = this.scene.coinMap[name];
            this.scene.coinCount -= cost;
            this.scene.textBubbleVfx.showText(`-${cost}`, 658 + 132, 358 + 96, 1000, "Fantasy", "32px", null, "#ef2828ff");
            this.scene.textBubbleVfx.BreatheStop(el);
            containerHelper[type].remove(el);
            el.setPosition(posHelper[type][0], posHelper[type][1]);
            el.setScale(0.9);
            this.scene.midContainer.add(el);
            this.scene.beam[type] = name;
            this.scene.events.emit(`${type}_selected`, this.scene.coinCount);
        }
        this.selectedItem = null;
        this.hideShop();
        this.scene.selectionSystem.clearSelection();

    }
    hideShop() {
        this.container.setVisible(false);
    }
}