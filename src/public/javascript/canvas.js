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
 * @type {Vector2}
 */
let gravity = new Vector2(0, 1.5);
let friction = 0.89;
let wind = new Vector2(0.5, 0);

/**
 * Vars in relation to storing the ball object
 */
let numOfBalls = 5;
let numOfAttractors = 1;
let ball = null;
let balls = [];
let attractors = [];

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
    '#593959',
    '#DDDBF1',
    '#FFB400'];

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

window.addEventListener('load', function () {
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
 * Create an object that can attract the other objects
 */
function AttractionObject(x, y, mass) {
    this.attractionLocation = new Vector2(x, y);
    this.attractionMass = mass;
    this.gravity = 1;

    this.displayAttractor = function () {
        context.beginPath();
        context.strokeStyle = '#000000';
        context.fillStyle = '#505250';
        context.arc(this.attractionLocation.x, this.attractionLocation.y, this.attractionMass, 0, 2 * Math.PI);
        context.stroke();
        context.fill();
        context.closePath();
    };

    this.implementAttraction = function (ballObject) {
        let force = this.attractionLocation.subtractVector(ballObject.location);
        let distance = force.length();

        let strengthOfAttraction = (this.gravity * this.attractionMass * ballObject.mass) / (distance * distance);
        force.multiply(strengthOfAttraction);
        return force;
    }

}

/**
 * Create the ball object, draw it to canvas, update position and clear from canvas
 * @param mass
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
    this.acceleration = new Vector2(0, 0.1);
    this.colour = colour;
    this.size = size;
    this.normalVector = new Vector2()

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
            this.velocity.invertX();
            this.location.x = width;
        }

        if (this.location.x < 0) {
            this.velocity.invertX();
        }

        if (this.location.y > height) {
            this.velocity.y *= -1 * friction;
            //this.velocity.invertY();
            this.location.y = height;
        }

        if ((this.location.y) < 0) {
            this.velocity.invertY();
        }

        this.velocity.addVector(this.acceleration);
        this.location.addVector(this.velocity);
        collisionDetection();
        this.draw();
    };

    this.clear = function () {
        context.clearRect(0, 0, width, height);
    };
}

/**
 * Create ball object and store in array balls[]
 * Create attraction object and store in array attractors[]
 */
function createObject() {
    for (let i = 0; i < numOfBalls; i++) {
        let mass = random(5, 15);
        let size = mass * 2;

        // random(0 + size, width - size)
        // random(0 + size, height - size)

        ball = new Ball(
            mass,
            random(0 + size, width - size),
            random(0 + size, height - size),
            1,
            2,
            colours[getRandomInt(colours.length)],
            size);

        balls.push(ball);
        //console.log(ball);
    }
}

/**
 * Create an attractor object
 */
function createAttractor() {
    for (let i = 0; i < numOfAttractors; i++) {
        let att = new AttractionObject(width / 2, height / 2, 30);
        attractors.push(att);
    }
}

/**
 * Animate ball objects to canvas
 * Animate the attraction object if created
 */
function animate() {
    requestAnimationFrame(animate);
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0, 0, width, height);

    for (let j = 0; j < attractors.length; j++) {
        attractors[j].displayAttractor();
    }

    for (let i = 0; i < balls.length; i++) {
        balls[i].update();
    }
}

/**
 * Function that will check if objects collide
 */
function collisionDetection() {
    let checkCollision = false;

    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            let dx = balls[i].location.x - balls[j].location.x;
            let dy = balls[i].location.y - balls[j].location.y;

            let sumOfRadius = balls[i].size + balls[j].size;
            let squareOfRadius = sumOfRadius * sumOfRadius;

            let distanceSquared = (dx * dx) + (dy * dy);

            if (distanceSquared <= squareOfRadius) {
                console.log("collision");
            }
        }
    }
}

function collided(ball) {


}

// function collisionResolver(ball1, ball2) {
//     ball1.velocity *=-1;
//     ball2.velocity *=-1;
//
// }


/**
 * A force is passed through this function. This will then be divided by the mass of the object it's working with.
 * Force will then be added to acceleration of the object.
 * Force = mass * acceleration
 * Acceleration = force/mass
 */
function force(force) {

    for (let i = 0; i < balls.length; i++) {
        let acc = force.divide(balls[i].mass);
        balls[i].acceleration.addVector(acc);
    }
}


createObject();
//collisionDetection();
createAttractor();
force(gravity);
//force(wind);
animate();




