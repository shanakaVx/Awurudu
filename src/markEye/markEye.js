import Phaser from 'phaser';
import startScene from './startScene';
import mainScene from './mainScene';
import gameOver from './gameOver';
import gameConfig from '../config/gameConfig';

const config = {
    type: Phaser.AUTO,
    width: gameConfig.markEye.width,
    height: gameConfig.markEye.height,
    backgroundColor: 0x0c88c7,
    physics: {
        default: 'arcade'
    },
    scene: [startScene, mainScene, gameOver]
};

export function startMarkEye() {
    new Phaser.Game(config);
    window.focus();
}
