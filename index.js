const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: Scene1,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 200 }
      }
  }
};

const game = new Phaser.Game(config);