import Phaser from 'phaser/dist/phaser-arcade-physics';
import gameConfig from '../config/gameConfig';

export default class gameOver extends Phaser.Scene {
    constructor() {
        super({ key: "gameOver" });
    }

    init(data){
        this.maxScore = data.maxScore;
    }

    preload() {
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
        
        this.add.text(100, 100, "Game over!\n\nMaximum distance you ran " + this.maxScore + " meters\n\nYou have x tries remaining", {
            font: "bold 22px Open Sans",
            fill: "#443614"
        });

        this.add.text(100, 300, "You can reload or close the browser window", {
            font: "bold 22px Open-Sans",
            fill: "#000"
        });

        this.add.graphics()
        
        this.input.keyboard.on('keyup', function(e){
            if(e.keyCode == 32){
                // this.scene.start('mainScene');
            }
        }, this);
    }

    update() {
        this.forest.tilePositionX += 1;
    }
}