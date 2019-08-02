import {Vector2} from "../public/javascript/vector/Vector2.js";

describe('Vector2 Tests', () => {

    test('Test vector to be instance of Vector2', () => {
        const vector = new Vector2(2,5);
        expect(vector).toBeInstanceOf(Vector2);
    });

    test('Test adding scalar number to vector', () => {
        const testCases = [
            {
                vector: new Vector2(2, 3),
                add: 2,
                expected: new Vector2(4, 5),
            },
            {
                vector: new Vector2(90, 32),
                add: 102,
                expected: new Vector2(192, 134),
            }
        ];
        testCases.forEach(testCase => expect(testCase.vector.add(testCase.add)).toEqual(testCase.expected));
    });

    test('Test multiplying scalar number with vector', () => {
        const testCases = [
            {
                vector: new Vector2(2, 3),
                multiply: 7,
                expected: new Vector2(14, 21),
            },
            {
                vector: new Vector2(90, 32),
                multiply: 100,
                expected: new Vector2(9000, 3200),
            }
        ];
        testCases.forEach(testCase => expect(testCase.vector.multiply(testCase.multiply)).toEqual(testCase.expected));
    });

    test('Test subtracting vector from vector', () => {
        const testCases = [
            {
                vector: new Vector2(67, 750),
                subtract: new Vector2(50, 2),
                expected: new Vector2(17, 748),
            },
            {
                vector: new Vector2(90, 32),
                subtract: new Vector2(0, -2),
                expected: new Vector2(90, 34),
            }
        ];
        testCases.forEach(testCase => expect(testCase.vector.subtractVector(testCase.subtract)).toEqual(testCase.expected));
    });

    test('Test dividing vector by vector', () => {
        const testCases = [
            {
                vector: new Vector2(50, 750),
                divide: new Vector2(0, 75),
                expected: new Vector2(0, 10),
            },
            {
                vector: new Vector2(90, 32),
                divide: new Vector2(9, 2),
                expected: new Vector2(10, 16),
            }
        ];
        testCases.forEach(testCase => expect(testCase.vector.divideVector(testCase.divide)).toEqual(testCase.expected));
    });

    test('Test invert vector', () => {
        const testCases = [
            {
                vector: new Vector2(50, 750),
                expected: new Vector2(-50, -750),
            },
            {
                vector: new Vector2(-90, -32),
                expected: new Vector2(90, 32),
            }
        ];
        testCases.forEach(testCase => expect(testCase.vector.invert()).toEqual(testCase.expected));
    });

    test('Test invert vector x', () => {
        const testCases = [
            {
                vector: new Vector2(50, 750),
                expected: new Vector2(-50, 750),
            },
            {
                vector: new Vector2(-90, -32),
                expected: new Vector2(90, -32),
            }
        ];
        testCases.forEach(testCase => expect(testCase.vector.invertX()).toEqual(testCase.expected));
    });

    test('Dot product of two vectors', () => {
        const testCases = [
            {
                vector: new Vector2(5, 3),
                test: new Vector2(89, 9),
                expected: 472,
            },
            {
                vector: new Vector2(90, 2),
                test: new Vector2(90, 80),
                expected: 8260,
            }
        ];
        testCases.forEach(testCase => expect(testCase.vector.dotProduct(testCase.test)).toEqual(testCase.expected));
    });

    test('Test find angle of vector', () => {
        const testCases = [
            {
                vector: new Vector2(70, 345),
                expected: 11.469530332866906,
            },
            {
                vector: new Vector2(145, 2),
                expected: 89.20976349757082,
            }
        ];
        testCases.forEach(testCase => expect(testCase.vector.findAngle()).toEqual(testCase.expected));
    });

    test('Test magnitude of vector', () => {
        const testCases = [
            {
                vector: new Vector2(30, 10),
                expected: 31.622776601683793,
            },
            {
                vector: new Vector2(70, 2),
                expected: 70.02856560004639,
            }
        ];
        testCases.forEach(testCase => expect(testCase.vector.magnitude()).toEqual(testCase.expected));
    });

    test('Testing set vector', () => {
        const testCases = [
            {
                vector: new Vector2(30, 10),
                test: new Vector2(20,30),
                expected: new Vector2(20,30),
            },
            {
                vector: new Vector2(-80, 754),
                test: new Vector2(0,23),
                expected: new Vector2(0,23),
            }
        ];
        testCases.forEach(testCase => expect(testCase.vector.setVector(testCase.test)).toEqual(testCase.expected));
    });

    test('Testing divide by scalar num', () => {
        const testCases = [
            {
                vector: new Vector2(30, 10),
                num: 0,
                expected: new Vector2(0,0),
            },
            {
                vector: new Vector2(-80, 754),
                num: 5,
                expected: new Vector2(-16,150.8),
            }
        ];
        testCases.forEach(testCase => expect(testCase.vector.divide(testCase.num)).toEqual(testCase.expected));
    });
});
