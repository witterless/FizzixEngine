/**
 * Function that will set the object size, shape and speed
 * @constructor
 */
function Ball() {

    this.x = 50;
    this.y = 450;
    this.xspeed = 2;
    this.yspeed = 2;
    this.gravity = 0.25; //TODO
    this.gravitySpeed = 0; //TODO
    //this.bounce = 0.6; //TODO

    this.move = function () {
        this.x += this.xspeed;
        this.y += this.yspeed;
    };

    //drawBall the object
    this.drawBall = function () {
        ctx.save();
        ctx.fillStyle = '#429EED';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.restore();
    }

    //TODO
   /* this.newPosition = function(){
        this.gravitySpeed +=this.gravity;
        this.x += this.xspeed;
        this.y += this.yspeed + this.gravitySpeed;
    }*/

}

/**
 * Function that will control how many objects are being created on the canvas
 * and their speed
 * @constructor
 */

/*
function Controller() {

    this.balls = [];
    this.maxX = 500;
    this.maxY = 340;
    this.i = null;

    for (let i = 0; i < 5; ++i) {
        let b = new Ball();
        b.x = Math.floor(Math.random() * Math.floor(this.maxX));
        b.y = Math.floor(Math.random() * Math.floor(this.maxY));
        b.xspeed = (Math.floor(Math.random() * Math.floor(18)) + 2) - 10;
        b.yspeed = (Math.floor(Math.random() * Math.floor(18)) + 2) - 10;
        this.balls.push(b);
    }

    let self = this;

    /!**
     * Function will start the program
     *!/
    this.start = function () {
        this.i = window.setInterval(this.update, 10);
    }

    /!**
     * Stop the program when called
     *!/
    this.stop = function () {
        window.clearInterval(this.i);
    }

    this.update = function () {
        let ctx = document.getElementById('canvas').getContext('2d');
        ctx.clearRect(0, 0, self.maxX, self.maxY);

        /!**
         * For loops to keep objects within canvas space
         *!/
        for (let i = 0; i < self.balls.length; ++i) {
            self.balls[i].move();
            self.balls[i].drawBall(ctx);

            if (self.balls[i].x > self.maxX) {
                self.balls[i].xspeed = 0 - self.balls[i].xspeed;
                self.balls[i].x = self.maxX;
            } else if (self.balls[i].x < 0) {
                self.balls[i].xspeed = 0 - self.balls[i].xspeed;
                self.balls[i].x = 0;
            }
            if (self.balls[i].y > self.maxY) {
                self.balls[i].yspeed = 0 - self.balls[i].yspeed;
                self.balls[i].y = self.maxY;
            } else if (self.balls[i].y < 0) {
                self.balls[i].yspeed = 0 - self.balls[i].yspeed;
                self.balls[i].y = 0;
            }

        }

    }

}*/


let c = new Controller();
c.start();
