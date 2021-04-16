var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var block;
var cursors;
var pot;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    block = this.matter.add.image(200, 50, 'block', null, { ignoreGravity: true });
    block.setStatic(true);

    block2 = this.matter.add.image(400, 50, 'block', null, { ignoreGravity: true });
    block2.setStatic(true);

    var y = 150;
    var prev = block;
    var prev2 = block2;
    pot = this.matter.add.sprite(210, 150, 'ball', null, { shape: 'circle', mass: 0.1 }).setInteractive();

    for (var i = 0; i < 8; i++)
    {
        var ball = this.matter.add.image(200, y, 'ball', null, { shape: 'circle', mass: 0.1 });
        ball.setFixedRotation();
        var ball2 = this.matter.add.image(400, y, 'ball', null, { shape: 'circle', mass: 0.1 });
        ball2.setFixedRotation();

        this.matter.add.joint(prev, ball, (i === 0) ? 90 : 35, 0.4);
        this.matter.add.joint(prev2, ball2, (i === 0) ? 90 : 35, 0.4);

        prev = ball;
        prev2 = ball2;

        if(i == 7) {
            this.matter.add.joint(prev, pot, 35, 0.4);
        }

        y += 28;
    }

    // this.matter.add.mouseSpring();

    cursors = this.input.keyboard.createCursorKeys();

    pot.inputEnabled = true;

    pot.on('pointerdown', function(){
        console.log("Hoe");
    });
}

function update ()
{
    if (cursors.left.isDown)
    {
        pot.setVelocityX(-10);
    }
    else if (cursors.right.isDown)
    {
        pot.setVelocityX(10);
    }
    else
    {
        //pot.setVelocityX(0);
    }

    if (cursors.up.isDown)
    {
        pot.setVelocityY(-10);
    }
    else if (cursors.down.isDown)
    {
        pot.setVelocityY(10);
    }
    else
    {
        //pot.setVelocityY(0);
    }
}
