import Phaser from 'phaser/dist/phaser-arcade-physics';

export default class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: "mainScene" });

        this.platforms;
        this.player;
        this.spacebar;
        this.height = 0;
        this.peak = 0;
        this.countDown = 15;
        this.velocityY = -100;
        this.isClimbing = false;
        this.isGameOver = false;
        this.peakText;
        this.heightText;
        this.countDownText;
    }

    preload() {
        this.load.image("hokkaido", "./assets/Hokkaido.png");
        this.load.image("ground", "assets/Ground.png");
        this.load.spritesheet("ninja", "assets/NinjaSprite.png", { frameWidth: 60, frameHeight: 100 });
    }

    create() {
        this.add.image(300, 300, "hokkaido");

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(300, 590, "ground");

        this.player = this.physics.add.sprite(300, 520, "ninja");
        this.player.setBounce(0.3);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(500);

        this.physics.add.collider(this.player, this.platforms);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.anims.create({
            key: "climb",
            frames: this.anims.generateFrameNumbers("ninja", { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: "fall",
            frames: [{ key: "ninja", frame: 0 }],
            frameRate: 20,
        });

        this.countDownEvent = this.time.delayedCall(this.countDown * 1000, this.onTimerDone, [], this);

        this.peakText = this.add.text(400, 18, "Peak: 0", {
            fontSize: "26px",
            fill: "#000",
            fontFamily: "Open Sans",
        });
        this.heightText = this.add.text(400, 55, "Height: 0", {
            fontSize: "18px",
            fill: "#000",
            fontFamily: "Open Sans",
        });
        this.countDownText = this.add.text(400, 105, "Time: " + this.countDown + "s", {
            fontSize: "18px",
            fill: "#000",
            fontFamily: "Open Sans",
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar) && !this.isGameOver) {
            this.player.setVelocityY(this.velocityY);
            this.height = Math.round((530.5 - this.player.y + Number.EPSILON) * 100) / 100;

            if (this.height > 60 && this.height <= 80) {
                this.velocityY = -100;
            } else if (this.height > 80 && this.height <= 120) {
                this.velocityY = -90;
            } else if (this.height > 120 && this.height <= 170) {
                this.velocityY = -88;
            } else if (this.height > 170 && this.height <= 280) {
                this.velocityY = -85;
            } else if (this.height > 280) {
                this.velocityY = -75;
            } else {
                this.velocityY = -100;
            }

            console.log(this.height);
            this.peak = this.height > this.peak ? this.height : this.peak;

            this.heightText.setText("Height: " + this.height);
            this.peakText.setText("Peak: " + this.peak);
        }

        if (this.height > 0 && !this.isClimbing) {
            this.player.anims.play("climb");
            this.isClimbing = true;
        }

        if (this.player.body.onFloor() && this.isClimbing) {
            this.player.anims.play("fall");
            this.isClimbing = false;
            this.heightText.setText("Height: 0");
        }

        this.countDownText.setText("Time: " + Math.round(this.countDown - this.countDownEvent.getElapsedSeconds()));
    }

    onTimerDone() {
        this.isGameOver = true;
        console.log("iwaraaaiiii........!!!!");

        this.add.rectangle(300, 300, 600, 300, 0x0c1a39);
        
        this.add.text(250, 200, "Time's up!", {
            fontSize: "26px",
            fill: "#fff",
            fontFamily: "Open Sans",
        });

        this.add.text(100, 250, "The highest you reached is " + this.peak, {
            fontSize: "26px",
            fill: "#fff",
            fontFamily: "Open Sans",
        });
    }
}

