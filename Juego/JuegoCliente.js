let historialPuntuaciones = [];
let historialNiveles = [];

function cargarHistorial() {
    historialPuntuaciones = JSON.parse(localStorage.getItem('historialPuntuaciones')) || [];
    historialNiveles = JSON.parse(localStorage.getItem('historialNiveles')) || [];
}

  function guardarHistorial() {
    localStorage.setItem('historialPuntuaciones', JSON.stringify(historialPuntuaciones));
}

  function mostrarHistorial() {
	const recordsList = document.getElementById("recordsList");
	recordsList.innerHTML = ""; // Limpiar la lista
  
	historialPuntuaciones.forEach((puntuacion, index) => {
	  const recordItem = document.createElement("li");
	  recordItem.textContent = `Record ${index + 1}: ${puntuacion.toFixed(2).replace('.', ',')} segundos`;
	  recordsList.appendChild(recordItem);
	});
}

function mostrarRecords() {
	const recordsList = document.getElementById("recordsList");
  
	const nuevoRecord = (tiempoFin - tiempoInicio) / 1000; // Convertir a segundos
  
	// Verifica si es un nuevo récord
	if (nuevoRecord > recordTiempo) {
	  historialPuntuaciones.push(nuevoRecord);
	  recordTiempo = nuevoRecord;
  
	  // Guarda el historial actualizado
	  localStorage.setItem('historialPuntuaciones', JSON.stringify(historialPuntuaciones));
	}
  
	// Muestra el historial
	mostrarHistorial();
}

window.onload = function () {

    const TOPEDERECHA = 280;
    const TOPIZQUIERDA = 0;
    const TOPARRIBA = 0;
    const TOPABAJO = 140;
    const TOPEINFERIORBORRADO = 520;
    const gravedad = 1.5;
    let Vsalto = 20;

    let x = 0;
    let y = 100;
    const alturaSuelo = 98;

    let ctx;
    let posicion = 0;

    cargarHistorial();

    let canvas;

    let imagen; let imagenSuelo; let imagenFlecha;
    let xSuelo = -1;
    let ySuelo = 140;
    let miThorfinn; 
    let id1;
    let id2;
    let id3;
    let id4;
    let id5;

    let xIzquierda, xDerecha, Ataque;
    let vida = 3;
    let salto;
    let enElAire = false;
    let puedeSaltar = true;
    let ultimaDireccion;

    let CDTimer;

    const flechas = [];
    let nivel = 1;

    let tiempoInicio = Date.now();
    let tiempoFin = null;

	let recordTiempo = 0;
    let Vflechas = 1;

    let velocidadCaida = 1; // Velocidad inicial de las flechas
    let frecuenciaCaida = 1000; // Frecuencia inicial para la creación de flechas (en milisegundos)
    let intervaloJuego;
    

    let plataformas = [
        { x: 50, y: 70, ancho: 50, alto: 10 }, //Plataforma 1
        { x: 200, y: 70, ancho: 60, alto: 10 } //Plataforma 2
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

    function Flecha (x__, y__, velocidad__) {
        this.x = x__;
        this.y = y__;
        this.ancho = 10;
        this.alto = 30;
        this.velocidad = velocidad__;
    }
    

    function mostrarHistorial() {
        const recordsList = document.getElementById("recordsList");
        recordsList.innerHTML = ""; // Limpiar la lista
    
        historialPuntuaciones.forEach((puntuacion, index) => {
            const recordItem = document.createElement("li");
            recordItem.textContent = `Intento ${index + 1}: Puntuación: ${puntuacion.toFixed(2).replace('.', ',')} segundos, Nivel: ${historialNiveles[index]}`;
            recordsList.appendChild(recordItem);
        });
    }

    function mostrarRecords() {
        const recordsList = document.getElementById("recordsList");
        const nuevoRecord = (tiempoFin - tiempoInicio) / 1000; // Convertir a segundos
    
        // Verifica si es un nuevo récord
        if (nuevoRecord > recordTiempo) {
            historialPuntuaciones.push(nuevoRecord);
            recordTiempo = nuevoRecord;
    
            // Guarda el historial actualizado
            localStorage.setItem('historialPuntuaciones', JSON.stringify(historialPuntuaciones));
        }
        // Muestra el historial
        mostrarHistorial();
    }

    function crearFlechas() {
        const flecha = new Flecha(
            Math.random() * (TOPEDERECHA - 5) + 5,
            0,
            Vflechas
        );
        flechas.push(flecha);
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

    function actualizarFlechas() {
        flechas.forEach((flecha, i) => {
            flecha.y += flecha.velocidad;
    
            if (detectarColision(flecha, miThorfinn)) {
                miThorfinn.vida--;
                flechas.splice(i, 1);
                if (miThorfinn.vida <= 0) terminarJuego();
            }
    
            if (flecha.y > 500) flechas.splice(i, 1);
        });
    }

    function detectarColision(flecha, thorfinn) {
        return (
            flecha.x < thorfinn.x + thorfinn.tamañoX &&
            flecha.x + flecha.ancho > thorfinn.x &&
            flecha.y < thorfinn.y + thorfinn.tamañoY &&
            flecha.y + flecha.alto > thorfinn.y
        );
    }

    function dibujarFlechas() {
        flechas.forEach(flecha => {
            ctx.drawImage(imagenFlecha, flecha.x, flecha.y, flecha.ancho, flecha.alto);
        });
    }

    function crearThorfinn() {
        ctx.clearRect(0, 0, 500, 500);
        dibujarSuelo();
        dibujarPlataformas();
        dibujarFlechas();


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

    function loopJuego() {
        crearThorfinn();
        actualizarFlechas();
        dibujarFlechas();
    }

    function actualizarDificultad() {
        const tiempoTranscurrido = (new Date() - tiempoInicio) / 1000; //Tiempo transcurrido en segundos

        // Aumentar nivel cada 30 segundos
        if (tiempoTranscurrido >= nivel * 30) {
            nivel++;
            console.log(`Nivel aumentado a: ${nivel}`);
        
            // Aumenta la dificultad cada vez que el nivel sube
            velocidadCaida += 0.2; // Aumenta la velocidad de caída
            frecuenciaCaida -= 100; // Reduce el tiempo entre cada flecha

            // Si ya tienes un intervalo que crea las flechas, actualízalo
            clearInterval(id5);// Detén el intervalo anterior
            id5 = setInterval(crearFlechas, frecuenciaCaida); // Crea las flechas con nueva frecuencia
            
        }
    }

    function guardarRecords() {
        let puntuacionMaxima = localStorage.getItem("puntuacionMaxima") || 0;
        let nivelMaximo = localStorage.getItem("nivelMaximo") || 1;

        if (nivel > nivelMaximo) {
            localStorage.setItem("nivelMaximo", nivel);
        }
        if (tiempoFin < puntuacionMaxima || puntuacionMaxima === 0) {
            localStorage.setItem("puntuacionMaxima", tiempoFin);
        }
    }

    function terminarJuego() {
        clearInterval(intervaloJuego); //Detener todos los intervalos
        tiempoFin = Date.now(); //Capturar el tiempo de finalización
        const tiempoJugado = (tiempoFin - tiempoInicio) / 1000;//Calcular el tiempo jugado
    
        // Guardar puntuación en el historial
        historialPuntuaciones.push(tiempoJugado);
        historialNiveles.push(nivel);
        guardarHistorial();
        mostrarFinDelJuego(tiempoJugado);
        mostrarBotonReinicio();
        clearInterval(id1);
        clearInterval(id2);
        clearInterval(id3);
        clearInterval(id4);
        clearInterval(id5);

    }

    function mostrarFinDelJuego(tiempoJugado) {
        const mensajeFin = document.getElementById("mensajeFin");
        mensajeFin.textContent = `¡Fin del juego! Duraste ${tiempoJugado.toFixed(2)} segundos.`;
        mensajeFin.style.display = "block";
    }

    function mostrarBotonReinicio() {
        const botonReinicio = document.getElementById("botonReiniciar");
        if (botonReinicio) {
          botonReinicio.style.display = "block";
          botonReinicio.addEventListener("click", reiniciarJuego);
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

    function reiniciarJuego() {
        nivel = 1;
        Vflechas = 1;
        flechas.length = 0;
        miThorfinn.vida = 3;
        enElAire = false;
        puedeSaltar = true;
        tiempoInicio = Date.now();
    
        
        ctx.clearRect(0, 0, 500, 500);
    
        // Re-crear los intervalos del juego
        id1 = setInterval(crearThorfinn, 1000 / 70);
        id2 = setInterval(animacionThorfinn, 1000 / 8);
        id3 = setInterval(loopJuego, 1000 / 60);
        id4 = setInterval(actualizarDificultad, 1000);
        id5 = setInterval(crearFlechas, frecuenciaCaida);
    
        // Ocultar el mensaje de fin del juego
        document.getElementById("mensajeFin").style.display = "none";
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

    imagenFlecha = new Image();
    imagenFlecha.src = "../Juego/Assets/img/flecha.png";

    Thorfinn.prototype.imagen = imagen;

    miThorfinn = new Thorfinn(x, y);
    id1 = setInterval(crearThorfinn, 1000 / 70);
    id2 = setInterval(animacionThorfinn, 1000 / 8);
    id3 = setInterval(loopJuego, 1000 / 60);
    id4 = setInterval(actualizarDificultad, 1000);
    id5 = setInterval(crearFlechas, frecuenciaCaida);
}