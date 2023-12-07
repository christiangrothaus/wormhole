import Phaser from "phaser"
import { config } from "./index.js"
import pillarCap from './assets/pillars/pillar_cap.png'
import pillar from './assets/pillars/pillar.png'
import background from './assets/background/Background.png'
import ship from './assets/ship/Ship.png'

const pillarVelocity = -200

export default class Scene1 extends Phaser.Scene {
    constructor () {
      super('bootGame')
      this.pillarGapOffset = config.height / 4
      this.score = 0
      this.lastPillarHeight = undefined
      this.preventScoreIncrement = false
    }

    preload () {
      this.load.image('pillar_cap', pillarCap)
      this.load.image('pillar', pillar)
      this.load.image('background', background);
      this.load.image('ship', ship);
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
    }

    update () {
      if(this.pillars.getChildren()[0].x < -32) { // Update position of the pillars when they go off the screen
        const newPillarHeight = this.getRandomPillarHeight()
        const heightChange = newPillarHeight - this.lastPillarHeight;
        this.lastPillarHeight = newPillarHeight
        this.pillars.getChildren().forEach((child) => {
          child.setPosition(config.width, child.y + heightChange)
        })
        this.preventScoreIncrement = false; // Allow the score to be incremented again.
      }
    }

    getScoreText () { // Get the text score
      return `Score: ${this.score}`
    }

    incrementScore () { // Increment the score by one unless the score is being prevented from incrementing
      if(!this.preventScoreIncrement) {
        this.score += 1 
        this.scoreText.setText(this.getScoreText())
      }
    }

    getRandomPillarHeight () { // Get a random y height for the pillar that falls in between 25% and 75% of the screen height
      return Math.random() * ((config.height - this.pillarGapOffset) - this.pillarGapOffset) + this.pillarGapOffset
    }

    createBothPillars (y) {
      const x = config.width
      this.lastPillarHeight = y; // Update the lastPillar height

      // Create the top pillar
      const topPillarCap = this.physics.add.sprite(x, y - 50, 'pillar_cap').setRotation(Math.PI).setBounce(0)
      const topPillarBody = this.add.tileSprite(x, y - 50 - topPillarCap.height, 32, config.height, 'pillar').setRotation(Math.PI)
      topPillarBody.setPosition(topPillarBody.x, topPillarBody.y - topPillarBody.height / 2 + 5)

      // Create the bottom pillar
      const bottomPillarCap = this.physics.add.sprite(x, y + 50, 'pillar_cap').setBounce(0)
      const bottomPillarBody = this.add.tileSprite(x, y + 50, 32, config.height, 'pillar')
      bottomPillarBody.setPosition(bottomPillarBody.x, bottomPillarBody.y + bottomPillarBody.height / 2 + 4)

      // Create a zone for checking if the score should be incremented
      const scoreZone = new Phaser.GameObjects.Zone(this, x, y - 50, 1, 100)
      const scoreHitbox = this.physics.add.existing(scoreZone)

      // Add all pillar parts to a group
      const pillars = this.physics.add.group({allowGravity: false})
      pillars.addMultiple([topPillarCap, topPillarBody, bottomPillarCap, bottomPillarBody, scoreHitbox])

      // Make the entire pillar move to the left
      pillars.setVelocityX(pillarVelocity)

      // Check for overlap between the pillar group and the ship
      this.physics.add.overlap(pillars, this.ship, (ship, pillar) => {
        if(pillar.type !== 'Zone') { // If the object that collides with the ship is the pillar sprites then destroy the ship
          ship.destroy()
        } else { // If the ship makes it through the gap increment the score and make it so it can't increment again until the pillar resets.
          this.incrementScore()
          this.preventScoreIncrement = true
        }
      })

      return pillars
    }
}