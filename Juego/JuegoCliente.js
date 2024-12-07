window.onload = function () {

    const TOPEDERECHA = 280;
    const TOPIZQUIERDA = 0;
    const TOPABAJO = 140;
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
    let ySuelo = 140;
    let miThorfinn; 
    let id1, id2, id3, id4, id5;

    let xIzquierda, xDerecha, Ataque;
    let enElAire = false;
    let puedeSaltar = true;
    let ultimaDireccion;

    let CDTimer;

    let nivel = 1;

    let tiempoInicio = Date.now();
    let tiempoFin = null;

	let recordTiempo;
    let Vflechas = 1;//Velocidad Flechas

    let velocidadCaida = 1; //Velocidad inicial de las flechas
    let frecuenciaCaida = 1000; //Frecuencia inicial para la creación de flechas (en milisegundos)
    let intervaloJuego;
    let partidaTerminada = false;


    function cargarHistorial() {
        historialPuntuaciones = JSON.parse(localStorage.getItem('historialPuntuaciones')) || [];
        historialNiveles = JSON.parse(localStorage.getItem('historialNiveles')) || [];
    }
      
    function guardarHistorial() {
        localStorage.setItem('historialPuntuaciones', JSON.stringify(historialPuntuaciones));
        localStorage.setItem('historialNiveles', JSON.stringify(historialNiveles));
        
    }
      
    function mostrarHistorial() {
		const recordsList = document.getElementById("recordsList");
		recordsList.innerHTML = ""; //Limpiar la lista

        const historialCombinado = historialPuntuaciones.map((puntuacion, index) => ({
            puntuacion: puntuacion,
            nivel: historialNiveles[index]
        }));

        const mejoresTiempos = historialCombinado.sort((a, b) => {
            if (b.puntuacion === a.puntuacion) {
                return b.nivel - a.nivel; //Ordenar por nivel si los tiempos son iguales
            }
            return b.puntuacion - a.puntuacion; //Ordenar por tiempo de mayor a menor
        });
	  
		mejoresTiempos.forEach((record, index) => {
            const recordItem = document.createElement("li");
            const minutos = Math.floor(record.puntuacion / 60); //Obtener los minutos
            const segundos = (record.puntuacion % 60).toFixed(2); //Obtener los segundos
            recordItem.textContent = `Mejor tiempo ${index + 1}: ${minutos}m ${segundos}s - Nivel ${record.nivel}`;
            recordsList.appendChild(recordItem);
        });

        const top5 = historialCombinado.slice(0, 5);

        historialPuntuaciones = top5.map(record => record.puntuacion);
        historialNiveles = top5.map(record => record.nivel);

	}
      
    function mostrarRecords(tiempoInicio, tiempoFin, nivel) {
        const nuevoRecord = (tiempoFin - tiempoInicio) / 1000;
    
        //Verifica si es un nuevo récord
        if (nuevoRecord > recordTiempo) {
            historialPuntuaciones.push(nuevoRecord);
            historialNiveles.push(nivel);
            recordTiempo = nuevoRecord;
        }
    
        //Guarda el historial actualizado
        guardarHistorial();
    
        //Muestra el historial actualizado
        mostrarHistorial();
    }

    let plataformas = [
        { x: 50, y: 75, ancho: 50, alto: 10 }, //Plataforma 1
        { x: 200, y: 75, ancho: 60, alto: 10 } //Plataforma 2
    ];

    function dibujarSuelo(){
        
        const alturaSuelo = canvas.height - ySuelo;
        const anchoImagen = 100;
        const cantidadImagen = Math.ceil(canvas.width / anchoImagen);

        for (let i = 0; i < cantidadImagen; i++) {
            ctx.drawImage(imagenSuelo, 3, 1, anchoImagen, alturaSuelo, i * anchoImagen, ySuelo, anchoImagen, alturaSuelo);
        }
    }

    function Thorfinn (x_, y_) {
        this.x = x_;
        this.y = y_;
        this.animacionThorfinn = [[4,202],[26,202]];
        this.animacionIddle = [[4,202],[26,202],[47,202],[69,202]];
        this.animacionIddleIzquierda = [[88,1048],[66,1048],[44,1048],[22,1048]];
        this.velocidad = 1.2;
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
        document.getElementById("espada").play();
    }

    Thorfinn.prototype.generaAtaqueIzquierda = function() {
        this.animacionThorfinnAtaqueIzquierda = [[176,781],[142,781],[87,781],[44,781],[18,781]];
        this.animacionThorfinn = this.animacionThorfinnAtaqueIzquierda;
        document.getElementById("espada").play();
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
            document.getElementById("salto").play();
        }, 15); 
    }

    function iniciarCD() {
        puedeSaltar = false;
        let CD = 3;
        const cdDisplay = document.getElementById("cdSalto");
        cdDisplay.textContent = `${CD}s`;
    
        CDTimer = setInterval(() => {
            CD--;
    
            if (CD > 0) {
                cdDisplay.textContent = `${CD}s`; // Actualiza el contador
            } else {
                clearInterval(CDTimer);
                puedeSaltar = true;
                cdDisplay.textContent = "Listo"; // Indica que el salto está disponible
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
                document.getElementById("hit").play();
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
        const anchoImagen = 100; //Ancho del fragmento del sprite del suelo
    
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

    //Función para ir limpiando lo que no se ve, y que no consuma muchos recursos mientras se juega
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

        //Informacion del estado del juego
        document.getElementById('vidas').textContent = `Vidas: ${miThorfinn.vida}`;
        document.getElementById('tiempo').textContent = `Tiempo: ${((Date.now() - tiempoInicio) / 1000).toFixed(2)}s`;
        document.getElementById('nivel').textContent = `Nivel: ${nivel}`;
    }

    function actualizarDificultad() {
        const tiempoTranscurrido = (new Date() - tiempoInicio) / 1000; //Tiempo transcurrido

        //Aumentar nivel cada 20 segundos
        if (tiempoTranscurrido >= nivel * 20) {
            nivel++ && document.getElementById("lvlup").play();
            //Aumenta la velocidad de caída
            velocidadCaida += 0.3;
            //Reduce el tiempo entre cada flecha
            frecuenciaCaida -= 100;

            clearInterval(id5);
            id5 = setInterval(crearFlechas, frecuenciaCaida); //Crea las flechas con nueva frecuencia
            
        }
    }

    function terminarJuego() {
        if (partidaTerminada) return; //Evita múltiples ejecuciones
        partidaTerminada = true; //Marca la partida como terminada
    
        clearInterval(intervaloJuego); //Detener todos los intervalos

        tiempoFin = Date.now(); //Captura el tiempo de finalización
        const tiempoJugado = (tiempoFin - tiempoInicio) / 1000; //Calcula el tiempo jugado
    
        //Guardar puntuación en el historial
        historialPuntuaciones.push(tiempoJugado);
        historialNiveles.push(nivel);
        guardarHistorial();
        //Sonido de muerte
        document.getElementById("death").play();
    
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
    //Mostrar el mensaje cuando se terminé una partida
    function mostrarFinDelJuego(tiempoJugado) {
        partidaTerminada = true;
        const mensajeFin = document.getElementById("mensajeFin");
        mensajeFin.textContent = "¡Fin de la partida! Te quedastes sin vidas";
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
        //Para parar e iniciar la música cuando uno quiera
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

        if (partidaTerminada) {
            //Detener intervalos
            clearInterval(id1);
            clearInterval(id2);
            clearInterval(id3);
            clearInterval(id4);
            clearInterval(id5);
    
            //Reiniciar los parámetros del juego
            nivel = 0;
            Vflechas = 1;
            flechas.splice(0, flechas.length);
            flechas.forEach(flecha => {
                flecha.x = 0;
                flecha.y = 0;
            });
            miThorfinn.vida = 3;
            enElAire = false;
            puedeSaltar = true;
            tiempoInicio = Date.now();
            partidaTerminada = false;
            partidaRegistrada = false;
            frecuenciaCaida = 1000;
            velocidadCaida = 1;

            cargarHistorial();
            mostrarHistorial();
            mostrarRecords();
    
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //Iniciar intervalos
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
    
        //Mostrar mensaje de fin del juego
        const mensaje = document.getElementById("mensajeFin");
        mensaje.innerHTML = "¡Juego terminado!";
        mensaje.style.display = "block";
        
    
        mostrarBotonReinicio(); //Mostrar el botón de reiniciar
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
    id1 = setInterval(crearThorfinn, 1000 / 60);
    id2 = setInterval(animacionThorfinn, 1000 / 8);
    id3 = setInterval(loopJuego, 1000 / 60);
    id4 = setInterval(actualizarDificultad, 1000);
    id5 = setInterval(crearFlechas, frecuenciaCaida);
}