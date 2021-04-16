import Phaser from 'phaser';
import gameConfig from '../config/gameConfig';

export default class mainScene extends Phaser.Scene {
    constructor() {
        super('mainScene');
        this.count = 0;
        this.hits = 0;
        this.countdown = gameConfig.potBreaker.countdown;
        this.isRespawning = false;
        this.goodOne = 0;
    }

    preload() {
        this.load.image('forest', 'assets/forest.png');
        this.load.image('beam', 'assets/beam.png');
        this.load.image('pot', 'assets/pot.png');
        this.load.image('rope', 'assets/rope.png');
        this.load.image('smoke', 'assets/smoke.png');
    }

    create() {
        this.goodOne = Math.floor(Math.random() * 3);

        this.isRespawning = false;

        this.forest = this.add.tileSprite(gameConfig.potBreaker.width / 2, gameConfig.potBreaker.height / 2, gameConfig.potBreaker.width, gameConfig.potBreaker.height, 'forest');

        this.beam = this.matter.add.image(450, 100, 'beam', null, { ignoreGravity: true });
        this.beam.setStatic(true);

        this.hook1 = this.matter.add.image(227, 100, 'rope', null, { ignoreGravity: true });
        this.hook2 = this.matter.add.image(450, 100, 'rope', null, { ignoreGravity: true });
        this.hook3 = this.matter.add.image(672, 100, 'rope', null, { ignoreGravity: true });
        this.hook1.setStatic(true);
        this.hook2.setStatic(true);
        this.hook3.setStatic(true);

        let y = 150;
        let prev1 = this.hook1;
        let prev2 = this.hook2;
        let prev3 = this.hook3;

        this.pot1 = this.matter.add.sprite(227, 350, 'pot', null, { shape: 'circle', mass: 0.1 }).setInteractive();
        this.pot1.setFixedRotation();

        this.pot2 = this.matter.add.sprite(450, 350, 'pot', null, { shape: 'circle', mass: 0.1 }).setInteractive();
        this.pot2.setFixedRotation();

        this.pot3 = this.matter.add.sprite(672, 350, 'pot', null, { shape: 'circle', mass: 0.1 }).setInteractive();
        this.pot3.setFixedRotation();

        // this.pots = [];
        // this.pots.push(this.pot1);
        // this.pots.push(this.pot2);
        // this.pots.push(this.pot3);

        // this.goodPot = this.pots[Math.floor(Math.random() * this.pots.length)];
        // this.goodPot.data.set('blue', true);

        for (var i = 0; i < 8; i++) {
            this.rope1 = this.matter.add.image(227, y, 'rope', null, { shape: 'circle', mass: 0.1 });
            this.rope1.setFixedRotation();

            this.rope2 = this.matter.add.image(450, y, 'rope', null, { shape: 'circle', mass: 0.1 });
            this.rope2.setFixedRotation();

            this.rope3 = this.matter.add.image(672, y, 'rope', null, { shape: 'circle', mass: 0.1 });
            this.rope3.setFixedRotation();

            this.matter.add.joint(prev1, this.rope1, 30, 0.4);
            this.matter.add.joint(prev2, this.rope2, 30, 0.4);
            this.matter.add.joint(prev3, this.rope3, 30, 0.4);

            prev1 = this.rope1;
            prev2 = this.rope2;
            prev3 = this.rope3;

            if (i == 7) {
                this.pot1Joint = this.matter.add.joint(prev1, this.pot1, 50, 0.4);
                this.pot2Joint = this.matter.add.joint(prev2, this.pot2, 50, 0.4);
                this.pot3Joint = this.matter.add.joint(prev3, this.pot3, 50, 0.4);
            }

            y += 18;
        }

        this.cursors = this.input.keyboard.createCursorKeys();

        this.pot1.inputEnabled = true;
        this.pot2.inputEnabled = true;
        this.pot3.inputEnabled = true;

        this.countDownEvent = this.time.delayedCall(this.countdown * 1000, this.onTimerDone, [], this);

        this.hitsText = this.add.text(50, 18, 'Hits: 0', {
            fontSize: '26px',
            fill: '#000',
            fontFamily: 'Open Sans'
        });

        this.countDownText = this.add.text(750, 18, 'Time: ' + this.countDown + 's', {
            fontSize: '18px',
            fill: '#000',
            fontFamily: 'Open Sans'
        });

        this.hitsAlertText = this.add.text(450, 300, 'Hit! +', {
            fontSize: '46px',
            fill: '#2700ff',
            stroke: '#2700ff',
            strokeThickness: 3,
            fontFamily: 'Open Sans'
        });
        this.hitsAlertText.setAlpha(0);

        this.pot1.on(
            'pointerdown',
            function () {
                if (this.goodOne == 0) {
                    this.hitsText.setText('Hits: ' + ++this.hits);
                    this.respawn(this.scene, this.pot1, this.pot1Joint);
                }
            },
            this
        );

        this.pot2.on(
            'pointerdown',
            function () {
                if (this.goodOne == 1) {
                    this.hitsText.setText('Hits: ' + ++this.hits);
                    this.respawn(this.scene, this.pot2, this.pot2Joint);
                }
            },
            this
        );

        this.pot3.on(
            'pointerdown',
            function () {
                if (this.goodOne == 2) {
                    this.hitsText.setText('Hits: ' + ++this.hits);
                    this.respawn(this.scene, this.pot3, this.pot3Joint);
                }
            },
            this
        );

        this.particles = this.add.particles('smoke');

        this.emitter = this.particles.createEmitter({
            speed: 0,
            scale: { start: 0, end: 0 },
            blendMode: 'MULTIPLY'
        });
    }

    update() {
        this.forest.tilePositionX = this.input.mousePointer.x/10

        this.count++;
        // console.log(this.goodOne);
        if (this.count == 15) {
            if (!this.isRespawning) {
                this.potVelocities([10, -10], [5, 0]);
            }
            this.count = 0;
        }

        this.countdownRemains = Math.round(this.countdown - this.countDownEvent.getElapsedSeconds());

        this.countDownText.setText('Time: ' + (this.countdownRemains < 0 ? '--' : this.countdownRemains));

        this.hitsText.setText('Hits: ' + this.hits);
    }

    potVelocities(velocityX, velocityY) {
        this.pot1.setVelocityX(Phaser.Math.Between(velocityX[0], velocityX[1]));
        this.pot1.setVelocityY(Phaser.Math.Between(velocityY[0], velocityY[1]));

        this.pot2.setVelocityX(Phaser.Math.Between(velocityX[0], velocityX[1]));
        this.pot2.setVelocityY(Phaser.Math.Between(velocityY[0], velocityY[1]));

        this.pot3.setVelocityX(Phaser.Math.Between(velocityX[0], velocityX[1]));
        this.pot3.setVelocityY(Phaser.Math.Between(velocityY[0], velocityY[1]));
    }

    respawn(thisScene, pot, potJoint) {
        this.matter.world.remove(potJoint);

        this.isRespawning = true;
        this.potVelocities([0, 0], [0, 0]);
        this.emitter.setScale({ start: 3, end: 0 });
        this.emitter.setSpeed(200);
        this.emitter.setGravityY(300);
        this.emitter.startFollow(pot);
        this.countdown = this.countdownRemains;

        this.hitsAlertText.setY(300);
        this.hitsAlertText.setAlpha(1);
        this.tweens.add({
            targets: this.hitsAlertText,
            alpha: 0,
            y: 200,
            duration: 500
        });

        this.tweens.add({
            targets: pot,
            alpha: 0,
            scale: 0,
            y: 1000,
            duration: 1000,
            onComplete: function () {
                thisScene.start('mainScene');
            }
        });
    }

    onTimerDone() {
        this.scene.start('gameOver', { hits: this.hits });
    }
}
