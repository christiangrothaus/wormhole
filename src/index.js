import Phaser from "phaser";
import Scene1 from './Scene1.js'

export const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [Scene1],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 300},
      debug: false
    }
  }
};

window.onload = () => {
  const game = new Phaser.Game(config);
}

