import Phaser from 'phaser';

export default class potBreaker extends Phaser.Scene {
    constructor() {
        super({ key: "startScene" });
    }

    preload() {
        this.load.image("commonBg", "assets/common-bg-01.png");
    }

    create() {
        this.add.image(300, 300, "commonBg");
        
        this.add.text(100, 100, "Click or tap on a pot to smash it\n\nTry to smash as many as blue pots within 30 seconds\n\nGood luck!", {
            font: "bold 22px Open Sans",
            fill: "#443614",
            
        });

        this.add.text(150, 300, "Press space bar to begin!", {
            font: "bold 22px Open-Sans",
            fill: "#000"
        });

        this.add.graphics()
        
        this.input.keyboard.on('keyup', function(e){
            if(e.keyCode == 32){
                this.scene.start('mainScene');
            }
        }, this);
    }

    update() {}
}