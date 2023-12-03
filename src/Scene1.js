import Phaser from "phaser"
import { config } from "./index.js"
import pillarCap from './assets/pillars/pillar_cap.png'
import pillar from './assets/pillars/pillar.png'

export default class Scene1 extends Phaser.Scene {
    constructor () {
      super('bootGame')
    }

    preload () {
      this.load.image('pillar_cap', pillarCap)
      this.load.image('pillar', pillar)
    }

    create () {
      this.pillars = this.createBothPillars(config.height / 2)
      this.pillars.setVelocityX(-200)
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

      const topPillarCap = this.physics.add.sprite(x, y - 50, 'pillar_cap')
      topPillarCap.setRotation(Math.PI)
      const topPillarBody = this.add.tileSprite(x, y - 50 - topPillarCap.height, 32, config.height - y, 'pillar')
      topPillarBody.setRotation(Math.PI)
      topPillarBody.setPosition(topPillarBody.x, topPillarBody.y - topPillarBody.height / 2 + 5)

      const bottomPillarCap = this.physics.add.sprite(x, y + 50, 'pillar_cap')
      const bottomPillarBody = this.add.tileSprite(x, y + 50, 32, config.height - y, 'pillar')
      bottomPillarBody.setPosition(bottomPillarBody.x, bottomPillarBody.y + bottomPillarBody.height / 2 + 5)

      const pillars = this.physics.add.group()

      pillars.add(topPillarCap)
      pillars.add(topPillarBody)
      pillars.add(bottomPillarCap)
      pillars.add(bottomPillarBody)

      return pillars
    }
}