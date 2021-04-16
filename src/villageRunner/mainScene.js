import Phaser from 'phaser/dist/phaser-arcade-physics';
import gameConfig from '../config/gameConfig';

export default class mainScene extends Phaser.Scene {
    constructor() {
        super('mainScene');
        this.score = 0;
        this.maxScore = 0;
        this.countdown = gameConfig.villageRunner.countdown;
    }

    preload() {
        this.load.image('platform', 'assets/land.png');

        // player is a sprite sheet made by 24x48 pixels
        this.load.spritesheet('player', 'assets/boyWalking.png', {
            frameWidth: 30,
            frameHeight: 48
        });

        // kokis is a sprite sheet made by 60x48 pixels
        this.load.spritesheet('kokis', 'assets/kokis.png', {
            frameWidth: 48,
            frameHeight: 60
        });

        this.load.image('forest', 'assets/forest.png');
    }
    create() {
        this.forest = this.add.tileSprite(
            gameConfig.villageRunner.width / 2,
            gameConfig.villageRunner.height / 2,
            gameConfig.villageRunner.width,
            gameConfig.villageRunner.height,
            'forest'
        );

        // keeping track of added platforms
        this.addedPlatforms = 0;

        // group with all active platforms.
        this.platformGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function (platform) {
                platform.scene.platformPool.add(platform);
            }
        });

        // platform pool
        this.platformPool = this.add.group({
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function (platform) {
                platform.scene.platformGroup.add(platform);
            }
        });

        // group with all active kokis.
        this.kokisGroup = this.add.group({
            // once a kokis is removed, it's added to the pool
            removeCallback: function (kokis) {
                kokis.scene.kokisPool.add(kokis);
            }
        });

        // kokis pool
        this.kokisPool = this.add.group({
            // once a kokis is removed from the pool, it's added to the active kokis group
            removeCallback: function (kokis) {
                kokis.scene.kokisGroup.add(kokis);
            }
        });

        // number of consecutive jumps made by the player
        this.playerJumps = 0;

        // adding a platform to the game, the arguments are platform width, x position and y position
        this.addPlatform(gameConfig.villageRunner.width, gameConfig.villageRunner.width / 2, gameConfig.villageRunner.height * gameConfig.villageRunner.platformVerticalLimit[1]);

        // adding the player;
        this.player = this.physics.add.sprite(gameConfig.villageRunner.playerStartPosition, gameConfig.villageRunner.height * 0.7, 'player');
        this.player.setGravityY(gameConfig.villageRunner.playerGravity);

        // setting player animation
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 8 }),
            frameRate: 16,
            repeat: -1
        });

        // setting kokis animation
        this.anims.create({
            key: 'rotate',
            frames: this.anims.generateFrameNumbers('kokis', { start: 0, end: 23 }),
            frameRate: 16,
            repeat: -1
        });

        // setting collisions between the player and the platform group
        this.physics.add.collider(
            this.player,
            this.platformGroup,
            function () {
                // play "run" animation if the player is on a platform
                if (!this.player.anims.isPlaying) {
                    this.player.anims.play('run');
                }
            },
            null,
            this
        );

        // setting collisions between the player and the kokis group
        this.physics.add.overlap(
            this.player,
            this.kokisGroup,
            function (player, kokis) {
                this.score += 10;
                this.tweens.add({
                    targets: kokis,
                    y: kokis.y - 100,
                    alpha: 0,
                    duration: 800,
                    ease: 'Cubic.easeOut',
                    callbackScope: this,
                    onComplete: function () {
                        this.kokisGroup.killAndHide(kokis);
                        this.kokisGroup.remove(kokis);
                    }
                });
            },
            null,
            this
        );

        this.countDownEvent = this.time.delayedCall(this.countdown * 1000, this.onTimerDone, [], this);

        // checking for input
        this.input.on('pointerdown', this.jump, this);

        this.distanceText = this.add.text(50, 18, "Distance: 0m", {
            fontSize: "26px",
            fill: "#000",
            fontFamily: "Open Sans",
        });

        this.countDownText = this.add.text(750, 18, "Time: " + this.countDown + "s", {
            fontSize: "18px",
            fill: "#000",
            fontFamily: "Open Sans",
        });
    }

    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX, posY) {
        this.addedPlatforms++;
        let platform;
        if (this.platformPool.getLength()) {
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
            let newRatio = platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        } else {
            platform = this.add.tileSprite(posX, posY, platformWidth, 32, 'platform');
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameConfig.villageRunner.platformSpeedRange[0], gameConfig.villageRunner.platformSpeedRange[1]) * -1);
            this.platformGroup.add(platform);
        }
        platform.displayWidth = platformWidth;
        this.nextPlatformDistance = Phaser.Math.Between(gameConfig.villageRunner.spawnRange[0], gameConfig.villageRunner.spawnRange[1]);

        if (this.addedPlatforms > 1) {
            if (Phaser.Math.Between(1, 100) <= gameConfig.villageRunner.kokisPercent) {
                if (this.kokisPool.getLength()) {
                    let kokis = this.kokisPool.getFirst();
                    (kokis.x = posX), (kokis.y = posY - 96), (kokis.alpha = 1);
                    (kokis.active = true), (kokis.visible = true);
                    this.kokisPool.remove(kokis);
                } else {
                    let kokis = this.physics.add.sprite(posX, posY - 96, 'kokis');
                    kokis.setImmovable(true);
                    kokis.setVelocityX(platform.body.velocity.x);
                    kokis.anims.play('rotate');
                    this.kokisGroup.add(kokis);
                }
            }
        }
    }

    // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    jump() {
        if (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameConfig.villageRunner.jumps)) {
            if (this.player.body.touching.down) {
                this.playerJumps = 0;
            }
            this.player.setVelocityY(gameConfig.villageRunner.jumpForce * -1);
            this.playerJumps++;

            // stops animation
            this.player.anims.stop();
        }
    }
    update() {
        this.score ++;
        this.distanceText.setText("Distance: " + this.score + "m");

        // respawn
        if (this.player.y > gameConfig.villageRunner.height) {
            this.maxScore = this.score > this.maxScore ? this.score : this.maxScore;
            this.score = 0;
            this.countdown = this.countdownRemains;
            this.scene.start('mainScene');
        }

        this.forest.tilePositionX += 1;

        this.player.x = gameConfig.villageRunner.playerStartPosition;

        // recycling platforms
        let minDistance = gameConfig.villageRunner.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function (platform) {
            let platformDistance = gameConfig.villageRunner.width - platform.x - platform.displayWidth / 2;
            if (platformDistance < minDistance) {
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if (platform.x < -platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // recycle kokis
        this.kokisGroup.getChildren().forEach(function (kokis) {
            if (kokis.x < -kokis.displayWidth / 2) {
                this.kokisGroup.killAndHide(kokis);
                this.kokisGroup.remove(kokis);
            }
        }, this);

        // adding new platforms
        if (minDistance > this.nextPlatformDistance) {
            let nextPlatformWidth = Phaser.Math.Between(gameConfig.villageRunner.platformSizeRange[0], gameConfig.villageRunner.platformSizeRange[1]);
            let platformRandomHeight =
                gameConfig.villageRunner.platformHeighScale * Phaser.Math.Between(gameConfig.villageRunner.platformHeightRange[0], gameConfig.villageRunner.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = gameConfig.villageRunner.height * gameConfig.villageRunner.platformVerticalLimit[0];
            let maxPlatformHeight = gameConfig.villageRunner.height * gameConfig.villageRunner.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, gameConfig.villageRunner.width + nextPlatformWidth / 2, nextPlatformHeight);
        }

        this.countdownRemains = Math.round(this.countdown - this.countDownEvent.getElapsedSeconds());

        this.countDownText.setText("Time: " + this.countdownRemains);
    }

    onTimerDone() {
        this.maxScore = this.score > this.maxScore ? this.score : this.maxScore;
        console.log(this.maxScore);
        this.scene.start('gameOver', { maxScore: this.maxScore });
    }
}
