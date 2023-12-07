import Phaser from "phaser"
import { config } from "./index.js"
import pillarCap from './assets/pillars/pillar_cap.png'
import pillar from './assets/pillars/pillar.png'
import background from './assets/background/Background.png'
import ship from './assets/ship/Ship.png'
import { HIGH_SCORE_KEY } from "./Menu.js"

const pillarVelocity = -200

export default class Scene1 extends Phaser.Scene {
  constructor () {

    super('playGame')
    this.isPaused = false
    this.pillarGapOffset = config.height / 4
    this.score = 0
    this.lastPillarHeight = undefined
    this.preventScoreIncrement = false
    this.isStartMenuActive = false
  }

    preload () {
      this.load.image('pillar_cap', pillarCap)
      this.load.image('pillar', pillar)
      this.load.image('background', background);
      this.load.image('ship', ship);
    }

    startGame() {
      this.resetScore();
    }
    create () {
      this.add.image(0, 0, 'background').setOrigin(0, 0);

      // Calculate the center of the screen
      const centerX = config.width / 2;
      const centerY = config.height / 2;
    
      this.ship = this.physics.add.sprite(centerX, centerY, 'ship').setScale(1.2);
      this.ship.setBounce(0.2);
      this.ship.setCollideWorldBounds(true);

      this.pillars = this.createBothPillars(this.getRandomPillarHeight())

      this.scoreText = this.add.text(10, 10, this.getScoreText(), {fontSize: 20, stroke: 'black', strokeThickness: 2})

      this.input.keyboard.on('keydown-SPACE', () => {
        // Set a negative velocity on the Y-axis to make the ship bounce up
        if(this.ship.active) { 
          this.ship.setVelocityY(-200); // You can adjust the value for the desired bounce height
        }
      });

      this.input.keyboard.on('keydown-ESC', () => {
        this.openMenu();
      });
  }
  
  openMenu() {
    console.log("Transitioning to Menu scene");
    this.isPaused = true;
    this.scene.pause();
    this.scene.launch('bootGame'); // Launch the menu scene
    this.scene.bringToTop('bootGame'); // Bring the menu scene to the top
}
  

    

    update () {
      if(this.pillars.getChildren()[0].x < -32) { // Update position of the pillars when they go off the screen
        const newPillarHeight = this.getRandomPillarHeight()
        const heightChange = newPillarHeight - this.lastPillarHeight;
        this.lastPillarHeight = newPillarHeight
        this.pillars.getChildren().forEach((child) => {
          child.setPosition(config.width, child.y + heightChange)
        })
        this.preventScoreIncrement = false;
      }

    }

    getScoreText () {
      return `Score: ${this.score}`
    }

    incrementScore () {
      if(!this.preventScoreIncrement) {
        this.score += 1 
        this.scoreText.setText(this.getScoreText())
        this.preventScoreIncrement = true; 
      }
    }

    getRandomPillarHeight () {
      return Math.random() * ((config.height - this.pillarGapOffset) - this.pillarGapOffset) + this.pillarGapOffset
    }

    createBothPillars (y) {
      const x = config.width
      this.lastPillarHeight = y;

      const topPillarCap = this.physics.add.sprite(x, y - 50, 'pillar_cap').setRotation(Math.PI).setBounce(0)
      const topPillarBody = this.add.tileSprite(x, y - 50 - topPillarCap.height, 32, config.height, 'pillar').setRotation(Math.PI)
      topPillarBody.setPosition(topPillarBody.x, topPillarBody.y - topPillarBody.height / 2 + 5)

      const bottomPillarCap = this.physics.add.sprite(x, y + 50, 'pillar_cap').setBounce(0)
      const bottomPillarBody = this.add.tileSprite(x, y + 50, 32, config.height, 'pillar')
      bottomPillarBody.setPosition(bottomPillarBody.x, bottomPillarBody.y + bottomPillarBody.height / 2 + 4)

      const pillars = this.physics.add.group({allowGravity: false})

      const scoreZone = new Phaser.GameObjects.Zone(this, x, y - 50, 1, 100)
      const scoreHitbox = this.physics.add.existing(scoreZone)

      pillars.addMultiple([topPillarCap, topPillarBody, bottomPillarCap, bottomPillarBody, scoreHitbox])

      pillars.setVelocityX(pillarVelocity)

      this.physics.add.overlap(pillars, this.ship, (ship, pillar) => {
        if(pillar.type !== 'Zone') {
          ship.destroy();
          pillars.setVelocityX(0);
          this.updateHighScore(); // Update high score here
      } else {
          this.incrementScore();
          this.preventScoreIncrement = true;
      }
    })

      return pillars
    }

      endGame() {
        const storedHighScore = parseInt(window.localStorage.getItem(HIGH_SCORE_KEY)) || 0;
        if (this.score > storedHighScore) {
            window.localStorage.setItem(HIGH_SCORE_KEY, this.score.toString());
        }
    }
    
    // Existing incrementScore method
    incrementScore() {
        if (!this.preventScoreIncrement) {
            this.score += 1;
            this.scoreText.setText(this.getScoreText());
            this.preventScoreIncrement = true;
        }
    }
    
    // Update resetScore method to also handle high score display
    resetScore() {
        this.score = 0;
    }
    updateHighScore() {
      const currentHighScore = parseInt(window.localStorage.getItem(HIGH_SCORE_KEY), 10) || 0;
      if (this.score > currentHighScore) {
          window.localStorage.setItem(HIGH_SCORE_KEY, this.score.toString());
      }
  }


    }
