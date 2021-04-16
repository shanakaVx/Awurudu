import Phaser from 'phaser';
import gameConfig from '../config/gameConfig';

export default class gameOver extends Phaser.Scene {
    constructor() {
        super({ key: "gameOver" });
    }

    init(data){
        this.hits = data.hits;
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
        
        this.add.text(100, 100, "Game over!\n\nMaximum blue pots you smashed is " + this.hits + "\n\nYou have x tries remaining", {
            fill: "#443614",
            fontSize: '26px',
            fontFamily: 'Open Sans'
        });

        this.add.text(100, 300, "You can reload or close the browser window", {
            fill: "#000",
            fontSize: '22px',
            fontFamily: 'Open Sans'
        });

        this.add.graphics()
        
        this.input.keyboard.on('keyup', function(e){
            if(e.keyCode == 32){
                // this.scene.start('mainScene');
            }
        }, this);
    }

    update() {
        this.forest.tilePositionX += 0.2;
    }
}