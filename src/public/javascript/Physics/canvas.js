"use strict";

import {Vector2} from "../vector/Vector2.js";

/**
 * Gets the canvas element from Index page
 * @type {HTMLElement}
 */
let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');

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
let numOfBalls = 2;
let numOfAttractors = 1;
let ball = null;
let balls = [];
let attractors = [];

// /**
//  * Store the mouse in var
//  * @type {{x: number, y: number}}
//  */
// let mouse = {
//     x: width / 2,
//     y: height / 2
// };

/**
 * Colours of ball objects
 * @type {string[]}
 */
let colours = ['#7CEA9C', //colours should be in canvas
    '#4C5B5C',
    '#657ED4',
    '#99B2DD',
    '#BBC2E2',
    '#D1FAFF'];

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
        let rect = canvas.getBoundingClientRect();
        mouse.x = Math.round(event.clientX - rect.left);
        mouse.y = Math.round(event.clientY - rect.top);
        let mousePosition = document.getElementById('mouse-position');
        mousePosition.innerHTML = "x: " + mouse.x + " y: " + mouse.y;
    });
}


/**
 * This function will allow user to choose how many ball objects will be in the canvas
 */
function getNumberOfBalls() {
    let ballNum = document.getElementById("num-of-balls");
    ballNum.innerHTML = "Number of Balls: " + numOfBalls;
}

function increaseBall() {
    numOfBalls += 1;
    console.log(numOfBalls);
    let ballNum = document.getElementById("num-of-balls");
    ballNum.innerHTML = "Number of Balls: " + numOfBalls;
    addObject();
}

/**
 * function to clear the canvas of all balls
 */
function clearCanvas() {
    for (let i = 0; i < balls.length; i++) {
        context.clearRect(0, 0, width, height);
        numOfBalls = 0;
        let ballNum = document.getElementById("num-of-balls");
        ballNum.innerHTML = "Number of Balls: " + numOfBalls;

    }
}

document.getElementById("add-ball").addEventListener("click", increaseBall);
document.getElementById("clear-demo").addEventListener("click", removeBallObject);

window.addEventListener('load', function () {
    //getMousePosition();
    getNumberOfBalls();
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
        let distance = force.magnitude();

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
    //this.acceleration = new Vector2(0, 0.1);
    this.colour = colour;
    this.size = size;
    this.ballsArray = [];

    this.draw = function () {
        context.beginPath();
        context.fillStyle = this.colour;
        //context.strokeStyle = 'black';
        context.arc(this.location.x, this.location.y, this.size, 0, 2 * Math.PI);
        //context.stroke();
        context.fill();
        context.closePath();
    };

    this.update = function () {

        if (this.location.x > width) {
            this.location.x = width;
            this.velocity.invertX();
        }

        if (this.location.x < 0) {
            this.location.x = 0;
            this.velocity.invertX();
        }

        if (this.location.y > height) {
            this.location.y = height;
            this.velocity.y *= -1 * friction;
            //this.velocity.invertY();
        }

        if ((this.location.y) < 0) {
            this.location.y = 0;
            this.velocity.invertY();
        }

        let newVelocity = new Vector2(this.velocity.x, this.velocity.y);
        let newLocation = new Vector2(this.location.x, this.location.y).addVector(newVelocity);

        let collision = collisionDetection();

        if (!collision) {
            this.velocity.setVector(newVelocity);
            this.location.setVector(newLocation);
        }

        this.draw();

        // this.velocity.addVector(this.acceleration);
        // this.location.addVector(this.velocity);
    };

    this.clear = function () {
        context.clearRect(0, 0, width, height);
    };

}


//setInterval(collisionDetection);

/**
 * Create ball object and store in array balls[]
 * Create attraction object and store in array attractors[]
 */
function createObject() {
    for (let i = 0; i < numOfBalls; i++) {
        let mass = random(5, 30);
        let size = mass * 2;

        // random(0 + size, width - size)
        // random(0 + size, height - size)

        ball = new Ball(
            mass,
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-1, 1),
            random(-1, 1),
            colours[getRandomInt(colours.length)],
            size);

        balls.push(ball);
        //console.log(ball);
    }

}

/**
 * This function will be called when a new ball has been added to the canvas by button click
 */
function addObject() {
    for (let i = 0; i < 1; i++) {
        let mass = random(10, 40);
        let size = mass;

        // random(0 + size, width - size)
        // random(0 + size, height - size)

        ball = new Ball(
            mass,
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-1, 1),
            random(-1, 1),
            colours[getRandomInt(colours.length)],
            size);

        balls.push(ball);
        console.log(mass);
        console.log(size);
        //console.log(ball);
    }
}

/**
 * Function that will remove ball 'object' from the balls array
 */
function removeBallObject() {
    for (let i = 0; i < balls.length; i++) {
        numOfBalls = 0;
        balls.pop();
        let ballNum = document.getElementById("num-of-balls");
        ballNum.innerHTML = "Number of Balls: " + numOfBalls;
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
    context.fillStyle = '#040020';
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
    // let collisionPositionBallA = 0;
    // let collisionPositionBallB = 0;

    for (let i = 0; i < balls.length - 1; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            if (balls[j] !== balls[i]) {
                let dx = balls[i].location.x - balls[j].location.x;
                let dy = balls[i].location.y - balls[j].location.y;

                let sumOfRadius = balls[i].size + balls[j].size;
                let squareOfRadius = sumOfRadius * sumOfRadius;

                let distanceSquared = (dx * dx) + (dy * dy);
                let distance = Math.sqrt(distanceSquared);

                if (distanceSquared <= squareOfRadius) {
                    //first resolve the positions of the balls so they don't overlap and cause too many collisions
                    collisionResolver(balls[i], balls[j]);
                    //balls can finally collide
                    calculateNewVelocities(balls[i], balls[j]);

                    //console.log("collision");
                    checkCollision = true;
                } else {
                    checkCollision = false;
                }
            }
        }
    }

    //setTimeout(collisionDetection);
}

/**
 * Position resolving so the balls won't cause continuous collisions due to overlapping
 *
 * REF: https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
 * @param ballA
 * @param ballB
 */
function collisionResolver(ballA, ballB) {

    const percent = 0.2; //this will make the collision look smoother

    let distanceVector = new Vector2(ballB.location.x - ballA.location.x, ballB.location.y - ballA.location.y);
    // let relativeVel = new Vector2(ballB.velocity.x - ballA.velocity.x, ballB.velocity.y - ballA.velocity.y);
    // let velAlongNormal = relativeVel.dotProduct(distanceVector);

    let mag = distanceVector.magnitude();
    let radii = ballA.size + ballB.size;

    //find the overlap of the balls - penetration depth
    let penetrationDepth = radii - mag;

    //find the inverse mass of both colliding balls

    let ballAInverseMass;
    let ballBInverseMass;

    //avoid dividing by 0
    if (ballA.mass > 0) {
        ballAInverseMass = 1 / ballA.mass;
    } else {
        ballAInverseMass = 0;
    }

    if (ballB.mass > 0) {
        ballBInverseMass = 1 / ballB.mass;
    } else {
        ballBInverseMass = 0;
    }

    let newBallAPosition = distanceVector.multiply(penetrationDepth * percent * ballAInverseMass);
    let newBallBPosition = distanceVector.multiply(penetrationDepth * percent * ballBInverseMass);

    let ballALocation = ballA.location.subtractVector(newBallAPosition);
    let ballBLocation = ballB.location.subtractVector(newBallBPosition);

    ballA.location.setVector(ballALocation);
    ballB.location.setVector(ballBLocation);

}


/**
 * Once they positions have been resolved the balls can react to collision
 * REF: vobarian.com/collisions/2dcollisions2.pdf
 * @param ballA
 * @param ballB
 */
function calculateNewVelocities(ballA, ballB) {

    //find the combined mass of each object
    let combinedMass = ballA.mass + ballB.mass;

    let normalVector = new Vector2(ballB.location.x - ballA.location.x, ballB.location.y - ballA.location.y);
    let unitVector = new Vector2(normalVector.x / normalVector.magnitude(), normalVector.y / normalVector.magnitude()); //un
    let unitTangent = new Vector2(-unitVector.y, unitVector.x);

    //these will store the dot products
    let v1n = unitVector.dotProduct(ballA.velocity);
    let v1t = unitTangent.dotProduct(ballA.velocity);
    let v2n = unitVector.dotProduct(ballB.velocity);
    let v2t = unitTangent.dotProduct(ballB.velocity);

    let afterCollisionv1t = v1t;
    let afterCollisionv2t = v2t;

    let afterVelocityBallA = (v1n * (ballA.mass - ballB.mass) + (2 * ballB.mass * v2n)) / combinedMass;
    let afterVelocityBallB = (v2n * (ballB.mass - ballA.mass) + (2 * ballA.mass * v1n)) / combinedMass;

    let afterv1n = unitVector.scaleMagnitude(afterVelocityBallA);
    let afterv1t = unitTangent.scaleMagnitude(afterCollisionv1t);

    let afterv2n = unitVector.scaleMagnitude(afterVelocityBallB);
    let afterv2t = unitTangent.scaleMagnitude(afterCollisionv2t);

    afterv1n.addVector(afterv1t);
    afterv2n.addVector(afterv2t);

    ballA.velocity.setVector(afterv1n);
    ballB.velocity.setVector(afterv2n);
}

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

for (let i = 0; i < numOfBalls; i++) {
    addObject();
}


//createAttractor();
//force(gravity);
//force(wind);
animate();





