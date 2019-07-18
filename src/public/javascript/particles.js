import {Vector2} from "./vector/Vector2.js";

export class Canvas {
    constructor(canvasId) {
        // Set up canvas
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Set up world
        let balls = [
            {
                setMass: 5,
                setX: this.width/2,
                setY: 0,
                setXV: 0,
                setXY: 1,
                setColour: '#0caa00',
                setSize: 15
            },
            {
                setMass: 60,
                setX: this.width/2,
                setY: this.height/2,
                setXV: 0,
                setXY: 0,
                setColour: '#aa0001',
                setSize: 60
            },
        ];

        this.draw = this.draw.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.addBall = this.addBall.bind(this);

        this.world = new World(this.width, this.height, balls, this.draw);


    }

    draw(toDraw, done) {
        this.context.fillStyle = "rgb(10,19,41)";
        this.context.fillRect(0, 0, this.width, this.height);

        toDraw.forEach(draw => {
            this.context.beginPath();
            this.context.arc(draw.location.x, draw.location.y, draw.size, 0, 2 * Math.PI);
            this.context.fillStyle = draw.colour;
            this.context.fill();
            this.context.closePath();
        });

        requestAnimationFrame(done);
    }

    /**
     * remove everything from canvas
     */
    clearCanvas() {
        this.world.removeBalls();
    }

    /**
     * add all user interaction in this class
     */
    addBall() {
        this.world.addRandomObject();
    }


}

/**
 * World function used for creating a canvas area.
 * Includes several functions for while using canvas area.
 */
export class World {
    constructor(width, height, balls, draw) {
        this.width = width;
        this.height = height;
        this.ballsArray = [];
        this.draw = draw;

        balls.forEach(ball => ball.random ? this.addRandomObject() : this.addObject(ball));

        this.setAllNewPositions = this.setAllNewPositions.bind(this);
        this.setNewPosition = this.setNewPosition.bind(this);

        this.setAllNewPositions();
    }

    /**
     * Clear canvas function. Will remove everything from canvas including background
     */


    /**
     * Used to draw objects on loading
     * @param setMass
     * @param setX
     * @param setY
     * @param setXV
     * @param setXY
     * @param setColour
     * @param setSize
     */
    addObject({setMass, setX, setY, setXV, setXY, setColour, setSize}) {
        let ball = new Ball(setMass, setX, setY, setXV, setXY, setColour, setSize);
        this.ballsArray.push(ball);
    };

    /**
     * Used to add balls to the canvas area
     * This will be for adding random ball object to the canvas (user will click button)
     */
    addRandomObject() {
        let setSize = World.random(25, 40);
        let setMass = setSize;
        let setX = World.random(0, this.width);
        let setY = World.random(0, this.height);
        let setXV = World.random(-1, 1);
        let setXY = World.random(-1, 1);
        let setColour = '#' + (Math.random() * 0xFFFFFF << 0).toString(16); //Sourced from https://stackoverflow.com/questions/5092808/how-do-i-randomly-generate-html-hex-color-codes-using-javascript


        let randomBall = new Ball(setMass, setX, setY, setXV, setXY, setColour, setSize);
        this.ballsArray.push(randomBall);
    };

    setAllNewPositions() {
        this.ballsArray.forEach(this.setNewPosition);

        this.draw(this.ballsArray, this.setAllNewPositions);
    };

    setNewPosition(ball, i, ballsArray) {
        if (ball.location.x > this.width) {
            ball.location.x = this.width;
            ball.velocity.invertX();
        }

        if (ball.location.x < 0) {
            ball.location.x = 0;
            ball.velocity.invertX();
        }

        if (ball.location.y > this.height) {
            ball.location.y = this.height;
            //this.ball.velocity.y *= -1 * friction;
            ball.velocity.invertY();
        }

        if ((ball.location.y) < 0) {
            ball.location.y = 0;
            ball.velocity.invertY();
        }

        let newVelocity = new Vector2(ball.velocity.x, ball.velocity.y);
        let newLocation = new Vector2(ball.location.x, ball.location.y).addVector(newVelocity);

        let collision = Fizzix.checkCollision(ball, i, ballsArray);

        if (!collision) {
            ball.velocity.setVector(newVelocity);
            ball.location.setVector(newLocation);
        }

        // this.drawObject(this.context);
    };

    /**
     * Takes two numbers and finds a random number between them
     * from MDN
     * @param min
     * @param max
     * @returns {*}
     */
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Remove all balls from the ballsArray which will remove them from animation
     */
    removeBalls() {
        this.ballsArray = [];
    };
}

/**
 * Function that holds all properties of ball 'object'
 *
 * @param mass
 * @param x Held in Vector2 x param
 * @param y Held in Vector2 y param
 * @param xv Held in Vector2 x param
 * @param yv Held in Vector2 y param
 * @param colour
 * @param size
 * @constructor
 * ball objects will also be pushed into ballsArray once created
 */
export class Ball {
    constructor(mass, x, y, xv, yv, colour, size) {
        this.mass = mass;
        this.location = new Vector2(x, y);
        this.velocity = new Vector2(xv, yv);
        this.colour = colour;
        this.size = size;
    }
}

export class Fizzix {
    static checkCollision(ball1, i, ballsArray) {
        return ballsArray.reduce((collided, ball2, j) => {
            if (i !== j) {
                let dx = ball1.location.x - ball2.location.x;
                let dy = ball1.location.y - ball2.location.y;

                let sumOfRadius = ball1.size + ball2.size;
                let squareOfRadius = sumOfRadius * sumOfRadius;

                let distanceSquared = (dx * dx) + (dy * dy);
                let distance = Math.sqrt(distanceSquared);

                if (distance < sumOfRadius) {
                    //first resolve the positions of the balls so they don't overlap and cause too many collisions
                    Fizzix.collisionResolver(ball1, ball2);
                    //balls can finally collide
                    Fizzix.calculateNewVelocities(ball1, ball2);
                    return true;
                } else {
                    return collided;
                }
            } else {
                return collided;
            }
        }, false);
    };

    static collisionResolver(ballA, ballB) {
        console.log("collision");

        const percent = 0.2; //this will make the collision look smoother

        let distanceVector = new Vector2(ballB.location.x - ballA.location.x, ballB.location.y - ballA.location.y);
        let relativeVel = new Vector2(ballB.velocity.x - ballA.velocity.x, ballB.velocity.y - ballA.velocity.y);
        let velAlongNormal = relativeVel.dotProduct(distanceVector);

        if (velAlongNormal < 0) {
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
    };

    static calculateNewVelocities(ballA, ballB) {

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
    static impulseResolver(ballA,ballB){

    }
}

new Canvas('particles');