import {Vector2} from "../vector/Vector2.js";

export class Canvas {
    /**
     * Receives param of canvas id from applicable html page
     * @param canvasId
     */
    constructor(canvasId) {
        // Set up canvas
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Set up world
        let balls = [
            {
                setMass: 10,
                setX: 100,
                setY: 100,
                setXV: 1,
                setXY: 1,
                setColour: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                setSize: 40,
                setRestitution: 0.1
            },
            {
                random: true
            },
        ];
        // {
        //     random: true
        // },
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
        // ];

        //binding this object
        this.draw = this.draw.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.addBall = this.addBall.bind(this);

        this.world = new World(this.width, this.height, balls, this.draw);

        let addBallClick = document.getElementById('add-ball');
        addBallClick.addEventListener('click', this.addBall);
        // addBallClick.addEventListener('click', this.getNumberOfBalls);
        let clearDemoClick = document.getElementById('clear-demo');
        clearDemoClick.addEventListener('click', this.clearCanvas);
        //clearDemoClick.addEventListener('click', this.getNumberOfBalls);

    }

    /**
     * Drawing the object to the canvas simulation
     * Also calls requestAnimationFrame to continually update the simulation
     * Draw function that receives two parameters to allow it to draw the balls array
     * and then draw again once new position has been set
     * @param toDraw
     * @param done
     */
    draw(toDraw, done) {
        this.context.fillStyle = '#b3cde0';
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
     * Clear the canvas of balls
     */
    clearCanvas() {
        this.world.removeBalls();
    }

    /**
     * Add ball function will add randomObject
     */
    addBall() {
        this.world.addRandomObject();
    }
}

/**
 * Design the world by using balls and physics.
 *
 */
export class World {
    /**
     * Constructor that will receive parameters in order to create a 'world' on canvas.
     * @param width - width of canvas area needed for setting position of balls
     * @param height - height of canvas area needed for setting position of balls
     * @param balls - balls that will be within the world. Received as an array
     * @param draw - allows each ball to be animated and drawn individually
     */
    constructor(width, height, balls, draw) {
        this.width = width;
        this.height = height;
        this.ballsArray = [];
        this.draw = draw;

        /**
         *  Creates a new ball to be drawn to the world depending on the array. If random is set to be true in
         *  one of the array values then a random object will be added to the world.
         *  Otherwise a new ball will be added according to the balls array values.
         */
        balls.forEach(ball => ball.random ? this.addRandomObject() : this.addObject(ball));

        this.setAllNewPositions = this.setAllNewPositions.bind(this);
        this.setNewPosition = this.setNewPosition.bind(this);

        this.setAllNewPositions();
    }

    /**
     * Add an new ball object.
     * Using aggregation when pushing to ballsArray
     * @param setMass
     * @param setX
     * @param setY
     * @param setXV
     * @param setXY
     * @param setColour
     * @param setSize
     * @param setRestitution
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
        let setXV = 1;
        let setXY = 1;
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
            ball.velocity.invertY();
        }

        if ((ball.location.y) < 0) {
            ball.location.y = 0;
            ball.velocity.invertY();
        }

        /**
         * Velocity is equal to current velocity + acceleration
         * Acceleration always begins as (0,0) but updated using applyForce function in Fizzix
         * Hold new locations and velocities as new vectors and set the current objects location and velocity as these
         * @type {{x: *, y: *}}
         */
        let newVelocity = new Vector2(ball.velocity.x, ball.velocity.y).addVector(ball.acceleration);
        ball.acceleration = new Vector2(0, 0); //reset acceleration
        let newLocation = new Vector2(ball.location.x, ball.location.y).addVector(newVelocity);

        /**
         * Implement the check collision function on this ball
         */
        Fizzix.checkCollision(ball, i, ballsArray);

        /**
         * Update the ball velocity and location
         */
        ball.velocity.setVector(newVelocity);
        ball.location.setVector(newLocation);

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
        this.acceleration = new Vector2(0, 0);
    }
}

/**
 * Bulk of Physics Engine work is stored in this Fizzix class
 * Can be extended with other physical influences
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
     */
    static checkCollision(ball1, i, ballsArray) {
        return ballsArray.forEach((ball2, j) => {
            if (i !== j) {
                let sumOfRadius = ball1.size + ball2.size;

                /**
                 * Method find distance between balls while avoiding sqrt function
                 * @type {Vector2}
                 */
                let collisionPositionVector = new Vector2(ball1.location.x - ball2.location.x,
                    ball1.location.y - ball2.location.y);
                let collisionPositionMagnitude = collisionPositionVector.magnitude();

                if (collisionPositionMagnitude < sumOfRadius) {
                    //first resolve the positions of the balls so they don't overlap and cause too many collisions
                    Fizzix.impulse(ball1, ball2);
                    //balls can finally collide
                    Fizzix.calculateNewVelocities(ball1, ball2);
                }
            }
        });
    }

    /**
     * Calculates new velocities of objects that have been deemed to have collided with each other
     * Adapted using
     * REF: http://www.vobarian.com/collisions/2dcollisions2.pdf
     * @param ball1
     * @param ball2
     */
    static calculateNewVelocities(ball1, ball2) {

        let combinedMass = ball1.mass + ball2.mass;

        let normalVector = new Vector2(ball2.location.x - ball1.location.x, ball2.location.y - ball1.location.y);
        let unitVector = new Vector2(normalVector.x / normalVector.magnitude(), normalVector.y / normalVector.magnitude()); //un
        let unitTangent = new Vector2(-unitVector.y, unitVector.x);
        unitTangent.normaliseVector();

        //these will store the dot products
        let v1n = unitVector.dotProduct(ball1.velocity);
        let v1t = unitTangent.dotProduct(ball1.velocity);
        let v2n = unitVector.dotProduct(ball2.velocity);
        let v2t = unitTangent.dotProduct(ball2.velocity);

        //tangential velocities are the same as before collision
        let afterCollisionv1t = v1t;
        let afterCollisionv2t = v2t;

        //one dimensional collision formula
        let afterVelocityBallA = (v1n * (ball1.mass - ball2.mass) + (2 * ball2.mass * v2n)) / combinedMass;
        let afterVelocityBallB = (v2n * (ball2.mass - ball1.mass) + (2 * ball1.mass * v1n)) / combinedMass;

        //scale each vector by the one dimensional figures - also converts back to vector
        let afterv1n = unitVector.scaleMagnitude(afterVelocityBallA);
        let afterv1t = unitTangent.scaleMagnitude(afterCollisionv1t);

        let afterv2n = unitVector.scaleMagnitude(afterVelocityBallB);
        let afterv2t = unitTangent.scaleMagnitude(afterCollisionv2t);

        afterv1n.addVector(afterv1t);
        afterv2n.addVector(afterv2t);

        //set new velocities
        ball1.velocity.setVector(afterv1n);
        ball2.velocity.setVector(afterv2n);
    }

    /**
     * Function that will find the overlap between colliding balls and move them apart
     * Adapted partly using
     * REF: https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
     * @param ball1
     * @param ball2
     */
    static impulse(ball1, ball2) {

        //point of collision as a vector
        let collisionVector = new Vector2(ball1.location.x - ball2.location.x, ball1.location.y - ball2.location.y);

        //store information about both balls
        let combinedMass = ball1.mass + ball2.mass;
        let sumOfRadii = ball1.size + ball2.size;

        //find the miniumum restitution - allows collisions to be elastic
        //let minimumRest = Math.min(ball1.restitution, ball2.restitution);

        //magnitude/length of collision
        let collisionMagnitude = collisionVector.magnitude();

        if (collisionMagnitude > sumOfRadii) {
            return; //there's no collision happening
        }

        //normalise vector so that it is of length 1
        let normalisedCollisionVector = collisionVector.normaliseVector();

        //find the overlap of the balls and create vector by multiplying normalised vector by the overlap
        let movement = normalisedCollisionVector.multiply(sumOfRadii - collisionMagnitude);

        //add this to current ball location to find new location position
        //taking into account the mass of both balls to keep the movement realistic
        let newLocationBall1 = ball1.location.addVector(movement.multiply((ball2.mass / combinedMass)));
        let newLocationBall2 = ball2.location.addVector(movement.multiply((-ball1.mass / combinedMass)));

        //set balls new locations
        ball1.location.setVector(newLocationBall1);
        ball2.location.setVector(newLocationBall2);

        //TODO include restitution in calculating the velocities of balls
    }

    /**
     * Will receive the array holding objects and apply a force (passed as a Vector2) to the velocities of these object
     * eg gravity = new Vector2 (0,0.1)
     * Force = mass * acceleration
     * Acceleration = force/mass
     * @param force
     * @param ball
     */
    static applyForce(force, ball) {
        let acceleration = force.divide(ball.mass);
        ball.acceleration.addVector(acceleration);

    }

    /**
     * Creating friction as a vector to be used in the applyForce function
     * REF: https://sciencing.com/calculate-force-friction-6454395.html
     * @param ball
     */
    static setFriction(ball) {
        //friction acts in the opposite direction of velocity of so can find this by inverting velocity vector
        let friction = ball.velocity;
        friction.invert();

        // using formula for friction - creating the normal and coefficient of friction
        let coefficientOfFriction = 0.01;
        let normal = 1;

        //convert scalar to vector
        let normalisedFriction = friction.normaliseVector();
        let finalFriction = normalisedFriction.multiply(normal * coefficientOfFriction);

        //apply this as a force
        ball.acceleration.addVector(finalFriction);
    }
}

