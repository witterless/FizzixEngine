import {Ball, Fizzix} from "./Physics/fizzix.js";
import {Vector2} from "./vector/Vector2.js";


function headOnCollision() {
    class DemoPage {
        constructor(canvasId) {
            // Set up canvas
            this.canvas = document.getElementById(canvasId);
            this.context = this.canvas.getContext('2d');
            this.width = this.canvas.width;
            this.height = this.canvas.height;

            // Set up world
            let balls = [

                {
                    setMass: 30,
                    setX: 100,
                    setY: 150,
                    setXV: 0,
                    setXY: 0,
                    setColour: '#ff90e5',
                    setSize: 30,
                    setRestitution: 0.1
                },
                {
                    setMass: 30,
                    setX: 100,
                    setY: 180,
                    setXV: 0,
                    setXY: 0,
                    setColour: '#ff90e5',
                    setSize: 30,
                    setRestitution: 0.1
                },
                {
                    setMass: 30,
                    setX: 100,
                    setY: 210,
                    setXV: 0,
                    setXY: 0,
                    setColour: '#ff90e5',
                    setSize: 30,
                    setRestitution: 0.1
                },
                {
                    setMass: 30,
                    setX: 100,
                    setY: 240,
                    setXV: 0,
                    setXY: 0,
                    setColour: '#ff90e5',
                    setSize: 30,
                    setRestitution: 0.1
                },
                {
                    setMass: 30,
                    setX: 100,
                    setY: 270,
                    setXV: 0,
                    setXY: 0,
                    setColour: '#ff90e5',
                    setSize: 30,
                    setRestitution: 0.1
                },
                {
                    setMass: 40,
                    setX: this.width / 2 + 200,
                    setY: this.height / 2,
                    setXV: -2,
                    setXY: 0,
                    setColour: '#6aaa7b',
                    setSize: 40,
                    setRestitution: 0.1
                },
            ];

            this.draw = this.draw.bind(this);
            this.clearCanvas = this.clearCanvas.bind(this);
            this.addBall = this.addBall.bind(this);

            this.world = new World(this.width, this.height, balls, this.draw);
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

    class World {
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

            /**
             * Holds new locations and velocities as new vectors and set the current objects location and vel as these
             * @type {Vector2}
             */
            let newVelocity = new Vector2(ball.velocity.x, ball.velocity.y);
            let newLocation = new Vector2(ball.location.x, ball.location.y).addVector(newVelocity);

            Fizzix.checkCollision(ball, i, ballsArray);

            /**
             * if this returns false then velocity will stay the same and location will be updated according to set velocity
             * @return boolean
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

    new DemoPage('demo-canvas');
}

function particlesAndGravity() {
    class DemoPage {
        constructor(canvasId) {
            // Set up canvas
            this.canvas = document.getElementById(canvasId);
            this.context = this.canvas.getContext('2d');
            this.width = this.canvas.width;
            this.height = this.canvas.height;

            // Set up world
            let balls = [
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },

            ];

            this.draw = this.draw.bind(this);
            this.clearCanvas = this.clearCanvas.bind(this);
            this.addBall = this.addBall.bind(this);

            this.world = new World(this.width, this.height, balls, this.draw);
        }

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

    class World {
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
            let setSize = World.random(10, 25);
            let setMass = setSize;
            let setX = World.random(0, this.width);
            let setY = 0;
            let setXV = 0;
            let setXY = 0;
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

            /**
             * Create gravity as a vector
             * @type {Vector2}
             */
            let gravity = new Vector2(0, 3);

            /**
             * Apply gravity as a force using fizzix method
             */
            Fizzix.applyForce(gravity, ball);


            if (ball.location.y > this.height) {
                ball.location.y = this.height;
                ball.velocity.invertY();
            }

            /**
             * Holds new locations and velocities as new vectors and set the current objects location and vel as these
             * @type {{x: *, y: *}}
             */
            let newVelocity = new Vector2(ball.velocity.x, ball.velocity.y).addVector(ball.acceleration);
            ball.acceleration = new Vector2(0, 0); //reset acceleration
            let newLocation = new Vector2(ball.location.x, ball.location.y).addVector(newVelocity);

            /**
             * if this returns false then velocity will stay the same and location will be updated according to set velocity
             * @return boolean
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

    new DemoPage('demo-canvas');
}

function projectile() {
    class DemoPage {
        constructor(canvasId) {
            // Set up canvas
            this.canvas = document.getElementById(canvasId);
            this.context = this.canvas.getContext('2d');
            this.width = this.canvas.width;
            this.height = this.canvas.height;

            // Set up world
            let balls = [
                {
                    setMass: 30,
                    setX: 30,
                    setY: this.height - 30,
                    setXV: 2,
                    setXY: -4,
                    setColour: '#0caa00',
                    setSize: 30,
                    setRestitution: 0.1
                },
                {
                    setMass: 20,
                    setX: 500,
                    setY: this.height,
                    setXV: 0,
                    setXY: 0,
                    setColour: '#ee0200',
                    setSize: 20,
                    setRestitution: 0.1
                },

            ];

            this.draw = this.draw.bind(this);
            this.clearCanvas = this.clearCanvas.bind(this);
            this.addBall = this.addBall.bind(this);

            this.world = new World(this.width, this.height, balls, this.draw);
        }

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

    class World {
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
            let setSize = 10;
            let setMass = setSize;
            let setX = World.random(0, this.width);
            let setY = World.random(0, this.height);
            let setXV = 0;
            let setXY = 0;
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

            /**
             * Create gravity as a vector
             * @type {Vector2}
             */
            let gravity = new Vector2(0, 1);

            if (ball.location.y > this.height) {
                ball.location.y = this.height;
                ball.velocity.invertY();
                //ball.velocity.y /= 2;
            }

            /**
             * Holds new locations and velocities as new vectors and set the current objects location and vel as these
             * @type {{x: *, y: *}}
             */
            let newVelocity = new Vector2(ball.velocity.x, ball.velocity.y).addVector(ball.acceleration);
            ball.acceleration = new Vector2(0, 0); //reset acceleration
            let newLocation = new Vector2(ball.location.x, ball.location.y).addVector(newVelocity);

            let collided = Fizzix.checkCollision(ball, i, ballsArray);

            /**
             * Apply gravity as a force using fizzix method
             */
            Fizzix.applyForce(gravity, ball);

            ball.velocity.setVector(newVelocity);
            ball.location.setVector(newLocation);

            if (collided) {

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

    new DemoPage('demo-canvas');
}

function friction() {
    class DemoPage {
        constructor(canvasId) {
            // Set up canvas
            this.canvas = document.getElementById(canvasId);
            this.context = this.canvas.getContext('2d');
            this.width = this.canvas.width;
            this.height = this.canvas.height;

            // Set up world
            let balls = [
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },
                {
                    random: true
                },

            ];

            this.draw = this.draw.bind(this);
            this.clearCanvas = this.clearCanvas.bind(this);
            this.addBall = this.addBall.bind(this);

            this.world = new World(this.width, this.height, balls, this.draw);
        }

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

    class World {
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
            let setSize = World.random(10, 25);
            let setMass = setSize;
            let setX = World.random(0, this.width);
            let setY = 0;
            let setXV = 0;
            let setXY = 0;
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

            /**
             * Create gravity as a vector
             * @type {Vector2}
             */
            let gravity = new Vector2(0, 1);

            if (ball.location.y > this.height) {
                ball.location.y = this.height;
                ball.velocity.invertY();
                //ball.velocity.y /= 2;
            }

            /**
             * Holds new locations and velocities as new vectors and set the current objects location and vel as these
             * @type {{x: *, y: *}}
             */
            let newVelocity = new Vector2(ball.velocity.x, ball.velocity.y).addVector(ball.acceleration);
            let newLocation = new Vector2(ball.location.x, ball.location.y).addVector(newVelocity);
            ball.acceleration = new Vector2(0, 0); //reset acceleration

            /**
             * Apply friction and gravity as a force using fizzix methods
             */
            Fizzix.setFriction(ball);
            Fizzix.applyForce(gravity, ball);

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

    new DemoPage('demo-canvas');

}

document.getElementById('projectile-page').onclick = function () {
    projectile();
    let updateDiv = document.getElementById('demo-details');
    updateDiv.innerHTML = '<h3>Project Motion</h3>' +
        '<p>Simulation of Projectile Motion</p>' + '' +
        '<button class="pure-button" onclick="">Reset</button>';
};

document.getElementById('particles-page').onclick = function () {
    particlesAndGravity();
    let updateDiv = document.getElementById('demo-details');
    updateDiv.innerHTML = '<h3>Particles reacting to gravity</h3>' +
        '<p>Gravity influencing objects</p>' + '' +
        '<button class="pure-button" onclick="">Reset</button>';
};

document.getElementById('friction-page').onclick = function () {
    friction();
    let updateDiv = document.getElementById('demo-details');
    updateDiv.innerHTML = '<h3>Friction</h3>' +
        '<p>Friction acting on the objects so that they come to a stop</p>' + '' +
        '<button class="pure-button" onclick="">Reset</button>';
};

document.getElementById('head-on-collision').onclick = function () {
    headOnCollision();
    let updateDiv = document.getElementById('demo-details');
    updateDiv.innerHTML = '<h3>Collision</h3>' +
        '<p>Collision Simulation</p>' + '' +
        '<button class="pure-button" onclick="">Reset</button>';
};

