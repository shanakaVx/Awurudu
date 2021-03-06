const gameConfig = {
    villageRunner: {
        // game canvas width
        width: 900,

        // game canvas height
        height: 600,

        // platform speed range, in pixels per second
        platformSpeedRange: [300, 300],

        // spawn range, how far should be the rightmost platform from the right edge
        // before next platform spawns, in pixels
        spawnRange: [80, 300],

        // platform width range, in pixels
        platformSizeRange: [90, 300],

        // a height range between rightmost platform and next platform to be spawned
        platformHeightRange: [-5, 5],

        // a scale to be multiplied by platformHeightRange
        platformHeighScale: 20,

        // platform max and min height, as screen height ratio
        platformVerticalLimit: [0.4, 0.8],

        // player gravity
        playerGravity: 900,

        // player jump force
        jumpForce: 400,

        // player starting X position
        playerStartPosition: 200,

        // consecutive jumps allowed
        jumps: 2,

        // % of probability a coin appears on the platform
        kokisPercent: 25,

        // countdown
        countdown: 60
    },
    potBreaker: {
        // game canvas width
        width: 900,

        // game canvas height
        height: 600,

        // countdown
        countdown: 60
    },
    markEye: {
        // game canvas width
        width: 900,

        // game canvas height
        height: 600,

        // Count down to start the game
        startCountDown: 6,

        // countdown to end
        countdown: 10
    }
};

export default gameConfig;
