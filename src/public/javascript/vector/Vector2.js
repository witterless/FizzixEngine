export class Vector2 {
    /**
     * Constructor for the vector class
     * @param x
     * @param y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * scale a vector by a sum
     * called in the calculate velocity function in Fizzix
     * @param num
     * @returns {Vector2}
     */
    scaleMagnitude(num) {
        let mag = this.magnitude();
        let newMag = mag * num;
        let a = this.findAngle();
        let nx = Math.cos(a) * newMag;
        let ny = Math.sin(a) * newMag;
        // this.x = nx;
        // this.y = ny;
        return new Vector2(nx, ny);
    }

    setVector(vector) {
        this.x = vector.x;
        this.y = vector.y;
        return new Vector2(this.x, this.y);
    }

    /**
     * Finds magnitude or magnitude of a vector
     * @returns {number}
     */
    magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    add(num) {
        this.x += num;
        this.y += num;

        return {
            x: this.x,
            y: this.y
        };
    }

    addX(num) {
        this.x += num;

        return {
            x: this.x,
            y: this.y
        };
    }

    addY(num) {
        this.y += num;

        return {
            x: this.x,
            y: this.y
        };
    }

    subtract(num) {
        this.x -= num;
        this.y -= num;

        return {
            //return new Vector2(this.x,this.y)
            x: this.x,
            y: this.y
        };
    }

    subtractX(num) {
        this.x -= num;

        return {
            x: this.x,
            y: this.y
        };
    }

    subtractY(num) {
        this.y -= num;

        return {
            x: this.x,
            y: this.y
        };
    }

    multiply(num) {
        this.x *= num;
        this.y *= num;

        return new Vector2(this.x, this.y);
    }

    multiplyX(num) {
        this.x *= num;

        return {
            x: this.x,
            y: this.y
        };
    }

    multiplyY(num) {
        this.y *= num;

        return new Vector2(this.x, this.y);
    }

    divide(num) {
        if (num !== 0) {
            this.x /= num;
            this.y /= num;
        } else {
            this.x = 0;
            this.y = 0;
        }
        return new Vector2(this.x, this.y);
        // return {
        //     x: this.x,
        //     y: this.y
        // };
    }

    divideX(num) {
        if (num !== 0) {
            this.x /= num;
        } else {
            this.x = 0;
        }
        return {
            x: this.x,
            y: this.y
        };
    }

    divideY(num) {
        if (num !== 0) {
            this.y /= num;
        } else {
            this.y = 0;
        }
        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Add one vector on to another
     * @param vector
     * @returns {{x: *, y: *}}
     */
    addVector(vector) {
        this.x += vector.x;
        this.y += vector.y;

        //return new Vector2(this.x, this.y);
        return this;
    }

    /**
     * Add to x using x value of other vector
     * @param vector
     * @returns {{x: *, y: *}}
     */
    addVectorX(vector) {
        this.x += vector.x;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     *
     * @param vector
     * @returns {{x: *, y: *}}
     */
    addVectorY(vector) {
        this.y += vector.y;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Subtract using other vector values
     * @param vector
     * @returns {{x: *, y: *}}
     */
    subtractVector(vector) {
        this.x -= vector.x;
        this.y -= vector.y;

        return new Vector2(this.x, this.y);
        // return {
        //     x: this.x,
        //     y: this.y
        // };
    }

    /**
     * Subtract x using x value of other vector
     * @param vector
     * @returns {{x: *, y: *}}
     */
    subtractVectorX(vector) {
        this.x -= vector.x;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Subtract y using y value of other vector
     * @param vector
     * @returns {{x: *, y: *}}
     */
    subtractVectorY(vector) {
        this.y -= vector.y;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Divide vector using other vector
     * Validation included
     * @param vector
     * @returns {{x: *, y: *}}
     */
    divideVector(vector) {
        if (vector.x !== 0 || vector.y !== 0) {
            this.x /= vector.x;
            this.y /= vector.y;
        }
        if (vector.x == 0) {
            this.x = 0;
        }
        if (vector.y == 0) {
            this.y = 0;
        }


        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Divide x using x value of other vector
     * @param vector
     * @returns {{x: *, y: *}}
     */
    divideVectorX(vector) {
        this.x /= vector.x;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Divide y using y value of other vector
     * @param vector
     * @returns {{x: *, y: *}}
     */
    divideVectorY(vector) {
        this.y /= vector.y;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Multiply vector using other vector
     * @param vector
     * @returns {{x: *, y: *}}
     */
    multiplyVector(vector) {
        this.x *= vector.x;
        this.y *= vector.y;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Multiply X using X value of other vector
     * @param vector
     * @returns {{x: *, y: *}}
     */
    multiplyVectorX(vector) {
        this.x *= vector.x;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Multiply Y using y value of other vector
     * @param vector
     * @returns {{x: *, y: *}}
     */
    multiplyVectorY(vector) {
        this.y *= vector.y;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Inverts vector
     * @returns {{x: *, y: *}}
     */
    invert() {
        this.x *= -1;
        this.y *= -1;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Invert X of vector
     * @returns {{x: *, y: *}}
     */
    invertX() {
        this.x *= -1;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * invert Y of vector
     * @returns {{x: *, y: *}}
     */
    invertY() {
        this.y *= -1;

        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Returns dot product of this vector and other vector as scalar amount
     * @param vector
     * @returns {number}
     */
    dotProduct(vector) {
        return (this.x * vector.x) + (this.y * vector.y);
    };


    /**
     * Returns crossProduct as a scalar amount
     * @param vector
     * @returns {number}
     */
    crossProduct(vector) {
        return (this.x * vector.y - this.y * vector.x);
    };

    /**
     * Finds angle of the vector
     * @returns {number}
     */
    findAngle() {
        return Math.atan2(this.x, this.y) * 180 / Math.PI;
    };

    /**
     * Return string of vector
     * @returns {string}
     */
    toString() {
        return 'x:' + this.x + ', y: ' + this.y;
    };

    /**
     *
     * @param vector
     * @returns {{x: number, y: number}}
     */
    normaliseVector() {
        let mag = this.magnitude();
        if (mag === 0) {
            return new Vector2(0, 0);
        } else {
            return new Vector2(this.x / mag, this.y / mag);
        }
    }
}

/**
 * Will allow vector to be returned as object
 * @returns {{x: number, y: number}}
 */
function getObj1() {
    return {
        x: 1,
        y: 2
    };
}

/**
 *  Returns vector
 * @returns {number[]}
 */
function getObj2() {
    return [1, 2];
}

let [x, y] = getObj2();

// export default Vector2;

//module.exports.Vector2 = Vector2;
