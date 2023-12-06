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

    // Position for the high score display
    

    // Position for the 'Start Game' button
    const startButtonY = config.height / 2; // Central position
    this.startButton = this.add.text(config.width / 2, startButtonY, 'Start Game')
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
   
    this.highScore = this.add.text(config.width / 2, config.height / 2.25, `High Score: ${this.highScore}`)
      .setOrigin(0.5, 0.5)
      .setStyle({ stroke: '#111', strokeThickness: 4, fontSize: 15 })
      
    // Position for the 'Resume Game' button
    const resumeButtonY = startButtonY + 40; // Positioned below the 'Start Game' button
    this.resumeButton = this.add.text(config.width / 2, resumeButtonY, 'Resume Game')
      .setOrigin(0.5, 0.5)
      .setStyle({ stroke: '#111', strokeThickness: 4, fontSize: 20 })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.resumeGame())
      .on('pointerover', () => this.resumeButton.setStyle({ fill: '#12ff12' }))
      .on('pointerout', () => this.resumeButton.setStyle({ fill: '#FFF' }));
      
}


  update () {

  }

  startGame () { // Function for switching scenes when the start button is pressed.
    const gameScene = this.scene.get('playGame');
   
    this.scene.restart('playGame')
    this.scene.get('playGame').resetScore();
    this.scene.start('playGame');

  }

  resumeGame() {
    const gameScene = this.scene.get('playGame');

    if (gameScene && gameScene.isPaused) {
        this.scene.stop();
        this.scene.resume('playGame');
        gameScene.isPaused = false; // Reset the paused flag
    } else {
        this.startGame();
    }
  }
}
