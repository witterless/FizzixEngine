import {Vector2} from "../vector/Vector2.js";

export class Canvas {
    constructor(canvasId) {
        // Set up canvas
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Set up world
        let balls = [
            // {
            //     setMass: 10,
            //     setX: 100,
            //     setY: 100,
            //     setXV: 1,
            //     setXY: 1,
            //     setColour: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
            //     setSize: 40,
            //     setRestitution: 0.1
            // },
            {
                random: true
            },
            {
                random: true
            },
            // {
            //     setMass: 10,
            //     setX: 400,
            //     setY: 300,
            //     setXV: 1,
            //     setXY: 1,
            //     setColour: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
            //     setSize: 40,
            //     setRestitution: 0.1
            // },
        ];

        this.draw = this.draw.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.addBall = this.addBall.bind(this);

        this.world = new World(this.width, this.height, balls, this.draw);

        let addBallClick = document.getElementById('add-ball');
        addBallClick.addEventListener('click', this.addBall);
        let clearDemoClick = document.getElementById('clear-demo');
        clearDemoClick.addEventListener('click', this.clearCanvas);

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
     * Used to draw objects on loading
     * @param setMass
     * @param setX
     * @param setY
     * @param setXV
     * @param setXY
     * @param setColour
     * @param setSize
     */
    addObject({setMass, setX, setY, setXV, setXY, setColour, setSize, setRestitution}) {
        let ball = new Ball(setMass, setX, setY, setXV, setXY, setColour, setSize, setRestitution);
        this.ballsArray.push(ball);
    };

    /**
     * Used to add balls to the canvas area
     * This will be for adding random ball object to the canvas (user can click button)
     */
    addRandomObject() {
        let setSize = World.random(25, 40);
        let setMass = setSize;
        let setX = World.random(0, this.width);
        let setY = World.random(0, this.height);
        let setXV = World.random(-1, 1);
        let setXY = World.random(-1, 1);
        let setColour = '#' + (Math.random() * 0xFFFFFF << 0).toString(16); //Sourced from https://stackoverflow.com/questions/5092808/how-do-i-randomly-generate-html-hex-color-codes-using-javascript
        let setRestitution = World.random(0, 1);

        let randomBall = new Ball(setMass, setX, setY, setXV, setXY, setColour, setSize, setRestitution);
        this.ballsArray.push(randomBall);
    };

    /**
     * Sets the objects new positions after being updated
     */
    setAllNewPositions() {
        this.ballsArray.forEach(this.setNewPosition);

        this.draw(this.ballsArray, this.setAllNewPositions);
    };

    /**
     * Updates positions and velocities
     * @param ball
     * @param i
     * @param ballsArray
     */
    setNewPosition(ball, i, ballsArray) {
        //console.log(ball.velocity)

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

        /**
         * hold new locations and velocities as new vectors and set the current objects location and vel as these
         * @type {Vector2}
         */
        let newVelocity = new Vector2(ball.velocity.x, ball.velocity.y);
        let newLocation = new Vector2(ball.location.x, ball.location.y).addVector(newVelocity);

        /**
         * if this returns false then velocity will stay the same and location will be updated according to set velocity
         * @return boolean
         */
        let collision = Fizzix.checkCollision(ball, i, ballsArray);

        if (!collision) {
            ball.velocity.setVector(newVelocity);
            ball.location.setVector(newLocation);
        }
    };

    /**
     * Takes two numbers and finds a random number between them
     * from Mozilla Developer Network
     * REF: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
     * @param min
     * @param max
     * @returns {*}
     */
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Remove all balls from the ballsArray which will remove them from animation
     */
    removeBalls() {
        this.ballsArray = [];
    };
}

/**
 * Function that holds all properties of ball 'object'
 * Although this has been labeled as a ball object this could be extended as any type of object using inheritance
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
    constructor(mass, x, y, xv, yv, colour, size, restitution) {
        this.mass = mass;
        this.location = new Vector2(x, y);
        this.velocity = new Vector2(xv, yv);
        this.colour = colour;
        this.size = size;
        this.restitution = restitution;
    }
}

/**
 * Bulk of Physics Engine work is stored in this Fizzix class
 * Can be extended
 *
 */
export class Fizzix {
    /**
     * Will take the current ball object, current loop number and the ballsArray.
     * Checks if current ball has collided with another one in the ballsArray
     * Returns boolean value to allow the Physics Engine to update objects locations and velocities
     * @param ball1
     * @param i
     * @param ballsArray
     * @returns {*}
     */
    static checkCollision(ball1, i, ballsArray) {
        return ballsArray.reduce((collided, ball2, j) => {
            if (i !== j) {
                // let dx = ball1.location.x - ball2.location.x;
                // let dy = ball1.location.y - ball2.location.y;
                //
                let sumOfRadius = ball1.size + ball2.size;
                // let squareOfRadius = sumOfRadius * sumOfRadius;
                //
                // let distanceSquared = (dx * dx) + (dy * dy);
                // let distance = Math.sqrt(distanceSquared);

                /**
                 * method to avoid using sqrt
                 * @type {Vector2}
                 */
                let collisionPositionVector = new Vector2(ball1.location.x - ball2.location.x, ball1.location.y - ball2.location.y);
                let collisionPositionMagnitude = collisionPositionVector.magnitude();

                if (collisionPositionMagnitude < sumOfRadius) {
                    //first resolve the positions of the balls so they don't overlap and cause too many collisions
                    //Fizzix.collisionResolver(ball1, ball2);
                    //balls can finally collide
                    Fizzix.impulse(ball1, ball2);
                   // Fizzix.collisionResolver(ball1, ball2);
                   // Fizzix.calculateNewVelocities(ball1, ball2);
                    return true;
                } else {
                    return collided;
                }
            } else {
                return collided;
            }
        }, false);
    };

    /**
     * Collision resolver is only called when two objects have been deemed to have collided
     * Purpose is to avoid overlapping before the collision reaction is called
     * @param ball1
     * @param ball2
     */
    static collisionResolver(ball1, ball2) {
        //TODO include restitution!
        const percent = 0.2; //this will make the collision look smoother
        //const slop = 0.01; //Fix objects 'jittering'. In order to prevent this some slack must be given - called slop.

        let distanceVector = new Vector2(ball2.location.x - ball1.location.x, ball2.location.y - ball1.location.y);
        let relativeVel = new Vector2(ball2.velocity.x - ball1.velocity.x, ball2.velocity.y - ball1.velocity.y);
        let velAlongNormal = relativeVel.dotProduct(distanceVector);

        let mag = distanceVector.magnitude();
        let radii = ball1.size + ball2.size;

        /**
         * If velocity along the collision normal is less than 0 then only will the objects be moved away from each other
         */
        if (velAlongNormal < 0) {
            console.log('collision');
            //calculate restitution
            let res = Math.min(ball1.restitution, ball2.restitution);

            //find the overlap of the balls - penetration depth
            let penetrationDepth = radii - mag;

            //find the inverse mass of both colliding balls

            let ball1InverseMass;
            let ball2InverseMass;

            //avoid dividing by 0
            if (ball1.mass > 0) {
                ball1InverseMass = 1 / ball1.mass;
            } else {
                ball1InverseMass = 0;
            }

            if (ball2.mass > 0) {
                ball2InverseMass = 1 / ball2.mass;
            } else {
                ball2InverseMass = 0;
            }

            // //calculate impulse scalar
            // let impulseScalar = -(1 + res) * velAlongNormal;
            // impulseScalar = ball1InverseMass + ball2InverseMass;

            let newBall1Position = distanceVector.multiply(penetrationDepth * percent * ball1InverseMass);
            let newBall2Position = distanceVector.multiply(penetrationDepth * percent * ball2InverseMass);

            let ball1Location = ball1.location.subtractVector(newBall1Position);
            let ball2Location = ball2.location.subtractVector(newBall2Position);

            ball1.location.setVector(ball1Location);
            ball2.location.setVector(ball2Location);
        }

    };

    /**
     * Calculates new velocities of objects that have been deemed to have collided with each other
     * @param ball1
     * @param ball2
     */

    static calculateNewVelocities(ball1, ball2) {
        console.log('calculate');

        let combinedMass = ball1.mass + ball2.mass;

        let normalVector = new Vector2(ball2.location.x - ball1.location.x, ball2.location.y - ball1.location.y);
        let unitVector = new Vector2(normalVector.x / normalVector.magnitude(), normalVector.y / normalVector.magnitude()); //un
        let unitTangent = new Vector2(-unitVector.y, unitVector.x);

        //these will store the dot products
        let v1n = unitVector.dotProduct(ball1.velocity);
        let v1t = unitTangent.dotProduct(ball1.velocity);
        let v2n = unitVector.dotProduct(ball2.velocity);
        let v2t = unitTangent.dotProduct(ball2.velocity);

        let afterCollisionv1t = v1t;
        let afterCollisionv2t = v2t;

        let afterVelocityBallA = (v1n * (ball1.mass - ball2.mass) + (2 * ball2.mass * v2n)) / combinedMass;
        let afterVelocityBallB = (v2n * (ball2.mass - ball1.mass) + (2 * ball1.mass * v1n)) / combinedMass;

        let afterv1n = unitVector.scaleMagnitude(afterVelocityBallA);
        let afterv1t = unitTangent.scaleMagnitude(afterCollisionv1t);

        let afterv2n = unitVector.scaleMagnitude(afterVelocityBallB);
        let afterv2t = unitTangent.scaleMagnitude(afterCollisionv2t);

        afterv1n.addVector(afterv1t);
        afterv2n.addVector(afterv2t);

        ball1.velocity.setVector(afterv1n);
        ball2.velocity.setVector(afterv2n);
    }

    /**
     * REF: http://flatredball.com/documentation/tutorials/math/circle-collision/
     * @param ball1
     * @param ball2
     */
    static impulse(ball1, ball2) {

        let normalVector = new Vector2(ball2.location.x - ball1.location.x, ball2.location.y - ball1.location.y);
        let unitVector = new Vector2(normalVector.x / normalVector.magnitude(), normalVector.y / normalVector.magnitude()); //un
        let unitTangent = new Vector2(-unitVector.y, unitVector.x);

        //point of collision as a vector
        let collisionVector = new Vector2(ball1.location.x - ball2.location.x, ball1.location.y - ball2.location.y);
        let combinedMass = ball1.mass + ball2.mass;
        let sumOfRadii = ball1.size + ball2.size;

        //find the miniumum restitution - allows collisions to be elastic
        let minimumRest = Math.min(ball1.restitution, ball2.restitution);

        let collisionMagnitude = collisionVector.magnitude();

        console.log(collisionVector);
        console.log(collisionMagnitude);

        //get the tangential of the collision point
        collisionVector.normaliseVector();
        let collisionVectorTangent = new Vector2(collisionVector.y, -collisionVector.x);

        //will allow the balls to move away from each other on collision. Fixes overlapping!
        let movement = collisionVector.multiply(sumOfRadii - collisionMagnitude);
        let ball1NewLocation = ball1.location.addVector(movement.multiply(ball2.mass / combinedMass));
        let ball2NewLocation = ball2.location.addVector(movement.multiply(-ball1.mass / combinedMass));

        ball1.location.setVector(ball1NewLocation);
        ball2.location.setVector(ball2NewLocation);

        //TODO use restitution here

        // let velUpdateBall1 = collisionVector.multiply(ball1.velocity.dotProduct(collisionVector));
        // let velUpdateBall1Mag = velUpdateBall1.magnitude();
        //
        //
        // let velUpdateBall2 = collisionVector.multiply(ball2.velocity.dotProduct(collisionVector));
        // let velUpdateBall2Mag = velUpdateBall2.magnitude();


    }

    /**
     * Will receive the array holding objects and apply a force (passed as a Vector2) to the velocities of these object
     * eg gravity = new Vector2 (0,0.1)
     * Force = mass * acceleration
     * Acceleration = force/mass
     * @param force
     * @param ball
     */
    static applyForce(force, ballsArray) {
        for (let i = 0; i < ballsArray.length; i++) {
            let acceleration = force.divide(ballsArray[i].mass);
            ballsArray[i].velocity.addVector(acceleration);
        }
    }
}

new Canvas('myCanvas');