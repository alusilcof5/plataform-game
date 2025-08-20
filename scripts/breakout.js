// Elementos del DOM
const btnIniciar = document.querySelector("#iniciar-juego");
// const btnReiniciar = document.querySelector("#reiniciar-juego"); 
const btnPausar = document.querySelector("#pausar-juego");
const btnAumentarVelocidad = document.querySelector("#aumentar-velocidad");
const btnDisminuirVelocidad = document.querySelector("#disminuir-velocidad");
const spanVelocidadBola = document.querySelector("#velocidad-bola");
const perdiste = document.querySelector("#perdiste");
const marcador = document.querySelector("#marcador");
const bloquesRestantes = document.querySelector("#bloques-restantes");
const vidasElement = document.querySelector("#vidas");
const gameArea = document.querySelector("#game-area");

        // Variables del juego
        const movimientoDeBarraEnPixeles = 40; 
        let coordLeftBarra = 350;
        let topDelta = 4;
        let leftDelta = 4;
        let topCoord = 300;
        let leftCoord = 400;

        const bola = document.querySelector(".ball");
        const paddle = document.querySelector(".bar");
        const anchoBola = 25;
        const anchoPaddle = 100;
        let direccionEjeVertical = "abajo";
        let direccionEjeHorizontal = "derecha";
        let puntos = 0;
        let vidas = 3;
        let velocidadBola = 20;
        let velocidadBolaMostrada = 1;
        let intervalID = null;
        let juegoActivo = false;
        let bloques = [];
        let totalBloques = 0;

        // Crear bloques
        function crearBloques() {
            bloques = [];
            const gameAreaRect = gameArea.getBoundingClientRect();
            const containerWidth = gameArea.clientWidth;
            const filas = 6;
            const columnas = 10;
            const anchoBloque = 75;
            const altoBloque = 25;
            const espacioHorizontal = 5;
            const espacioVertical = 5;
            const margenSuperior = 50;
            const margenIzquierdo = (containerWidth - (columnas * (anchoBloque + espacioHorizontal) - espacioHorizontal)) / 2;

            // Limpiar bloques existentes
            document.querySelectorAll('.brick').forEach(brick => brick.remove());

            for (let fila = 0; fila < filas; fila++) {
                for (let columna = 0; columna < columnas; columna++) {
                    const bloque = document.createElement('div');
                    bloque.className = `brick brick-row-${fila + 1}`;
                    bloque.style.left = `${margenIzquierdo + columna * (anchoBloque + espacioHorizontal)}px`;
                    bloque.style.top = `${margenSuperior + fila * (altoBloque + espacioVertical)}px`;
                    bloque.style.width = `${anchoBloque}px`;
                    bloque.style.height = `${altoBloque}px`;
                    
                    gameArea.appendChild(bloque);
                    
                    bloques.push({
                        element: bloque,
                        x: margenIzquierdo + columna * (anchoBloque + espacioHorizontal),
                        y: margenSuperior + fila * (altoBloque + espacioVertical),
                        width: anchoBloque,
                        height: altoBloque,
                        destroyed: false,
                        points: (6 - fila) * 10 
                    });
                }
            }
            
            totalBloques = bloques.length;
            actualizarBloquesRestantes();
        }

        // Detectar colisión con bloques
        function detectarColisionBloques() {
            for (let i = 0; i < bloques.length; i++) {
                const bloque = bloques[i];
                if (bloque.destroyed) continue;

                // Verificar colisión
                if (leftCoord < bloque.x + bloque.width &&
                    leftCoord + anchoBola > bloque.x &&
                    topCoord < bloque.y + bloque.height &&
                    topCoord + anchoBola > bloque.y) {
                    
                    // Destruir bloque con animación
                    bloque.destroyed = true;
                    bloque.element.classList.add('destroyed');
                    setTimeout(() => {
                        if (bloque.element.parentNode) {
                            bloque.element.remove();
                        }
                    }, 300);

                    // Sumar puntos
                    puntos += bloque.points;
                    sumarMarcador(puntos);
                    actualizarBloquesRestantes();

                    // Cambiar dirección de la pelota
                    const centroBolaX = leftCoord + anchoBola / 2;
                    const centroBolaY = topCoord + anchoBola / 2;
                    const centroBloqueX = bloque.x + bloque.width / 2;
                    const centroBloqueY = bloque.y + bloque.height / 2;

                    const distanciaX = Math.abs(centroBolaX - centroBloqueX);
                    const distanciaY = Math.abs(centroBolaY - centroBloqueY);

                    if (distanciaX > distanciaY) {
                        direccionEjeHorizontal = direccionEjeHorizontal === "derecha" ? "izquierda" : "derecha";
                    } else {
                        direccionEjeVertical = direccionEjeVertical === "abajo" ? "arriba" : "abajo";
                    }

                    // Verificar victoria
                    const bloquesActivos = bloques.filter(b => !b.destroyed);
                    if (bloquesActivos.length === 0) {
                        victoria();
                    }

                    break;
                }
            }
        }

        // Movimiento de la pelota mejorado
        function moverPelota() {
            const fieldHeight = gameArea.clientHeight;
            const fieldWidth = gameArea.clientWidth;
            const paddleHeight = 15;
            const paddleY = fieldHeight - paddleHeight - 10; 

            // Calcular nueva posición
            let newTopCoord = topCoord;
            let newLeftCoord = leftCoord;

            // Movimiento vertical
            if (direccionEjeVertical === "abajo") {
                newTopCoord = topCoord + topDelta;
            } else {
                newTopCoord = topCoord - topDelta;
            }

            // Movimiento horizontal
            if (direccionEjeHorizontal === "derecha") {
                newLeftCoord = leftCoord + leftDelta;
            } else {
                newLeftCoord = leftCoord - leftDelta;
            }

            // Verificar colisiones verticales
            if (newTopCoord <= 0) {
                // Colisión con borde superior
                newTopCoord = 0;
                direccionEjeVertical = "abajo";
            } else if (newTopCoord + anchoBola >= paddleY && 
                       newLeftCoord + anchoBola >= coordLeftBarra && 
                       newLeftCoord <= coordLeftBarra + anchoPaddle) {
                // Colisión con la paleta
                newTopCoord = paddleY - anchoBola;
                direccionEjeVertical = "arriba";
                
                // Cambiar ángulo basado en dónde golpea la paleta
                const puntoImpacto = (newLeftCoord + anchoBola/2) - (coordLeftBarra + anchoPaddle/2);
                const factorAngulo = puntoImpacto / (anchoPaddle/2);
                leftDelta = Math.max(-6, Math.min(6, factorAngulo * 4));
                
                puntos += 5;
                sumarMarcador(puntos);
            } else if (newTopCoord + anchoBola >= fieldHeight) {
                // Colisión con borde inferior (perder vida)
                perderVida();
                return;
            }

            // Verificar colisiones horizontales
            if (newLeftCoord <= 0) {
                // Colisión con borde izquierdo
                newLeftCoord = 0;
                direccionEjeHorizontal = "derecha";
            } else if (newLeftCoord + anchoBola >= fieldWidth) {
                // Colisión con borde derecho
                newLeftCoord = fieldWidth - anchoBola;
                direccionEjeHorizontal = "izquierda";
            }

            // Actualizar coordenadas
            topCoord = newTopCoord;
            leftCoord = newLeftCoord;

            // Detectar colisiones con bloques
            detectarColisionBloques();

            // Actualizar posición visual
            bola.style.left = `${leftCoord}px`;
            bola.style.top = `${topCoord}px`;
        }

        // Movimiento del paddle
        function moverBarra(e) {
            if (!juegoActivo) return;
            
            const anchoDeContenedor = gameArea.clientWidth;
            const direccion = e.code;
            
            if (direccion === "ArrowLeft") {
                coordLeftBarra = Math.max(0, coordLeftBarra - movimientoDeBarraEnPixeles);
            } else if (direccion === "ArrowRight") {
                coordLeftBarra = Math.min(
                    anchoDeContenedor - anchoPaddle,
                    coordLeftBarra + movimientoDeBarraEnPixeles
                );
            }
            paddle.style.left = `${coordLeftBarra}px`;
        }

        // Control de vidas
        function perderVida() {
            vidas--;
            actualizarVidas();
            
            if (vidas <= 0) {
                gameOver();
            } else {
                resetearPelota();
                perdiste.textContent = `¡Vida perdida! Te quedan ${vidas} vidas`;
                setTimeout(() => {
                    if (juegoActivo) {
                        perdiste.textContent = "¡Sigue jugando!";
                    }
                }, 2000);
            }
        }

        // Game Over
        function gameOver() {
            pausarJuego();
            perdiste.textContent = `🎮 Game Over - Puntuación Final: ${puntos}`;
            btnIniciar.textContent = "🎮 Nuevo Juego";
            juegoActivo = false;
        }

        // Victoria
        function victoria() {
            pausarJuego();
            const bonus = vidas * 1000;
            puntos += bonus;
            sumarMarcador(puntos);
            perdiste.textContent = `🎉 ¡Victoria! Bonus: ${bonus} pts - Total: ${puntos}`;
            btnIniciar.textContent = "🎮 Nuevo Juego";
            juegoActivo = false;
        }

        // Resetear posición de la pelota
        function resetearPelota() {
            const fieldWidth = gameArea.clientWidth;
            const fieldHeight = gameArea.clientHeight;
            
            topCoord = fieldHeight / 2;
            leftCoord = fieldWidth / 2;
            direccionEjeVertical = "abajo";
            direccionEjeHorizontal = Math.random() > 0.5 ? "derecha" : "izquierda";
            
            bola.style.left = `${leftCoord}px`;
            bola.style.top = `${topCoord}px`;
        }

        // Funciones de control del juego
        function empezarJuego() {
            if (!juegoActivo) {
                juegoActivo = true;
                if (bloques.length === 0 || bloques.every(b => b.destroyed)) {
                    crearBloques();
                }
                resetearPelota();
            }
            
            if (intervalID !== null) {
                clearInterval(intervalID);
            }
            intervalID = setInterval(moverPelota, velocidadBola);
            btnIniciar.textContent = "▶️ Continuar";
            perdiste.textContent = "¡Juego en marcha!";
        }

        function pausarJuego() {
            clearInterval(intervalID);
            intervalID = null;
            if (juegoActivo) {
                perdiste.textContent = "⏸️ Juego pausado";
            }
        }

        function reiniciarJuego() {
            pausarJuego();
            juegoActivo = false;
            btnIniciar.textContent = "🎮 Iniciar";
            direccionEjeVertical = "abajo";
            direccionEjeHorizontal = "derecha";
            vidas = 3;
            puntos = 0;
            coordLeftBarra = 350;
            
            resetearPelota();
            reiniciarMarcador();
            reiniciarVelocidad();
            actualizarVidas();
            crearBloques();
            
            perdiste.textContent = "Presiona Iniciar para comenzar";
        }

       
        function sumarMarcador(puntos) {
            marcador.textContent = puntos;
        }

        function reiniciarMarcador() {
            puntos = 0;
            marcador.textContent = puntos;
        }

        function actualizarVidas() {
            vidasElement.textContent = vidas;
        }

        function actualizarBloquesRestantes() {
            const restantes = bloques.filter(b => !b.destroyed).length;
            bloquesRestantes.textContent = restantes;
        }

        function aumentarVelocidadBola() {
            if (velocidadBola > 8) {
                velocidadBola -= 2;
                velocidadBolaMostrada++;
                spanVelocidadBola.textContent = velocidadBolaMostrada;
                
                if (intervalID) {
                    pausarJuego();
                    empezarJuego();
                }
            }
        }

        function disminuirVelocidadBola() {
            if (velocidadBola < 50) {
                velocidadBola += 2;
                velocidadBolaMostrada = Math.max(0, velocidadBolaMostrada - 1);
                spanVelocidadBola.textContent = velocidadBolaMostrada;
                
                if (intervalID) {
                    pausarJuego();
                    empezarJuego();
                }
            }
        }

        function reiniciarVelocidad() {
            velocidadBola = 20;
            velocidadBolaMostrada = 1;
            spanVelocidadBola.textContent = velocidadBolaMostrada;
        }

        
        document.body.addEventListener("keydown", moverBarra);
btnIniciar.addEventListener("click", empezarJuego);
btnPausar.addEventListener("click", pausarJuego);

btnAumentarVelocidad.addEventListener("click", aumentarVelocidadBola);
btnDisminuirVelocidad.addEventListener("click", disminuirVelocidadBola);
        
        reiniciarJuego();


        
        window.addEventListener('resize', () => {
            if (!juegoActivo) {
                setTimeout(() => {
                    crearBloques();
                    resetearPelota();
                }, 100);
            }
        });
    