//import {Vector2} from "./vector/Vector2.js";

let mouse = {x: 0, y: 0};

function Canvas2D() {
    this.canvas = document.getElementById('pooltable');
    this.context = this.canvas.getContext('2d');
}

Canvas2D.prototype.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Canvas2D.prototype.drawPoolTable = function (image, positionX, positionY) {
    this.context.drawImage(image, positionX, positionY);
}

let Canvas = new Canvas2D();

let image = new Image();

image.src = "../images/pooltableclipart.png";

setTimeout(() => {
    Canvas.drawPoolTable(image, 0, 0);
}, 1000);

function getMousePosition() {
    Canvas.canvas.addEventListener('mousemove', function (event) {
        var rect = Canvas.canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
        let mousePosition = document.getElementById('mouseposition');
        mousePosition.innerHTML = "x: " + mouse.x + " y: " + mouse.y;
    });
}

/**
 * This function will allow user to choose how many ball objects will be in the canvas
 */
function getNumberOfBalls() {

}

window.addEventListener('load', function () {
    getMousePosition();
});