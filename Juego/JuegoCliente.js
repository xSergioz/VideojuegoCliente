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

    let xIzquierda, xDerecha;
    let salto;
    let saltando = false;

    function Thorfinn (x_, y_) {

        this.x = x_;
        this.y = y_;
        this.animacionThorfinn = [[9,211],[31,211],[6,271],[62,271],[117,271],[172,271],[230,271],[288,271]];
        this.velocidad = 1;
        this.tamañoX = 22;
        this.tamañoY = 43;
    }

    Thorfinn.prototype.generaPosicionDerecha = function () {

        this.x = this.x + this.velocidad;
        if (this.x > TOPEDERECHA) {
			
			this.x = TOPEDERECHA;   
		}
        this.animacionThorfinn = [[6,271],[62,271],[117,271],[172,271],[230,271],[288,271]];
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

    function caminarDerechaAnimacion() {
        
        posicion = (posicion + 1) % 6;
    }

    function saltar() {

        if(!saltando) return;

        this.velocidad -= gravedad;
        this.y -= this.velocidad;

        if (this.y >= 100) {
            this.y = 100;
            saltando = false;
            this.velocidad = 0;
        }

    }
    function activaMovimiento(evt) {

        switch (evt.keyCode) {
		
			case 37: 
			  xIzquierda = true;
			  break;
			case 39:
			  xDerecha = true;
              caminarDerechaAnimacion();
			  break;

            case 32:
                salto = true;
                saltar();
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
    id1 = setInterval(crearThorfinn, 1000 / 100);
}