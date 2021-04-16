import Phaser from 'phaser';
import startScene from './startScene';
import mainScene from './mainScene';
import gameOver from './gameOver';
import gameConfig from '../config/gameConfig';

const config = {
    type: Phaser.AUTO,
    width: gameConfig.potBreaker.width,
    height: gameConfig.potBreaker.height,
    backgroundColor: 0x0c88c7,
    physics: {
        default: 'matter'
    },
    scene: [startScene, mainScene, gameOver]
};

export function startPotBreaker() {
    new Phaser.Game(config);
    window.focus();
}