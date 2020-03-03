import {Fizzix, Ball} from "../public/javascript/Physics/fizzix.js";
import {Vector2} from "../public/javascript/vector/Vector2";

describe('Fizzix Class Tests', () => {

    test('Test ball to be instance of Ball', () => {
        const ball = new Ball(5, 10, 10, 1, 1, 'blue', 5, 1);
        expect(ball).toBeInstanceOf(Ball);
    });

    test('Test ball is able to move', () => {
        const ball = new Ball(5, 10, 10, 1, 1, 'blue', 5, 1);

        ball.velocity.addVector(ball.acceleration);
        ball.location.addVector(ball.velocity);
        const expected = new Vector2(11,11);

        expect(ball.location).toEqual(expected);
    });


    test('Test properties of ball is as desired', () => {
        const ball = new Ball(5, 10, 10, 1, 1, 'blue', 5, 1);
        expect(ball).toHaveProperty('mass', 5);
        expect(ball).toHaveProperty('size', 5);
        expect(ball).toHaveProperty('restitution', 1);
        expect(ball).toHaveProperty('colour', 'blue');
        expect(ball).toHaveProperty('velocity', {"x": 1, "y": 1});
        expect(ball).toHaveProperty('location', {"x": 10, "y": 10});
        expect(ball).toHaveProperty('acceleration', {"x": 0, "y": 0})
    });

    test('Fizzix test for set friction will update ball acceleration', () => {
        const ball = new Ball(5, 10, 10, 1, 1, 'blue', 5, 1);

        expect(ball.acceleration.x).toEqual(0);
        expect(ball.acceleration.y).toEqual(0);

        Fizzix.setFriction(ball);

        const expected = new Vector2(-0.007071067811865475, -0.007071067811865475);

        expect(ball.acceleration.x).toEqual(expected.x);
        expect(ball.acceleration.y).toEqual(expected.y);
    });

    test('Testing apply force function test case 1', () => {
        const ball = new Ball(5, 10, 10, 1, 1, 'blue', 5, 1);
        const gravity = new Vector2(0, 1);

        expect(ball.acceleration.x).toEqual(0);
        expect(ball.acceleration.y).toEqual(0);

        Fizzix.applyForce(gravity, ball);

        const expected = new Vector2(0, 0.2);

        expect(ball.acceleration.x).toEqual(expected.x);
        expect(ball.acceleration.y).toEqual(expected.y);

    });

    test('Testing apply force function test case 2', () => {
        const ball = new Ball(90, 100, 210, 4, -1, 'blue', 90, 0);
        const gravity = new Vector2(4, 0);

        expect(ball.acceleration.x).toEqual(0);
        expect(ball.acceleration.y).toEqual(0);

        Fizzix.applyForce(gravity, ball);

        const expected = new Vector2(0.044444444444444446, 0);

        expect(ball.acceleration.x).toEqual(expected.x);
        expect(ball.acceleration.y).toEqual(expected.y);
    });

    test('Testing impulse resolution test case 1 - balls overlap', () => {
        const ball1 = new Ball(90, 100, 210, 4, -1, 'blue', 90, 0);
        const ball2 = new Ball(90, 110, 220, 4, -1, 'blue', 90, 0);

        expect(ball1.location).toEqual({"x": 100, "y": 210});
        expect(ball2.location).toEqual({"x": 110, "y": 220});

        Fizzix.impulse(ball1, ball2);

        expect(ball1.location).toEqual({"x": 41.36038969321073, "y": 151.36038969321072});
        expect(ball2.location).toEqual({"x": 139.31980515339464, "y": 249.31980515339464});

    });

    test('Testing impulse resolution test case 2 - balls overlap', () => {
        const ball1 = new Ball(90, -20, 50, 4, -1, 'blue', 90, 0);
        const ball2 = new Ball(90, -40, 55, 4, -1, 'blue', 90, 0);

        expect(ball1.location).toEqual({"x": -20, "y": 50});
        expect(ball2.location).toEqual({"x": -40, "y": 55});

        Fizzix.impulse(ball1, ball2);

        expect(ball1.location).toEqual({"x": 57.31282501307987, "y": 30.67179374673003});
        expect(ball2.location).toEqual({"x": -78.65641250653994, "y": 64.66410312663498,});

    });

    test('Testing impulse resolution test case 3 - balls are not overlapping', () => {
        const ball1 = new Ball(90, 100, 210, 4, -1, 'blue', 90, 0);
        const ball2 = new Ball(90, 700, 900, 4, -1, 'blue', 90, 0);

        expect(ball1.location).toEqual({"x": 100, "y": 210});
        expect(ball2.location).toEqual({"x": 700, "y": 900});

        expect(Fizzix.impulse(ball1, ball2)).toBeFalsy();
    });

    test('Testing calculating velocities after collision', () => {
        const ball1 = new Ball(90, 100, 210, 1, -1, 'blue', 90, 0);
        const ball2 = new Ball(90, 110, 220, 2, 0, 'blue', 90, 0);

        expect(ball1.velocity).toEqual({"x": 1, "y": -1});
        expect(ball2.velocity).toEqual({"x": 2, "y": 0});

        Fizzix.calculateNewVelocities(ball1, ball2);

        expect(ball1.velocity).toEqual({"x": 0, "y": 2.406718609334435,});
        expect(ball2.velocity).toEqual({"x": -0.7429174811988406, "y": 1.2033593046672175,});
    });

    test('Testing calculating velocities after collision test case 2', () => {
        const ball1 = new Ball(20, -10, 20, 89, -14, 'blue', 20, 0);
        const ball2 = new Ball(30, -5, 15, 10, 0, 'blue', 30, 0);

        expect(ball1.velocity).toEqual({"x": 89, "y": -14});
        expect(ball2.velocity).toEqual({"x": 10, "y": 0});

        Fizzix.calculateNewVelocities(ball1, ball2);

        expect(ball1.velocity).toEqual({"x": 33.91673352577406, "y": 44.588593489197976,});
        expect(ball2.velocity).toEqual({"x": -55.73174766156391, "y": 11.290623126061089,});
    });

});
