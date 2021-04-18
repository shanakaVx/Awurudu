import Phaser from 'phaser';
import gameConfig from '../config/gameConfig';

export default class mainScene extends Phaser.Scene {
    constructor() {
        super('mainScene');
        this.easelScale = 0.6;
        this.xshake = [200, 700];
        this.startCountDown = gameConfig.markEye.startCountDown;
        this.finalCountDown = gameConfig.markEye.countdown + this.startCountDown + 1;
        this.cordinates = 'x,y';
    }

    preload() {
        this.load.image('forest', 'assets/forest.png');
        this.load.image('easel', 'assets/easel.png');
        this.load.image('commonBg', 'assets/common-bg-01.png');
    }

    create() {
        this.forest = this.add.tileSprite(gameConfig.markEye.width / 2, gameConfig.markEye.height / 2, gameConfig.markEye.width, gameConfig.markEye.height, 'forest');
        this.easel = this.add.image(gameConfig.markEye.width / 2, gameConfig.markEye.height / 2, 'easel');
        this.easel.scale = this.easelScale;

        this.Backdrop = this.add.image(gameConfig.markEye.width / 2, gameConfig.markEye.height / 2, 'commonBg');
        this.Backdrop.setAlpha(0);

        this.blindFold = this.add.rectangle(gameConfig.markEye.width / 2, gameConfig.markEye.height / 2, gameConfig.markEye.width, 100, 0x181625);
        this.blindFold.setAlpha(0.9);

        this.eye = this.add.ellipse(0, 0, 5, 5, 0xffffff, 0);

        this.input.on(
            'pointerdown',
            function () {
                this.cordinates = this.startCountDown <= 0 ? this.input.mousePointer.x + ',' + this.input.mousePointer.y : 'x,y';
                console.log(this.cordinates);
                this.eye.setX(this.input.mousePointer.x);
                this.eye.setY(this.input.mousePointer.y);
                this.eye.setAlpha(1);
            },
            this
        );

        this.markText = this.add.text(gameConfig.markEye.width / 2, gameConfig.markEye.height / 2, 'Ready', {
            fontSize: '26px',
            fill: '#fff',
            stroke: '#fff',
            strokeThickness: 1,
            fontFamily: 'Open Sans',
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        });

        this.markText.setOrigin(0.5);

        this.countDownText = this.add.text(gameConfig.markEye.width / 2, gameConfig.markEye.height - 30, 'Time: ' + this.countDown + 's', {
            fontSize: '26px',
            fill: '#000',
            stroke: '#fff',
            strokeThickness: 1,
            fontFamily: 'Open Sans',
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        });

        this.countDownText.setOrigin(0.5);
        this.countDownText.setAlpha(0);

        this.shakeTimer = this.time.addEvent({
            callback: this.changeEaselX,
            callbackScope: this,
            delay: 1000,
            loop: true
        });

        this.countDownEvent = this.time.delayedCall(this.finalCountDown * 1000, this.onTimerDone, [], this);
    }

    update() {
        // this.easelScale += 0.01
        // this.easel.scale = this.easelScale;

        this.countdownRemains = Math.round(this.finalCountDown - this.countDownEvent.getElapsedSeconds());
        this.countDownText.setText('Time: ' + this.countdownRemains);
    }

    changeEaselX() {
        if (this.startCountDown <= 3) {
            console.log(this.startCountDown);
            this.markText.setText('Mark the eye in: ' + this.startCountDown);
        }

        if (this.startCountDown <= 2) {
            this.tweens.add({
                targets: this.blindFold,
                y: gameConfig.markEye.height / 2 - 200,
                height: gameConfig.markEye.height - 100,
                alpha: 1,
                fill: 0x000000,
                duration: 800,
                ease: 'Cubic.easeOut'
            });
        }

        if (this.startCountDown == 0) {
            this.markText.setText('Click anywhere below to mark the eye!');
            this.markText.setY(25);
            this.markText.setColor('black');
            this.markText.setStroke('#fff', 3);
            this.tweens.add({
                targets: [this.Backdrop, this.countDownText],
                alpha: 1,
                duration: 300,
                ease: 'Cubic.easeOut'
            });
        }

        if (this.startCountDown > 0) {
            this.tweens.add({
                targets: this.easel,
                x: Phaser.Math.Between(this.xshake[0], this.xshake[1]),
                duration: 900,
                ease: 'Cubic.easeOut'
            });
        } else {
            this.shakeTimer.destroy();
        }
        this.startCountDown--;
    }

    onTimerDone() {
        alert(this.cordinates);
        this.scene.start('gameOver', { cordinates: '230,340' });
    }
}
