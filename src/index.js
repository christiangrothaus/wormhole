import Phaser from "phaser";
import Scene1 from './Scene1.js'
import Menu from './Menu.js'
import Customization from './Customization.js'


export const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Menu, Scene1, Customization],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};


window.onload = () => {
    const game = new Phaser.Game(config);
}
