import Phaser from 'phaser/dist/phaser-arcade-physics';

export default class startScene extends Phaser.Scene {
    constructor() {
        console.log('starScene constructor');
        super({ key: "startScene" });
    }

    preload() {
        console.log('starScene preload');
        this.load.image("hokkaido", "assets/Hokkaido.png");
    }

    create() {
        console.log('starScene create');
        this.add.image(300, 300, "hokkaido");

        this.add.rectangle(300, 300, 600, 300, 0x0c1a39);
        
        this.add.text(50, 200, "Keep tapping on the space bar to climb up!\nDont let go, or you will fall!\nTry to reach the highest within 15 seconds\nGood luck!", {
            fontSize: "22px",
            fill: "#fff",
            fontFamily: "Open Sans",
        });

        this.add.text(150, 350, "Press space bar to begin!", {
            fontSize: "26px",
            fill: "#fff",
            fontFamily: "Open Sans",
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