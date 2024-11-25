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

    let xIzquierda, xDerecha, Ataque;
    let vida;
    let salto;
    let enElAire = false;
    let puedeSaltar = true;
    let ultimaDireccion;

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
        this.animacionIddleIzquierda = [[88,1048],[66,1048],[44,1048],[22,1048]];
        this.velocidad = 1.5;
        this.tamañoX = 23;
        this.tamañoY = 42;
        this.vida = 3;
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

    Thorfinn.prototype.generaAtaqueDerecha = function() {
        this.animacionThorfinnAtaqueDerecha = [[1,362],[34,362],[70,362],[116,362],[157,362]];
        this.animacionThorfinn = this.animacionThorfinnAtaqueDerecha;
    }

    Thorfinn.prototype.generaAtaqueIzquierda = function() {
        this.animacionThorfinnAtaqueIzquierda = [[176,781],[142,781],[87,781],[44,781],[18,781]];
        this.animacionThorfinn = this.animacionThorfinnAtaqueIzquierda;
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

        if (Ataque && xDerecha) {
            miThorfinn.generaAtaqueDerecha();
        }

        if (Ataque && xIzquierda){
            miThorfinn.generaAtaqueIzquierda();
        } else {
            if (Ataque) {
                miThorfinn.generaAtaqueDerecha();
            }
        }

        if (Ataque && ultimaDireccion === "izquierda") {
            miThorfinn.generaAtaqueIzquierda();
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
        const anchoImagen = 100; // Ancho del fragmento del sprite del suelo
    
        plataformas.forEach(plataforma => {
            const cantidadImagen = Math.ceil(plataforma.ancho / anchoImagen);
    
            for (let i = 0; i < cantidadImagen; i++) {
                const xDestino = plataforma.x + i * anchoImagen;
                const anchoDibujo = Math.min(anchoImagen, plataforma.x + plataforma.ancho - xDestino);
    
                ctx.drawImage(
                    imagenSuelo,
                    3, 1,
                    anchoDibujo, 10,
                    xDestino,
                    plataforma.y,
                    anchoDibujo, 10
                );
            }
        });
    }

    function animacionThorfinn() {
        if (xDerecha) {
            posicion = (posicion + 1) % 6;
            miThorfinn.animacionThorfinn = miThorfinn.animacionThorfinnDerecha;
        } else if (xIzquierda) {
            posicion = (posicion + 1) % 6;
            miThorfinn.animacionThorfinn = miThorfinn.animacionThorfinnIzquierda;
        }else if (Ataque && xDerecha){
            posicion = (posicion + 1) % 5;
            miThorfinn.animacionThorfinn = miThorfinn.animacionAtaqueDerecha;
        }else if (Ataque && xIzquierda){
            posicion = (posicion + 1) % 5;
            miThorfinn.animacionThorfinn = miThorfinn.animacionThorfinnAtaqueIzquierda;
        } else {
            if (ultimaDireccion === "izquierda") {
                posicion = (posicion + 1) % 4;
                miThorfinn.animacionThorfinn = miThorfinn.animacionIddleIzquierda;
            } else {
                posicion = (posicion + 1) % 4;
                miThorfinn.animacionThorfinn = miThorfinn.animacionIddle;
            }
            //posicion = (posicion + 1) % 4;
        }
    }

    function activaMovimiento(evt) {
        switch (evt.keyCode) {
            case 37: 
                xIzquierda = true;
                ultimaDireccion = "izquierda";
                break;
            case 39:
                xDerecha = true;
                ultimaDireccion = "derecha";
                break;
            case 38:
                if (!enElAire && puedeSaltar) {
                    miThorfinn.generaPosicionSalto();
                }
                break;
            case 32:
                if (!xIzquierda && !xDerecha) {
                    Ataque = true;
                }
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
            case 38:
                if (enElAire && !puedeSaltar) {
                    miThorfinn.generaPosicionSalto();
                }
                break;
            case 32:
                Ataque = false;
                break;
        }
    }

    function toggleMusica(){
        let musica = document.getElementById("musicaFondo");
        let boton = document.getElementById("botonMusica");

        if (musica.paused) {
            musica.play();
            boton.textContent = "Pausar Música";
        } else {
            musica.pause();
            boton.textContent = "Iniciar Música";
        }

        let botonMusica = document.getElementById("botonMusica");
        botonMusica.addEventListener("click", toggleMusica);
    }

    document.addEventListener("keydown", activaMovimiento, false);
    document.addEventListener("keyup", desactivaMovimiento, false);
    document.getElementById("botonMusica").addEventListener("click", toggleMusica);

    canvas = document.getElementById("miCanvas");
    ctx = canvas.getContext("2d");

    imagen = new Image();
    imagen.src = "../Juego/Assets/img/spriteThorfinn.png";

    imagenSuelo = new Image();
    imagenSuelo.src = "../Juego/Assets/img/imagenSueloyPlataforma.png";

    Thorfinn.prototype.imagen = imagen;

    miThorfinn = new Thorfinn(x, y);
    id1 = setInterval(crearThorfinn, 1000 / 70);
    id2 = setInterval(animacionThorfinn, 1000 / 8);


}