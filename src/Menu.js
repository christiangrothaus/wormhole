import Phaser from "phaser";
import { config } from "./index.js";
import menuBackground from './assets/background/menu_background.png'

export const HIGH_SCORE_KEY = 'HIGH_SCORE'

export default class Scene1 extends Phaser.Scene {
  constructor () {
    super('bootGame')
  }

  preload () {
    this.load.image('menu_background', menuBackground)
  }

  create () {
    this.backgroundSprite = this.add.tileSprite(0, 0, config.width * 2, config.height * 2, 'menu_background')
    // Creates the start button on the menu
    this.startButton = this.add.text(config.width / 2, config.height / 2, 'Start Game')
      .setOrigin(0.5, 0.5)
      .setStyle({ stroke: '#111', strokeThickness: 4, fontSize: 20 })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startGame())
      .on('pointerover', () => this.startButton.setStyle({ fill: '#12ff12' }))
      .on('pointerout', () => this.startButton.setStyle({ fill: '#FFF' }))

    this.highScore = 0;
    try { // Attempt to get the high score from the local storage.  If none exists then keep the high score at 0.
      const score = parseInt(window.localStorage.getItem(HIGH_SCORE_KEY))
      if(typeof score === 'number' && !isNaN(score)) {
        this.highScore = score
      }
    } catch {}
    this.highScore = this.add.text(config.width / 2, config.height / 2 + 30, `High Score: ${this.highScore}`)
      .setOrigin(0.5, 0.5)
      .setStyle({ stroke: '#111', strokeThickness: 4, fontSize: 15 })
  }

  update () {

  }

  startGame () { // Function for switching scenes when the start button is pressed.
    this.scene.start('playGame')
  }
}