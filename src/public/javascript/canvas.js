import {Vector2} from "./vector/Vector2.js";

/**
 * Gets the canvas element from Index page
 * @type {HTMLElement}
 */
let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');

//let width = canvas.width = window.innerWidth; //1536
//let height = canvas.height = window.innerHeight; //722

/**
 * Store the height and width of canvas
 */
let width = canvas.width;
let height = canvas.height;

/**
 * Store forces in the 'world'
 * @type {number}
 */
let gravity = new Vector2(0, 1.5); //to be stored as Vector
let friction = 0.89; //to be stored as Vector

/**
 * Vars in relation to storing the ball object
 */
let numOfBalls = 4;
let ball = null;
let balls = [];

/**
 * Create vars for object - will store vectors
 */
let location;
let velocity;
let acceleration;

/**
 * Store the mouse in var
 * @type {{x: number, y: number}}
 */
let mouse = {
    x: width / 2,
    y: height / 2
};

let colours = ['#7CEA9C',
    '#55D6BE',
    '#2E5EAA',
    '#665883',
    '#593959'];

/**
 * Function that will return random number between 2 numbers
 * @param min
 * @param max
 * @returns {*}
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get position of mouse while it is hovering over canvas element
 */
function getMousePosition() {
    context.canvas.addEventListener('mousemove', function (event) {
        mouse.x = event.clientX - context.canvas.offsetLeft;
        mouse.y = event.clientY - context.canvas.offsetTop;
        let mousePosition = document.getElementById('mouseposition');
        mousePosition.innerHTML = "x: " + mouse.x + " y: " + mouse.y;
    });
}

window.addEventListener('load', function (event) {
    getMousePosition();
});

/**
 * From MDN
 * Will take a number and return a value up to that number
 * @param max
 * @returns {number}
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Create the ball object, draw it to canvas, update position and clear from canvas
 * @param x
 * @param y
 * @param xv
 * @param yv
 * @param colour
 * @param size
 * @constructor
 */
function Ball(mass, x, y, xv, yv, colour, size) {
    this.mass = mass;
    this.location = new Vector2(x, y);
    this.velocity = new Vector2(xv, yv);
    this.acceleration = new Vector2(0, 0);
    this.colour = colour;
    this.size = size;
    //this.diameter = diameter;

    this.draw = function () {
        context.beginPath();
        context.fillStyle = this.colour;
        //context.strokeStyle = 'black';
        context.arc(this.location.x, this.location.y, this.size, 0, 2 * Math.PI);
        // context.stroke();
        context.fill();
        context.closePath();
    };

    this.update = function () {

        if (this.location.x > width) {
            //velocity.x *= -1;
            this.velocity.invertX();
            this.location.x = width;
        }

        if (this.location.x < 0) {
            //velocity.x *= -1;
            this.velocity.invertX();
        }

        if (this.location.y > height) {
            this.velocity.y *= -1 * friction;
            this.location.y = height;
        }

        if ((this.location.y) < 0) {
            //velocity.y *= -1;
            this.velocity.invertY();
        }

        this.velocity.addVector(this.acceleration);
        this.location.addVector(this.velocity);

        this.draw();
        //collisionDetection();

    };

    this.clear = function () {
        context.clearRect(0, 0, width, height);
    };
}

/**
 * Create ball object and store in array balls[]
 */
function createObject() {
    for (let i = 0; i < numOfBalls; i++) {
        let size = random(10, 50);
        ball = new Ball(
            random(1, 5),
            random(0 + size, width - size),
            random(0 + size, height - size),
            2,
            1,
            colours[getRandomInt(colours.length)],
            size);
        balls.push(ball);
        console.log(balls[i]);
    }
}

/**
 * Animate ball objects to canvas
 */
function animate() {
    requestAnimationFrame(animate);
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].update();
    }
}

function collisionDetection() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i - 1; j >= 0; j--) {
            if (balls[i] !== balls[j]) {
                let dx = balls[i].x - balls[j].x;
                let dy = balls[i].y - balls[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < balls[i].size + balls[j].size) {
                    balls[j].colour = balls[i].colour = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
                    // balls[i].xv = -(balls[i].xv);
                    // balls[i].yv = -(balls[i].yv);
                    // balls[j].xv = -(balls[j].xv);
                    // balls[j].yv = -(balls[j].yv);
                }
            }
        }
    }
}

function collisionReaction() {

}

/**
 * A force is passed through this function. This will then be divided by the mass of the object it's working with.
 * Force will then be added to acceleration of the object.
 */
function force(force) {
    for (let i = 0; i < balls.length; i++) {
        force.divide(balls[i].mass);
        balls[i].acceleration.addVector(force);
    }
}


createObject();
force(gravity);
animate();




