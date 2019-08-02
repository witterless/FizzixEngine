import  {Canvas} from "./Physics/fizzix.js";

/**
 * Create a new simulation using canvas on index.html page
 */
let c = new Canvas("myCanvas");

/**
 * Adding interface to the index page
 * @type {HTMLElement}
 */
let addBallClick = document.getElementById('add-ball');
addBallClick.addEventListener('click', c.addBall);

let clearDemoClick = document.getElementById('clear-demo');
clearDemoClick.addEventListener('click', c.clearCanvas);
