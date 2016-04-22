var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};


WomanWalking.prototype = new Entity();
WomanWalking.prototype.constructor = WomanWalking;

function WomanWalking(game, spritesheet) {
    this.animation = new Animation(spritesheet, 96, 130, 7, .3, 21, true, 1);
    this.x = 0;
    this.y = 600;
    this.speed = 175;
    this.game = game;
    this.ctx = game.ctx;
}

WomanWalking.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

WomanWalking.prototype.update = function () {
    /*
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
        this.x += this.game.clockTick * this.speed;
    if (this.x > 1034) this.x = -230;
*/
    if (this.animation.elapsedTime < this.animation.totalTime * 12 / 21)
        this.x += this.game.clockTick * this.speed;
    if (this.x > 1034) this.x = -230;

}



function Grevious(game, spritesheet) {
//spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
//606px wide total
    this.animation = new Animation(spritesheet, 81.5, 93, 7, .3, 2, true, 2);
    this.x = 100;
    this.y = 400;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

Grevious.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    //Entity.prototype.draw.call(this);
}

Grevious.prototype.update = function () {
    //this.x += this.game.clockTick * this.speed;
    if (this.x > 1034) this.x = -45;
    Entity.prototype.update.call(this);
}

function Jumper(game,spritesheet) {
    this.animation = new Animation(spritesheet,200, 201.25, 8, .1,24,true,1);
    this.x = 0;
    this.y = 100;
    this.speed = 50;
    this.game = game;
    this.ctx = game.ctx;
}

Jumper.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

Jumper.prototype.update = function () {
    /*
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
        this.x += this.game.clockTick * this.speed;
    if (this.x > 1034) this.x = -230;
*/
    
    this.x += this.game.clockTick * this.speed;
    if (this.x > 1034) this.x = -45;
    Entity.prototype.update.call(this);
}



function Loki(game,spritesheet) {
    this.animation = new Animation(spritesheet, 364,354,8,.04,40,true,.5);
    this.x = 650;
    this.y = 400;
    this.game=game;
    this.ctx = game.ctx;
}

Loki.prototype.draw = function() {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}


Loki.prototype.update = function () {
    //this.x += this.game.clockTick * this.speed;
    if (this.x > 1034) this.x = -45;
    Entity.prototype.update.call(this);
}

/*
// inheritance 
function Cheetah(game, spritesheet) {
    this.animation = new Animation(spritesheet, 512, 256, 2, 0.05, 8, true, 0.5);
    this.speed = 350;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 250);
}

Cheetah.prototype = new Entity();
Cheetah.prototype.constructor = Cheetah;

Cheetah.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 1034) this.x = -230;
    Entity.prototype.update.call(this);
}

Cheetah.prototype.draw = function () {

    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}
*/

//AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/background_chamber.jpg");
/*
AM.queueDownload("./img/runningcat.png");
*/
AM.queueDownload("./img/greviousSaber.png");
AM.queueDownload("./img/womanWalking.png");
AM.queueDownload("./img/loki.png");
AM.queueDownload("./img/jumper.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    //gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background_chamber.jpg")));
    /*
    gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));
    */
    gameEngine.addEntity(new WomanWalking(gameEngine, AM.getAsset("./img/womanWalking.png")));
    gameEngine.addEntity(new Grevious(gameEngine, AM.getAsset("./img/greviousSaber.png")));
    gameEngine.addEntity(new Loki(gameEngine, AM.getAsset("./img/loki.png")));
    gameEngine.addEntity(new Jumper(gameEngine, AM.getAsset("./img/jumper.png")));
    console.log("All Done!");
});