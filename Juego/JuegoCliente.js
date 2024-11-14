window.onload = function () {

    const TOPEDERECHA = 280;
	const TOPIZQUIERDA = 0;
	const TOPARRIBA = 0;
	const TOPABAJO = 473;

    let x = 0;
    let y = 100;

    let ctx;
    let posicion = 0;

    let canvas;

    let imagen;
    let miThorfinn; 
    let id1;

    let xIzquierda, xDerecha;
    let salto;

    function Thorfinn (x_, y_) {

        this.x = x_;
        this.y = y_;
        this.animacionThorfinn = [[9,211],[31,211]];
        this.velocidad = 2;
        this.tamañoX = 20;
        this.tamañoY = 43;
    }

    Thorfinn.prototype.generaPosicionDerecha = function () {

        this.x = this.x + this.velocidad;
        if (this.x > TOPEDERECHA) {
			
			this.x = TOPEDERECHA;   
		}
        this.animacionThorfinn =[[5,271],[61,271],[115,271],[170,271],[228,271],[286,271]];
    }

    Thorfinn.prototype.generaPosicionIzquierda = function() {
		
		this.x = this.x - this.velocidad;;

		if (this.x < TOPIZQUIERDA) {
			
			this.x = TOPIZQUIERDA;	   
		}

	}

    function crearThorfinn() {

      ctx.clearRect(0, 0, 500, 500);

        if (xDerecha) {
			
            miThorfinn.generaPosicionDerecha();
        }

        if (xIzquierda) {

            miThorfinn.generaPosicionIzquierda();
        }

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

    function activaMovimiento(evt) {

        switch (evt.keyCode) {
		
			case 37: 
			  xIzquierda = true;
			  break;
			case 39:
			  xDerecha = true;
			  break;
		 
		}
	}

	function desactivaMovimiento(evt){

        switch (evt.keyCode) {

			case 37: 
			  xIzquierda = false;
			  break;

			case 39:
			  xDerecha = false;
			  break;
        }
	}

    function caminarDerechaAnimacion () {
        
    }

    document.addEventListener("keydown", activaMovimiento, false);
	document.addEventListener("keyup", desactivaMovimiento, false);

    canvas = document.getElementById("miCanvas");
    ctx = canvas.getContext("2d");


    imagen = new Image();
	imagen.src="../Juego/Assets/img/spriteThorfinn.png";

	Thorfinn.prototype.imagen = imagen;

	miThorfinn = new Thorfinn(x, y);
    id1 = setInterval(crearThorfinn, 1000 / 50);
}