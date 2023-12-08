import Phaser from "phaser";
import { config } from "./index.js";
import pillarCap from "./assets/pillars/pillar_cap.png";
import pillar from "./assets/pillars/pillar.png";
import background from "./assets/background/Background.png";
import background2 from "./assets/background/Background2.png";
import background3 from "./assets/background/Background3.png";
import background4 from "./assets/background/Background4.png";
import ship from "./assets/ship/Ship.png";
import redship from "./assets/ship/red_ship.png";
import greenship from "./assets/ship/green_ship.png";
import orangeship from "./assets/ship/orange_ship.png";
import purpleship from "./assets/ship/purple_ship.png";
import cloud from "./assets/cloud.png";
import { HIGH_SCORE_KEY } from "./Menu.js";

const pillarVelocity = -200;
const backgrounds = {
  background: { key: "background", src: background },
  background2: { key: "background2", src: background2 },
  background3: { key: "background3", src: background3 },
  background4: { key: "background4", src: background4 },
};

export default class Scene1 extends Phaser.Scene {
  constructor() {
    super("playGame");
    this.isPaused = false;
    this.pillarGapOffset = config.height / 4;
    this.score = 0;
    this.lastPillarHeight = undefined;
    this.preventScoreIncrement = false;
    this.isStartMenuActive = false;
    this.weatherData = {};
    this.areCloudsMoving = false;
  }

  preload() {
    this.load.image("pillar_cap", pillarCap);
    this.load.image("pillar", pillar);
    this.load.image(background);
    this.load.image("ship", ship);
    this.load.image("redship", redship);
    this.load.image("greenship", greenship);
    this.load.image("orangeship", orangeship);
    this.load.image("purpleship", purpleship);
    this.load.image("cloud", cloud);
    this.fetchWeatherData();
    Object.keys(backgrounds).forEach((key) => {
      const image = backgrounds[key];
      this.load.image(image.key, image.src);
    });
  }

  startGame() {
    this.resetScore();
  }

  create() {
    const backgroundKeys = [
      "background",
      "background2",
      "background3",
      "background4",
    ];

    //Randomizing Backgrounds
    const randomizedBackground = Phaser.Utils.Array.GetRandom(backgroundKeys);
    const backgroundImage = this.add
      .image(-100, 0, randomizedBackground)
      .setOrigin(0, 0);

    // Fetch the selected ship color
    const selectedShipColor =
      window.localStorage.getItem("selectedShipColor") || "ship";

    // Calculate the center of the screen
    const centerX = config.width / 2;
    const centerY = config.height / 2;

    // Create the ship sprite based on the selected color
    this.ship = this.physics.add
      .sprite(centerX, centerY, selectedShipColor)
      .setScale(1.2);
    this.ship.setBounce(0.2);
    this.ship.setCollideWorldBounds(true);

    this.pillars = this.createBothPillars(this.getRandomPillarHeight());

    this.scoreText = this.add.text(10, 10, this.getScoreText(), {
      fontSize: 20,
      stroke: "black",
      strokeThickness: 2,
    });

    this.input.keyboard.on("keydown-SPACE", () => {
      // Set a negative velocity on the Y-axis to make the ship bounce up
      if (this.ship.active) {
        this.ship.setVelocityY(-200); // You can adjust the value for the desired bounce height
      }
    });

    this.input.keyboard.on("keydown-ESC", () => {
      this.openMenu();
    });

    // Create the background clouds
    this.clouds = this.physics.add.group({ allowGravity: false });
    for (let i = 0; i < 10; i++) {
      const cloud = this.physics.add.sprite(
        this.getRandomCloudX(),
        this.getRandomCloudY(),
        "cloud"
      );
      this.clouds.add(cloud);
    }
  }

  openMenu() {
    console.log("Transitioning to Menu scene");
    this.isPaused = true;
    this.scene.pause();
    this.scene.launch("bootGame"); // Launch the menu scene
    this.scene.bringToTop("bootGame"); // Bring the menu scene to the top
  }

  update() {
    if (this.pillars.getChildren()[0].x < -32) {
      // Update position of the pillars when they go off the screen
      const newPillarHeight = this.getRandomPillarHeight();
      const heightChange = newPillarHeight - this.lastPillarHeight;
      this.lastPillarHeight = newPillarHeight;
      this.pillars.getChildren().forEach((child) => {
        child.setPosition(config.width, child.y + heightChange);
      });
      this.preventScoreIncrement = false;
    }
    this.clouds.children.iterate((child) => {
      // Move the clouds back to the right side of the screen once they are off the left side
      if (child.x < -49) {
        child.setPosition(config.width + child.width, this.getRandomCloudY());
      }
    });

    if (!this.areCloudsMoving && this.weatherData?.wind?.speed) {
      // Start moving the clouds once the weather data has been fetched
      this.areCloudsMoving = true;
      this.clouds.setVelocityX(-20 * this.weatherData.wind.speed); // Set the speed based on the actual wind speed in Cincinnati
    }
  }

  getScoreText() {
    return `Score: ${this.score}`;
  }

  incrementScore() {
    if (!this.preventScoreIncrement) {
      this.score += 1;
      this.scoreText.setText(this.getScoreText());
      this.preventScoreIncrement = true;
    }
  }

  getRandomPillarHeight() {
    return (
      Math.random() *
        (config.height - this.pillarGapOffset - this.pillarGapOffset) +
      this.pillarGapOffset
    );
  }

  createBothPillars(y) {
    const x = config.width;
    this.lastPillarHeight = y;

    const topPillarCap = this.physics.add
      .sprite(x, y - 50, "pillar_cap")
      .setRotation(Math.PI)
      .setBounce(0);
    const topPillarBody = this.add
      .tileSprite(x, y - 50 - topPillarCap.height, 32, config.height, "pillar")
      .setRotation(Math.PI);
    topPillarBody.setPosition(
      topPillarBody.x,
      topPillarBody.y - topPillarBody.height / 2 + 5
    );

    const bottomPillarCap = this.physics.add
      .sprite(x, y + 50, "pillar_cap")
      .setBounce(0);
    const bottomPillarBody = this.add.tileSprite(
      x,
      y + 50,
      32,
      config.height,
      "pillar"
    );
    bottomPillarBody.setPosition(
      bottomPillarBody.x,
      bottomPillarBody.y + bottomPillarBody.height / 2 + 4
    );

    const pillars = this.physics.add.group({ allowGravity: false });

    const scoreZone = new Phaser.GameObjects.Zone(this, x, y - 50, 1, 100);
    const scoreHitbox = this.physics.add.existing(scoreZone);

    pillars.addMultiple([
      topPillarCap,
      topPillarBody,
      bottomPillarCap,
      bottomPillarBody,
      scoreHitbox,
    ]);

    pillars.setVelocityX(pillarVelocity);

    this.physics.add.overlap(pillars, this.ship, (ship, pillar) => {
      if (pillar.type !== "Zone") {
        ship.destroy();
        pillars.setVelocityX(0);
        this.updateHighScore(); // Update high score here
      } else {
        this.incrementScore();
        this.preventScoreIncrement = true;
      }
    });

    return pillars;
  }

  endGame() {
    const storedHighScore =
      parseInt(window.localStorage.getItem(HIGH_SCORE_KEY)) || 0;
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
    const currentHighScore =
      parseInt(window.localStorage.getItem(HIGH_SCORE_KEY), 10) || 0;
    if (this.score > currentHighScore) {
      window.localStorage.setItem(HIGH_SCORE_KEY, this.score.toString());
    }
  }

  async fetchWeatherData() {
    // Fetch the weather data and store it in the weather data class property
    const res = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=39.16&lon=-84.46&appid=e8b9417f81d174aa8c886a99946d8674"
    );
    const weather = await res.json();
    this.weatherData = weather;
  }

  getScoreText() {
    // Get the text score
    return `Score: ${this.score}`;
  }

  incrementScore() {
    // Increment the score by one unless the score is being prevented from incrementing
    if (!this.preventScoreIncrement) {
      this.score += 1;
      this.scoreText.setText(this.getScoreText());
    }
  }

  getRandomPillarHeight() {
    // Get a random y height for the pillar that falls in between 25% and 75% of the screen height
    return (
      Math.random() *
        (config.height - this.pillarGapOffset - this.pillarGapOffset) +
      this.pillarGapOffset
    );
  }

  getRandomCloudX() {
    return config.width + Math.random() * config.width;
  }

  getRandomCloudY() {
    return Math.random() * config.height;
  }
}
