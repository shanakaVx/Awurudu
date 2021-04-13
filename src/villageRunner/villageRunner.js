import Phaser from 'phaser/dist/phaser-arcade-physics';
import startScene from './startScene';
import mainScene from './mainScene';
import gameConfig from '../config/gameConfig';

console.log('%cOh! Hello there!!', 'font-size: 20px');
console.log(
    '%cCurious? We developed this game using Phaser, one of the best HTML5 game libraries\nHave a look at https://phaser.io/ Yes it is Free!!!',
    'font-size: 18px'
);
console.log('%cNeed the source code? Contact eClub on TOeClub@grp.pearson.com', 'font-size: 16px');
console.log('Side note: Tampering with the code may disqualify you :( ');

const config = {
    type: Phaser.AUTO,
    width: gameConfig.villageRunner.width,
    height: gameConfig.villageRunner.height,
    backgroundColor: 0x0c88c7,
    physics: {
        default: "arcade"
    },
    scene: [startScene, mainScene]
};

export function startVillageRunner() {
    new Phaser.Game(config);
    window.focus();
}
