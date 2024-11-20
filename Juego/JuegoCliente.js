window.onload = function () {

    const TOPEDERECHA = 280;
	const TOPIZQUIERDA = 0;
	const TOPARRIBA = 0;
	const TOPABAJO = 473;
    const gravedad = 0;
    const Vsalto = 15;

    let x = 0;
    let y = 100;

    let ctx;
    let posicion = 0;

    let canvas;

    let imagen;
    let miThorfinn; 
    let id1;
    let id2;

    let xIzquierda, xDerecha;
    let salto;

    function Thorfinn (x_, y_) {

        this.x = x_;
        this.y = y_;
        this.animacionThorfinn = [[4,202],[26,202]];
        this.animacionIddle = [[4,202],[26,202],[47,202],[69,202]];
        this.velocidad = 1;
        this.tamañoX = 23;
        this.tamañoY = 42;
    }

    Thorfinn.prototype.generaPosicionDerecha = function () {

        this.x = this.x + this.velocidad;
        if (this.x > TOPEDERECHA) {
			
			this.x = TOPEDERECHA;   
		}
        this.animacionThorfinnDerecha = [[0,261],[56,261],[113,261],[167,261],[224,261],[283,261]];
        this.animacionThorfinn = this.animacionThorfinnDerecha;
    }

    Thorfinn.prototype.generaPosicionIzquierda = function() {
		
		this.x = this.x - this.velocidad;;

		if (this.x < TOPIZQUIERDA) {
			
			this.x = TOPIZQUIERDA;	   
		}
        this.animacionThorfinnIzquierda = [[302,682],[246,682],[188,682],[133,682],[77,682],[21,682]];
        this.animacionThorfinn = this.animacionThorfinnIzquierda;
	}

    /*Thorfinn.prototype.generaPosicionSalto = function() {

        if(!saltando) return;

        this.velocidad -= gravedad;
        this.y -= this.velocidad;

        if (this.y >= TOPARRIBA) {
            this.y = TOPARRIBA;
            saltando = false;
            this.velocidad = 0;
        }
    }
    */
    function crearThorfinn() {

      ctx.clearRect(0, 0, 500, 500);

        if (xDerecha) {
			
            miThorfinn.generaPosicionDerecha();
        }

        if (xIzquierda) {

            miThorfinn.generaPosicionIzquierda();
        }

        /*if (salto) {
            miThorfinn.generaPosicionSalto();
        }
        */
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

    function animacionThorfinn() {

        if (xDerecha) {
            posicion = (posicion + 1) % 6;
            miThorfinn.animacionThorfinn = miThorfinn.animacionThorfinnDerecha;
        }
        else if (xIzquierda) {
            posicion = (posicion + 1) % 6;
            miThorfinn.animacionThorfinn = miThorfinn.animacionThorfinnIzquierda;
        } else {
            miThorfinn.animacionThorfinn = miThorfinn.animacionIddle;
            posicion = (posicion + 1) % 4;
        }

    }

    /*function saltar() {

        if(!saltando) return;

        this.velocidad -= gravedad;
        this.y -= this.velocidad;

        if (this.y >= 100) {
            this.y = 100;
            saltando = false;
            this.velocidad = 0;
        }

    }
    */
    function activaMovimiento(evt) {

        switch (evt.keyCode) {
		
			case 37: 
			  xIzquierda = true;
			  break;
			case 39:
			  xDerecha = true;
			  break;

            case 32:
                salto = true;
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

            case 32:
                salto = false;
                break;
        }
	}


    document.addEventListener("keydown", activaMovimiento, false);
	document.addEventListener("keyup", desactivaMovimiento, false);

    canvas = document.getElementById("miCanvas");
    ctx = canvas.getContext("2d");


    imagen = new Image();
	imagen.src="../Juego/Assets/img/spriteThorfinn.png";

	Thorfinn.prototype.imagen = imagen;

	miThorfinn = new Thorfinn(x, y);
    id1 = setInterval(crearThorfinn, 1000 / 90);
    id2 = setInterval(animacionThorfinn, 1000 / 10);
}