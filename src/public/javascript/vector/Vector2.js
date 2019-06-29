export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Finds magnitude or magnitude of a vector
     * @returns {number}
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
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

        return {
            x: this.x,
            y: this.y
        };
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

        return {
            x: this.x,
            y: this.y
        };
    }

    divide(num) {
        if (num !== 0) {
            this.x /= num;
            this.y /= num;
        } else {
            this.x = 0;
            this.y = 0;
        }

        return {
            x: this.x,
            y: this.y
        };
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
     * Scale vector using scalar amount
     * @param num
     * @returns {{x: *, y: *}}
     */
    scale(num) {
        this.x *= num;
        this.y *= num;

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

        return {
            x: this.x,
            y: this.y
        };
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

        return {
            x: this.x,
            y: this.y
        };
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
     * unfloats vector if needed
     * @returns {{x: *, y: *}}
     */
    unfloat() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

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
        return ((this.x * vector.x) + (this.y * vector.y));
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
        return 'x:' + this.x + ', y:' + this.y;
    };

    /**
     * Receive a vector and rotate it a certain amount of degrees
     * @param vector
     * @param angle
     * @returns {{x: *, y: *}}
     */
    rotateVector(vector, angle) {
        let r = [];
        let x = this.x - vector.x;
        let y = this.y - vector.y;
        r[0] = x * Math.cos(angle) - y * Math.sin(angle);
        r[1] = x * Math.sin(angle) + y * Math.cos(angle);
        r[0] += vector.x;
        r[1] += vector.y;

        return {
            x: r[0],
            y: r[1]
        };
    };

    /**
     *
     * @param vector
     * @returns {{x: number, y: number}}
     */
    normaliseVector() {
        let mag = this.magnitude();
        if (mag === 0) {
            return {
                x: 0,
                y: 0
            };
        } else {
            return {
                x: this.x / mag,
                y: this.y / mag
            };
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
