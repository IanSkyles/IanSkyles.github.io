//socket connection
var socket = io.connect("http://76.28.150.193:8888");
//buttons for save and load
var saveButton = document.getElementById("save");
var loadButton = document.getElementById("load");
//Board Size (constant) - from index.html - fits my laptop screen good
var canvasWidth = 1300
var canvasHeight = 600
var numberOfBallz = 50


/*
socket.on("ping", function (ping) {
    console.log(ping); socket.emit("pong");
});
*/

//what happens when save button is clicked



function saveGame() {
    console.log("Saving game")
    console.log("Attempting to save " + gameEngine.entities.length + " balls")
    var myBalls = [];
    for(var counter = 0; counter < gameEngine.entities.length;counter++) {
        //push ball to list of stuff to save
        //myBalls.push(gameEngine.entities[counter]);

        var ball = {it: gameEngine.entities[counter].it,
            velocity: gameEngine.entities[counter].velocity,
            visual_radius: gameEngine.entities[counter].visualRadius,
            radius: gameEngine.entities[counter].radius,
            x: gameEngine.entities[counter].x,
            y: gameEngine.entities[counter].y};
        myBalls.push(ball);


    }

    console.log(myBalls.length + " <---the length of my balls")
    socket.emit("save", { studentname: "Ian Skyles", statename: "theBalls", data: myBalls });
    console.log("my balls are now on the server ;)")
}
/*
function saveGame() {
    console.log("Saving game")
    socket.emit("save", { studentname: "Ian Skyles", statename: "theBalls", data: "5" });
    console.log("my number is now on the server ;)")
}
*/
function loadGame() {
    console.log("Loading game")
    socket.emit("load", { studentname: "Ian Skyles", statename: "theBalls" });
};

socket.on("connect", function () {
    console.log("Socket connected.")
});
socket.on("ping", function (ping) {
    console.log(ping); socket.emit("pong");
});

socket.on("load",function (theBalls) {
    theBalls = theBalls.data;
    console.log("Getting balls from server!")
    gameEngine.entities = [];
    for (var eachBall = 0; eachBall < theBalls.length;eachBall++) {
        var remadeBall = new Circle(gameEngine);
        if(theBalls[eachBall].it===true) {
            remadeBall.setIt();

        } else {
            remadeBall.setNotIt();
        }

        remadeBall.radius = theBalls[eachBall].radius;
        remadeBall.velocity=theBalls[eachBall].velocity;
        remadeBall.visualRadius=theBalls[eachBall].visual_radius;
        remadeBall.x=theBalls[eachBall].x;
        remadeBall.y=theBalls[eachBall].y;
        /*

         this.it = true;
         this.color = 0;
         this.visualRadius = 500;
         };

         Circle.prototype.setNotIt = function () {
         this.it = false;
         this.color = 2;
         this.visualRadius = 200;
         */
        gameEngine.addEntity(remadeBall);
    }
    console.log("Balls loaded: " + gameEngine.entities.length)
});


// GameBoard code below
function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game) {
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.colors = ["Yellow", "Green", "Blue", "White"];
    this.setNotIt();
    //Entity(game, x, y)                           max width .can spawn up to 50 right pixels into canvas and 50 height
    Entity.call(this, game, this.radius + Math.random() * (canvasWidth - this.radius * 2), this.radius + Math.random() * (canvasHeight - this.radius * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.setIt = function () {
    this.it = true;
    this.color = 0;
    this.visualRadius = 500;
};

Circle.prototype.setNotIt = function () {
    this.it = false;
    this.color = 2;
    this.visualRadius = 200;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

/*
If circle x coordinate (center) + circle radius  > canvas width
*/
Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > canvasWidth;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

/*
If circle y coordinate (center) + circle radius  > canvas height
*/
Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > canvasHeight; // bottom board pixel
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);

 //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    /*
    Control what happens when code hits left or right border of canvas
    */
    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = canvasWidth - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    /*
    Control what happens when code hits top or bottom border of canvas
    */
    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = canvasHeight - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        //ent = entity hit
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;


            //if circle is bigger than one it hit.
            if(this.radius >= ent.radius) {

                //console.log("this.radius > ent.radius")
                if(this.color === ent.color) {
                    //color is the same             
/*
                    for(var i = 0; i < 4; i++) {
                        var circle = new Circle(this.game);    
                        circle.radius = this.radius / 2;  
                        circle.color = this.color;
                        this.game.addEntity(circle);

                    }*/
                    /*
                    this.removeFromWorld = true
                    ent.removeFromWorld = true
                    numberOfBallz = numberOfBallz-2
                    */

                } else { //color not the same

                    //console.log("ent raidus = " + ent.raidus)
                    //console.log("this raidus = " + this.raidus)

                        /*
                    way too much growth 
                    this.radius += ent.radius / 2;
                    */
                    //only grow if you won't clutter the canvas too much
                    if(this.radius < canvasHeight / 4) {
                        this.radius += 1;
                    }
                    //shrink if you get hit
                    ent.radius -= 1;
                    //if your radius is undeer 5 (tiny) disappear
                    if (ent.radius < 5) {
                        numberOfBallz = numberOfBallz-1
                        //console.log(numberOfBallz)
                        if(ent.it) {
                            if(numberOfBallz < 15) {
                                circle = new Circle(gameEngine);
                                circle.setIt();
                                gameEngine.addEntity(circle);
                            }
                        } else {
                            if(numberOfBallz < 15) {
                                circle = new Circle(gameEngine);
                                gameEngine.addEntity(circle);
                            }
                        }                          

                    
                        ent.removeFromWorld = true
                    }
                    //ent.removeFromWorld = true; 


                }
                
                
            } else {

                //console.log("ballz bounced off of each other")
                this.velocity.x = ent.velocity.x * friction;
                this.velocity.y = ent.velocity.y * friction;
                ent.velocity.x = temp.x * friction;
                ent.velocity.y = temp.y * friction;
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
                ent.x += ent.velocity.x * this.game.clockTick;
                ent.y += ent.velocity.y * this.game.clockTick;
            }

            /*
            if (this.it) {
                this.setNotIt();
                ent.setIt();
            }
            
            else if (ent.it) {
                this.setIt();
                ent.setNotIt();
            }
            */
            
            
        }

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            if (this.it && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
            if (ent.it && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
    }


    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};



// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();

var gameEngine = new GameEngine();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    //console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    console.log("number of ents" + gameEngine.entities.length)
    var circle = new Circle(gameEngine);
    for(var i = 0; i < numberOfBallz / 2; i++) {
        circle = new Circle(gameEngine);
        circle.setIt();
        gameEngine.addEntity(circle);
    }
    for (var i = 0; i < numberOfBallz / 2; i++) {
        circle = new Circle(gameEngine);
        gameEngine.addEntity(circle);
    }
    gameEngine.init(ctx);
    gameEngine.start();
});
