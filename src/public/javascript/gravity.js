"use strict";

import {Vector2} from "./vector/Vector2.js";

/**
 * Gets the canvas element from Index page
 * @type {HTMLElement}
 */
let canvas = document.getElementById('demoCanvas');
let context = canvas.getContext('2d');

/**
 * Store the height and width of canvas
 */
let width = canvas.width;
let height = canvas.height;

/**
 * Add gravity and wind as global variables
 * @type {Vector2}
 */
let gravity = new Vector2(0, 1.5);
let wind = new Vector2(0.5, 0);
let friction = 0.99;

/**
 * Vars in relation to storing the ball object
 */
let numOfBalls = 2;
let ball = null;
let balls = [];

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
 * From MDN
 * Will take a number and return a value up to that number
 * @param max
 * @returns {number}
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

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
            this.velocity.x *= -1 * friction
            //this.velocity.invertX();
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

        let newVelocity = new Vector2(this.velocity.x, this.velocity.y).addVector(this.acceleration);
        let newLocation = new Vector2(this.location.x, this.location.y).addVector(newVelocity);

        this.velocity.setVector(newVelocity);
        this.location.setVector(newLocation);

        this.draw();

        // this.velocity.addVector(this.acceleration);
        // this.location.addVector(this.velocity);
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
        let mass = random(5, 20);
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
 * Add ball object
 */
function addObject() {
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
    ;
}

/**
 * Animate ball objects to canvas
 * Animate the attraction object if created
 */
function animate() {
    requestAnimationFrame(animate);
    context.fillStyle = 'rgb(0,0,0)';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].update();
    }
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

addObject();
force(gravity);
force(wind);
animate();
