window.onload = function () {

    const TOPEDERECHA = 473;
	const TOPIZQUIERDA = 0;
	const TOPARRIBA = 0;
	const TOPABAJO = 473;

    let x = 0;
    let y = 250;
    let ctx;
    let canvas;

    function Avion (x_, y_) {

        this.x = x_;
        this.y = y_;
        this.velocidad = 10;
        this.tamañoX = 30;
        this.tamañoY = 30;
    }

    function crearAvion() {
        
    }

    canvas = document.getElementById("miCanvas");
    ctx = canvas.getContext("2d");
}