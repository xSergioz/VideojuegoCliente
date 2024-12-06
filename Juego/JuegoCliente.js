window.onload = function () {

    const TOPEDERECHA = 280;
    const TOPIZQUIERDA = 0;
    const TOPARRIBA = 0;
    const TOPABAJO = 140;
    const TOPEINFERIORBORRADO = 520;
    const gravedad = 1.5;
    const flechas = [];
    
    let Vsalto;
    let historialPuntuaciones = [];
    let historialNiveles = [];
    

    let x = 0;
    let y = 100;
    const alturaSuelo = 98;

    let ctx;
    let posicion = 0;

    let canvas;

    let imagen; let imagenSuelo; let imagenFlecha;
    let xSuelo = -1;
    let ySuelo = 140;
    let miThorfinn; 
    let id1, id2, id3, id4, id5;

    let xIzquierda, xDerecha, Ataque;
    let vida = 3;
    let salto;
    let enElAire = false;
    let puedeSaltar = true;
    let ultimaDireccion;

    let CDTimer;

    let nivel = 1;

    let tiempoInicio = Date.now();
    let tiempoFin = null;

	let recordTiempo;
    let Vflechas = 1;

    let velocidadCaida = 1; //Velocidad inicial de las flechas
    let frecuenciaCaida = 1000; //Frecuencia inicial para la creación de flechas (en milisegundos)
    let intervaloJuego;
    let partidaRegistrada = false;
    let partidaTerminada = false;


    function cargarHistorial() {
        historialPuntuaciones = JSON.parse(localStorage.getItem('historialPuntuaciones')) || [];
        historialNiveles = JSON.parse(localStorage.getItem('historialNiveles')) || [];
    }
      
    function guardarHistorial() {
        localStorage.setItem('historialPuntuaciones', JSON.stringify(historialPuntuaciones));
        localStorage.setItem('historialNiveles', JSON.stringify(historialNiveles));
        
    }
      
      // Añade una función para mostrar el historial de puntuaciones
    function mostrarHistorial() {
		const recordsList = document.getElementById("recordsList");
		recordsList.innerHTML = ""; // Limpiar la lista

        const historialCombinado = historialPuntuaciones.map((puntuacion, index) => ({
            puntuacion: puntuacion,
            nivel: historialNiveles[index]
        }));

        const mejoresTiempos = historialCombinado.sort((a, b) => {
            if (b.puntuacion === a.puntuacion) {
                return b.nivel - a.nivel; // Ordenar por nivel si los tiempos son iguales
            }
            return b.puntuacion - a.puntuacion; // Ordenar por tiempo de mayor a menor
        });
	  
		mejoresTiempos.forEach((record, index) => {
            const recordItem = document.createElement("li");
            const minutos = Math.floor(record.puntuacion / 60); // Obtener los minutos
            const segundos = (record.puntuacion % 60).toFixed(2); // Obtener los segundos
            recordItem.textContent = `Mejor tiempo ${index + 1}: ${minutos}m ${segundos}s - Nivel ${record.nivel}`;
            recordsList.appendChild(recordItem);
        });
	}
      
    function mostrarRecords(tiempoInicio, tiempoFin, nivel) {
        const nuevoRecord = (tiempoFin - tiempoInicio) / 1000; // Convertir a segundos
    
        // Verifica si es un nuevo récord
        if (nuevoRecord > recordTiempo) {
            historialPuntuaciones.push(nuevoRecord);
            historialNiveles.push(nivel);
            recordTiempo = nuevoRecord;
        }
    
        // Guarda el historial actualizado
        guardarHistorial();
    
        // Muestra el historial actualizado
        mostrarHistorial();
    }

    let plataformas = [
        { x: 50, y: 75, ancho: 50, alto: 10 }, //Plataforma 1
        { x: 200, y: 75, ancho: 60, alto: 10 } //Plataforma 2
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
        this.ancho = 8;
        this.alto = 25;
        this.velocidad = velocidad__;
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
        }, 15); 
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
        actualizarInformacion();
        if (partidaTerminada) {
            mostrarBotonReinicio();
        }
    }

    function actualizarInformacion() {
        document.getElementById('vidas').textContent = `Vidas: ${miThorfinn.vida}`;
        document.getElementById('tiempo').textContent = `Tiempo: ${((Date.now() - tiempoInicio) / 1000).toFixed(2)}s`;
        document.getElementById('nivel').textContent = `Nivel: ${nivel}`;
    }

    function actualizarDificultad() {
        const tiempoTranscurrido = (new Date() - tiempoInicio) / 1000; //Tiempo transcurrido en segundos

        // Aumentar nivel cada 30 segundos
        if (tiempoTranscurrido >= nivel * 20) {
            nivel++;
            console.log(`Nivel aumentado a: ${nivel}`);
        
            // Aumenta la dificultad cada vez que el nivel sube
            velocidadCaida += 0.3; // Aumenta la velocidad de caída
            frecuenciaCaida -= 100; // Reduce el tiempo entre cada flecha

            // Si ya tienes un intervalo que crea las flechas, actualízalo
            clearInterval(id5);// Detén el intervalo anterior
            id5 = setInterval(crearFlechas, frecuenciaCaida); // Crea las flechas con nueva frecuencia
            
        }
    }

    function terminarJuego() {
        if (partidaTerminada) return; //Evita múltiples ejecuciones
        partidaTerminada = true; //Marca la partida como terminada
    
        clearInterval(intervaloJuego); //Detener todos los intervalos
        console.log("Guardando récords...");
        console.log("Nivel actual:", nivel);
        tiempoFin = Date.now(); //Captura el tiempo de finalización
        const tiempoJugado = (tiempoFin - tiempoInicio) / 1000; //Calcula el tiempo jugado
    
        //Guardar puntuación en el historial
        historialPuntuaciones.push(tiempoJugado);
        historialNiveles.push(nivel);
        console.log("Historial de niveles:", historialNiveles);
        guardarHistorial();
    
        //Mostrar mensajes y actualizar interfaz
        mostrarFinDelJuego(tiempoJugado);
        mostrarBotonReinicio();
        mostrarRecords();
    
        //Detener intervalos restantes
        clearInterval(id1);
        clearInterval(id2);
        clearInterval(id3);
        clearInterval(id4);
        clearInterval(id5);
    }

    function mostrarFinDelJuego(tiempoJugado) {
        partidaTerminada = true;
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
        console.log("Reiniciando juego...");
        if (partidaTerminada) {
            // Detener intervalos y reiniciar estado del juego
            clearInterval(id1);
            clearInterval(id2);
            clearInterval(id3);
            clearInterval(id4);
            clearInterval(id5);
    
            
    
            // Sincronizar historial de puntuaciones y niveles
    
            console.log("Datos después de sincronización:");
            console.log("Puntuaciones:", historialPuntuaciones);
            console.log("Niveles:", historialNiveles);
    
            // Reiniciar otros elementos del juego
            nivel = 0;
            Vflechas = 1;
            flechas.length = 0;
            miThorfinn.vida = 3;
            enElAire = false;
            puedeSaltar = true;
            tiempoInicio = Date.now();
            partidaTerminada = false;
            partidaRegistrada = false;

            cargarHistorial();
            mostrarHistorial();
            mostrarRecords();
    
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            id1 = setInterval(crearThorfinn, 1000 / 60);
            id2 = setInterval(animacionThorfinn, 1000 / 8);
            id3 = setInterval(loopJuego, 1000 / 60);
            id4 = setInterval(actualizarDificultad, 1000);
            id5 = setInterval(crearFlechas, frecuenciaCaida);
    
            const mensajeFin = document.getElementById("mensajeFin");
            mensajeFin.style.display = "none";
    
            const botonReinicio = document.getElementById("botonReiniciar");
            if (botonReinicio) {
                botonReinicio.style.display = "none";
            }
        }
    }
    
    
    //Verifica que la función que termina el juego también esté gestionando correctamente el estado de partidaTerminada
    function finDelJuego() {
        partidaTerminada = true; //Aquí deberías asegurarte de que esta línea esté ejecutándose correctamente
        console.log("Partida terminada.");
    
        //Mostrar mensaje de fin del juego
        const mensaje = document.getElementById("mensajeFin");
        mensaje.innerHTML = "¡Juego terminado!";
        mensaje.style.display = "block";
        console.log("Mensaje de fin del juego mostrado.");
    
        mostrarBotonReinicio(); //Mostrar el botón de reiniciar
        console.log("Botón de reinicio mostrado.");
    }
    
    //document.getElementById("golpeSound").play();
    //document.getElementById("lvlup").play();
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
    id1 = setInterval(crearThorfinn, 1000 / 60);
    id2 = setInterval(animacionThorfinn, 1000 / 8);
    id3 = setInterval(loopJuego, 1000 / 60);
    id4 = setInterval(actualizarDificultad, 1000);
    id5 = setInterval(crearFlechas, frecuenciaCaida);
}