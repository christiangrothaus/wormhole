import Phaser from "phaser"
import { config } from "./index.js"
import pillarCap from './assets/pillars/pillar_cap.png'
import pillar from './assets/pillars/pillar.png'
import background from './assets/background/Background.png'
import ship from './assets/ship/Ship.png'

export default class Scene1 extends Phaser.Scene {
    constructor () {
      super('bootGame')
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

      this.pillars = this.createBothPillars(config.height / 2)
   

      this.input.keyboard.on('keydown-SPACE', () => {
        // Set a negative velocity on the Y-axis to make the ship bounce up
        this.ship.setVelocityY(-200); // You can adjust the value for the desired bounce height
      });
    }

    update () {
      if(this.pillars.children && this.pillars.getChildren()[0].x < -32) {
        this.pillars.destroy()
      }
    }

    createPillar (y) {
      const x = config.width - 20
      const bottomPillarCap = this.physics.add.sprite(x, y, 'pillar_cap')
      const pillarBody = this.add.tileSprite(x, y, 32, config.height - y, 'pillar')
      pillarBody.setPosition(pillarBody.x, pillarBody.y + pillarBody.height / 2 + 3)

      const pillar = this.physics.add.group()

      pillar.add(bottomPillarCap)
      pillar.add(pillarBody)
      
      return pillar
    }

    createBothPillars (y) {
      const x = config.width - 20

      const topPillarCap = this.physics.add.sprite(x, y - 50, 'pillar_cap').setRotation(Math.PI)
      const topPillarBody = this.add.tileSprite(x, y - 50 - topPillarCap.height, 32, config.height - y, 'pillar').setRotation(Math.PI)
      topPillarBody.setPosition(topPillarBody.x, topPillarBody.y - topPillarBody.height / 2 + 5)

      const bottomPillarCap = this.physics.add.sprite(x, y + 50, 'pillar_cap')
      const bottomPillarBody = this.add.tileSprite(x, y + 50, 32, config.height - y, 'pillar')
      bottomPillarBody.setPosition(bottomPillarBody.x, bottomPillarBody.y + bottomPillarBody.height / 2 + 5)

      const pillars = this.physics.add.group({allowGravity: false})

      pillars.add(topPillarCap)
      pillars.add(topPillarBody)
      pillars.add(bottomPillarCap)
      pillars.add(bottomPillarBody)

      pillars.setVelocityX(-200)

      return pillars
    }
}