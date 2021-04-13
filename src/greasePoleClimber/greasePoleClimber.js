import Phaser from 'phaser/dist/phaser-arcade-physics';
import startScene from './startScene';
import mainScene from './mainScene';

console.log('%cOh! Hello there!!', 'font-size: 20px');
console.log(
    '%cCurious? We developed this game using Phaser, one of the best HTML5 game libraries\nHave a look at https://phaser.io/ Yes it is Free!!!',
    'font-size: 18px'
);
console.log('%cNeed the source code? Contact eClub on TOeClub@grp.pearson.com', 'font-size: 16px');
console.log('Side note: Tampering with the code may disqualify you :( ');

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [startScene, mainScene]
};

export function startGrasePole() {
    new Phaser.Game(config);
}
