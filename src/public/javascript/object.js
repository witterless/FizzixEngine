//import Vector2 from 'vector/Vector2.js';

let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');

//let width = canvas.width = window.innerWidth; //1536
//let height = canvas.height = window.innerHeight; //722

let width = canvas.width;
let height = canvas.height;

let numOfBalls = 5;

// let location = new Vector2(20, 33);
// let acceleration = new Vector2(2, 2);

function random(min, max) {
    let number = Math.floor(Math.random() * (max - min + 1)) + min;
    return number;
}

/**
 * TODO add mass and diameter to ball object - velocity  * mass will show how the object reacts to gravity
 * @param x
 * @param y
 * @param xspeed
 * @param yspeed
 * @param colour
 * @param size
 * @param mass
 * @param diameter
 * @constructor
 */
function Ball(x, y, xspeed, yspeed, colour, size) {
    this.x = x;
    this.y = y;
    this.xspeed = xspeed;
    this.yspeed = yspeed;
    this.colour = colour;
    this.size = size;
    // this.mass = mass;
    // this.diameter = diameter;
    //this.bounce = 0.6;

}


/**
 *
 * @param widthRect
 * @param heightRect
 * @param colourRect
 * @param xRect
 * @param yRect
 * @constructor
 */
function Rectangle(widthRect, heightRect, colourRect, xRect, yRect) {
    this.widthRect = widthRect;
    this.heightRect = heightRect;
    this.colourRect = colourRect;
    this.xRect = xRect;
    this.yRect = yRect;
}

let balls = [];
//let rectangles = [];

//could get user input here for about of balls
while (balls.length < numOfBalls) {
    let size = random(10, 40);

    let b = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        2,
        2,
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size);
    balls.push(b);
}


// while (rectangles.length < 1) {
//     let r = new Rectangle(
//         random(10, 20),
//         random(10, 20),
//         'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
//         random(10, 20),
//         random(10, 20));
//     rectangles.push(r);
// }


/**
 * function that will drawBall a ball on to the canvas
 */
Ball.prototype.drawBall = function () {
    context.beginPath();
    context.fillStyle = this.colour;
    //context.strokeStyle = 'black';
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    //context.stroke();
    context.fill();
    context.closePath();
};

/**
 * Draw a rectangle
 */
Rectangle.prototype.drawRect = function () {
    context.rect(this.xRect, this.yRect, this.widthRect, this.heightRect);
    context.fillStyle = this.colourRect;
    context.stroke();
    context.fill();
};

/**
 *clear the canvas
 */
Ball.prototype.clear = function () {
    context.clearRect(0, 0, width, height);
};

/**
 * update the objects position
 */
Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.xspeed = -(this.xspeed);
    }

    if ((this.x - this.size) <= 0) {
        this.xspeed = -(this.xspeed);
    }

    if ((this.y + this.size) >= height) {
        this.yspeed = -(this.yspeed);
    }

    if ((this.y - this.size) <= 0) {
        this.yspeed = -(this.yspeed);
    }

    //increase speed of objects and add gravitational pull
    this.x += this.xspeed;
    this.y += this.yspeed;


};

/**
 * Will allow the ball to bounce on y axis
 */
Ball.prototype.implementMomentum = function () {
    for (let i = 0; i < balls.length; i++) {
        balls[i].y += this.gravity;

        if ((balls[i].y + balls[i].size) > height) {
            balls[i].y = height - balls[i].size;
            balls[i].yspeed *= this.bounce;
        }
    }
};
/**
 * Simple collision detection
 */
Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            let dx = this.x - balls[j].x;
            let dy = this.y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].colour = this.colour = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
};

/**
 * Function here that will stop an object when it hits the bottom of the canvas
 */
Ball.prototype.hitBottom = function () {

    //allow the ball to bounce
    // if (this.y + this.size > height) {
    //     this.y = height - this.size;
    //     this.yspeed *= this.bounce;
    //
    //     //stop the ball from bouncing when it hits the ground
    //     //TODO figure out figures to make the objects stop
    //     if (this.yspeed < 1.9 && this.yspeed > -0.7) {
    //         this.yspeed = 0;
    //     }
    //     if (Math.abs(this.xspeed) < -4) {
    //         this.xspeed = 0;
    //     }
    // }

};

/**
 * Function to animate the objects
 */

function loopThroughBalls() {
    requestAnimationFrame(loopThroughBalls);
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].drawBall();
        balls[i].update();
        //balls[i].collisionDetect();
        //balls[i].hitBottom();
        //balls[i].implementMomentum();
        //rectangles[i].drawRect();

    }

}

loopThroughBalls();

