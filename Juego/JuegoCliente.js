window.onload = function () {

    const TOPEDERECHA = 473;
	const TOPIZQUIERDA = 0;
	const TOPARRIBA = 0;
	const TOPABAJO = 473;

    let x = 0;
    let y = 50;
    let ctx;
    let posicion = 0;
    let canvas;
    let imagen;
    let miThorfinn;
    let id1;

    function Thorfinn (x_, y_) {

        this.x = x_;
        this.y = y_;
        this.animacionThorfinn = [[9,211],[31,211]];
        this.velocidad = 10;
        this.tamañoX = 20;
        this.tamañoY = 45;
    }

    function crearThorfinn() {

      ctx.clearRect(0, 0, 500, 500);
        //console.log(miThorfinn.imagen);
        //console.log(miThorfinn.x, " - ",miThorfinn.y);

        ctx.drawImage(miThorfinn.imagen,
                      miThorfinn.animacionThorfinn[posicion][0],
                      miThorfinn.animacionThorfinn[posicion][1],
                      miThorfinn.tamañoX,
					  miThorfinn.tamañoY,
					  miThorfinn.x,
					  miThorfinn.y,
					  miThorfinn.tamañoX,
					  miThorfinn.tamañoY);			  

	}


    canvas = document.getElementById("miCanvas");
    ctx = canvas.getContext("2d");


    imagen = new Image();
	imagen.src="/home/alumno/Documentos/GitHub/VideojuegoCliente/Assets/img/spriteThorfinn.png";

//    imagen.src="248259.png";
	Thorfinn.prototype.imagen = imagen;

	miThorfinn = new Thorfinn( x, y);

    id1= setInterval(crearThorfinn, 1000/50);
}