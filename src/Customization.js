import Phaser from 'phaser';
import { config } from "./index.js";
import menuBackground from './assets/background/menu_background.png'
import redship from './assets/ship/red_ship.png'
import greenship from './assets/ship/green_ship.png'
import orangeship from './assets/ship/orange_ship.png'
import purpleship from './assets/ship/purple_ship.png'
import left from './assets/arrows/leftarrow.png'
import right from './assets/arrows/rightarrow.png'


export default class ColorSelectionScene extends Phaser.Scene {
    constructor() {
        super('colorselection');
    }

    preload() {
        console.log("Preloading Customization Assets");
        this.load.image('menu_background', menuBackground)
        this.load.image('redship', redship);
        this.load.image('greenship', greenship);
        this.load.image('orangeship', orangeship);
        this.load.image('purpleship', purpleship);
        this.load.image('left', left);
        this.load.image('right', right);
    }

    create() {
        this.backgroundSprite = this.add.tileSprite(0, 0, config.width * 2, config.height * 2, 'menu_background');

        this.shipKeys = ['redship', 'greenship', 'orangeship', 'purpleship'];
        this.currentShipIndex = 0;
        this.shipDisplay = this.add.image(config.width / 2, config.height / 2, this.shipKeys[this.currentShipIndex])
            .setScale(1.5);

        const arrowOffset = 50; // Distance from the ship's center
        const arrowScale = 1.5; // Size of arrows
        this.add.image(config.width / 2 - arrowOffset, config.height / 2, 'left')
            .setInteractive()
            .setScale(arrowScale)
            .on('pointerdown', () => this.changeShip(-1));

        this.add.image(config.width / 2 + arrowOffset, config.height / 2, 'right')
            .setInteractive()
            .setScale(arrowScale)
            .on('pointerdown', () => this.changeShip(1));

        this.confirmButton = this.add.text(config.width / 2, config.height - 100, 'Confirm', { stroke: '#111', strokeThickness: 4, fontSize: 20, fill: '#FFF' })
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.confirmSelection())
            .on('pointerover', () => this.confirmButton.setStyle({ fill: '#12ff12' }))
            .on('pointerout', () => this.confirmButton.setStyle({ fill: '#FFF' }));
    }

    changeShip(direction) {
        this.currentShipIndex += direction;
        if (this.currentShipIndex >= this.shipKeys.length) {
            this.currentShipIndex = 0;
        } else if (this.currentShipIndex < 0) {
            this.currentShipIndex = this.shipKeys.length - 1;
        }
        this.shipDisplay.setTexture(this.shipKeys[this.currentShipIndex]);
    }

    confirmSelection() {
        window.localStorage.setItem('selectedShipColor', this.shipKeys[this.currentShipIndex]);
        this.scene.launch('bootGame'); // Launch the menu scene
    this.scene.bringToTop('bootGame'); // Bring the menu scene to the top
    }
}
