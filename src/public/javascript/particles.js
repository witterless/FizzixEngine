"use strict";

import {Vector2} from "./vector/Vector2.js";

/**
 * Gets the canvas element from Index page
 * @type {HTMLElement}
 */
let canvas = document.getElementById('particles');
let context = canvas.getContext('2d');

/**
 * Store the height and width of canvas
 */
let width = canvas.width;
let height = canvas.height;

/**
 * Vars in relation to storing the ball object
 */
let numOfBalls = 60;
let ball = null;
let balls = [];

/**
 * Colours of ball objects
 * @type {string[]}
 */
let colours = ['#42ED4A', //colours should be in canvas
    '#FF5733',
    '#EDEA42',
    '#D40A2F',
    '#0CD7DE',
    '#630DD8',
    '#B3B6B7',
    '#FBFCFC'];

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
    //this.ballsArray = [];

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

        let newVelocity = new Vector2(this.velocity.x, this.velocity.y).addVector(this.acceleration);
        let newLocation = new Vector2(this.location.x, this.location.y).addVector(newVelocity);

        this.velocity.setVector(newVelocity);
        this.location.setVector(newLocation);

        let particleIsDead = false;

        // if (this.location.y > height) {
        //     particleIsDead = true;
        // }

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
 * This function will be called when a new ball has been added to the canvas by button click
 */
function addObject() {
    for (let i = 0; i < numOfBalls; i++) {
        ball = new Ball(
            3,
            300,
            225,
            random(-6, 6),
            random(-6, 6),
            colours[getRandomInt(colours.length)],
            6);
        balls.push(ball);
        //console.log(ball);
    }
}

function fireworks(){
    canvas.onclick = function() {
        addObject();
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

let gravity = new Vector2(0, 0.1);

addObject();
fireworks();
//createAttractor();
force(gravity);
//force(wind);
animate();





