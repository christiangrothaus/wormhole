let config = {
    renderer: Phaser.AUTO,
    width: 600,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  let game = new Phaser.Game(config);
  let ship;
  
  
  function preload () {
    this.load.image('background', 'assets/background/Background.png');
    this.load.image('column', 'assets/pillars/TitleSheet-v1.png');
    this.load.spritesheet('ship', 'assets/ship/Ship.png', { frameWidth: 64, frameHeight: 96, align: "center" });
    
}
  
function create() {
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
  
    // Calculate the center of the screen
    const centerX = config.width / 2;
    const centerY = config.height / 2;
  
    ship = this.physics.add.sprite(centerX, centerY, 'ship').setScale(2);
    ship.setBounce(0.2);
    ship.setCollideWorldBounds(true);

    this.input.keyboard.on('keydown-SPACE', function () {
        // Set a negative velocity on the Y-axis to make the ship bounce up
        ship.setVelocityY(-200); // You can adjust the value for the desired bounce height
      });
  }
  
  function update () {
  }