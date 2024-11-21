window.onload = function () {

    const TOPEDERECHA = 280;
    const TOPIZQUIERDA = 0;
    const TOPARRIBA = 0;
    const TOPABAJO = 140;
    const gravedad = 1.5;
    let Vsalto = 20;

    let x = 0;
    let y = 100;
    const alturaSuelo = 98;

    let ctx;
    let posicion = 0;

    let canvas;

    let imagen; let imagenSuelo;
    let xSuelo = -1;
    let ySuelo = 140;
    let miThorfinn; 
    let id1;
    let id2;

    let xIzquierda, xDerecha;
    let salto;
    let enElAire = false;
    let puedeSaltar = true;

    let CDTimer;

    let plataformas = [
        { x: 50, y: 80, ancho: 50, alto: 10 }, //Plataforma 1
        { x: 200, y: 80, ancho: 60, alto: 10 } //Plataforma 2
    ];

    function dibujarSuelo(){
        //const ySuelo = TOPABAJO;
        const alturaSuelo = canvas.height - ySuelo;
        const anchoImagen = 100;
        const cantidadImagen = Math.ceil(canvas.width / anchoImagen);
        console.log(`Dibujando suelo en posición (0, ${ySuelo}) con tamaño (${500}, ${alturaSuelo})`);

        for (let i = 0; i < cantidadImagen; i++) {
            ctx.drawImage(imagenSuelo, 3, 1, anchoImagen, alturaSuelo, i * anchoImagen, ySuelo, anchoImagen, alturaSuelo);
        }
        //ctx.drawImage(imagenSuelo, -3, 141, 100, alturaSuelo);
    }

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
        this.x = this.x - this.velocidad;
        if (this.x < TOPIZQUIERDA) {
            this.x = TOPIZQUIERDA;   
        }
        this.animacionThorfinnIzquierda = [[302,682],[246,682],[188,682],[133,682],[77,682],[21,682]];
        this.animacionThorfinn = this.animacionThorfinnIzquierda;
    }

    Thorfinn.prototype.generaPosicionSalto = function () {
        if (enElAire || !puedeSaltar) {
            return;
        }

        enElAire = true;
        Vsalto = 15;

        let saltoInterval = setInterval(() => {
            this.y -= Vsalto;
            Vsalto -= gravedad;

            if (this.y >= TOPABAJO - this.tamañoY) {
                this.y = TOPABAJO - this.tamañoY;
                enElAire = false; 
                clearInterval(saltoInterval);
                
                this.y = alturaSuelo;

                iniciarCD();
            }
            plataformas.forEach(plataforma => {
                if (
                    this.y + this.tamañoY >= plataforma.y &&
                    this.y + this.tamañoY <= plataforma.y + plataforma.alto  &&
                    this.x + this.tamañoX > plataforma.x &&
                    this.x < plataforma.x + plataforma.ancho

                ) {
                    this.y = plataforma.y - this.tamañoY;
                    enElAire = false;
                    clearInterval(saltoInterval);
                }
            });
        }, 20); 
    }

    function iniciarCD() {
        puedeSaltar = false;
        let CD = 3;
    
        CDTimer = setInterval(() => {
            CD--;
    
            if (CD < 1) {
                clearInterval(CDTimer);
                puedeSaltar = true;
            }
        }, 1000);
    }

    function estaSobrePlataforma(thorfinn) {
        return plataformas.some(plataforma => {
            return (
                thorfinn.y + thorfinn.tamañoY === plataforma.y &&
                thorfinn.x + thorfinn.tamañoX > plataforma.x &&
                thorfinn.x < plataforma.x + plataforma.ancho
            );
        });
    }

    function crearThorfinn() {
        ctx.clearRect(0, 0, 500, 500);
        dibujarSuelo();
        dibujarPlataformas();

        if (xDerecha) {
            miThorfinn.generaPosicionDerecha();
        }

        if (xIzquierda) {
            miThorfinn.generaPosicionIzquierda();
        }

        /*if (miThorfinn.y > TOPABAJO - miThorfinn.tamañoY) {
            miThorfinn.y = TOPABAJO - miThorfinn.tamañoY;

            enElAire = false;
           
            miThorfinn.y = alturaSuelo;
        }*/
        if (!estaSobrePlataforma(miThorfinn) && miThorfinn.y + miThorfinn.tamañoY < TOPABAJO) {
            enElAire = true;
            miThorfinn.y += gravedad;
        } else if (miThorfinn.y + miThorfinn.tamañoY >= TOPABAJO) {
            miThorfinn.y = TOPABAJO - miThorfinn.tamañoY;
            enElAire = false;
        }

        ctx.drawImage(miThorfinn.imagen,
            miThorfinn.animacionThorfinn[posicion][0],
            miThorfinn.animacionThorfinn[posicion][1],
            miThorfinn.tamañoX,
            miThorfinn.tamañoY,
            miThorfinn.x,
            miThorfinn.y,
            miThorfinn.tamañoX,
            miThorfinn.tamañoY
        );
    }

    function dibujarPlataformas() {
        plataformas.forEach(plataforma => {
            ctx.fillStyle = "brown";
            ctx.fillRect(plataforma.x, plataforma.y, plataforma.ancho, plataforma.alto);
        });
    }

    function animacionThorfinn() {
        if (xDerecha) {
            posicion = (posicion + 1) % 6;
            miThorfinn.animacionThorfinn = miThorfinn.animacionThorfinnDerecha;
        } else if (xIzquierda) {
            posicion = (posicion + 1) % 6;
            miThorfinn.animacionThorfinn = miThorfinn.animacionThorfinnIzquierda;
        } else {
            miThorfinn.animacionThorfinn = miThorfinn.animacionIddle;
            posicion = (posicion + 1) % 4;
        }
    }

    function activaMovimiento(evt) {
        switch (evt.keyCode) {
            case 37: 
                xIzquierda = true;
                break;
            case 39:
                xDerecha = true;
                break;
            case 32:
                if (!enElAire && puedeSaltar) {
                    miThorfinn.generaPosicionSalto();
                }
                break;
        }
    }

    function desactivaMovimiento(evt) {
        switch (evt.keyCode) {
            case 37: 
                xIzquierda = false;
                break;
            case 39:
                xDerecha = false;
                break;
            case 32:
                if (enElAire && !puedeSaltar) {
                    miThorfinn.generaPosicionSalto();
                }
                break;
        }
    }

    document.addEventListener("keydown", activaMovimiento, false);
    document.addEventListener("keyup", desactivaMovimiento, false);

    canvas = document.getElementById("miCanvas");
    ctx = canvas.getContext("2d");

    imagen = new Image();
    imagen.src = "../Juego/Assets/img/spriteThorfinn.png";

    imagenSuelo = new Image();
    imagenSuelo.src = "../Juego/Assets/img/imagenSueloyPlataforma.png";

    Thorfinn.prototype.imagen = imagen;

    miThorfinn = new Thorfinn(x, y);
    id1 = setInterval(crearThorfinn, 1000 / 90);
    id2 = setInterval(animacionThorfinn, 1000 / 10);
}