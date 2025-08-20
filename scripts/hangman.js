
        let gameState = {
            currentWord: '',
            guessedLetters: [],
            wrongGuesses: 0,
            maxWrongGuesses: 10,
            score: 0,
            wordsCorrect: 0,
            currentCategory: 'animales',
            currentDifficulty: 'facil',
            gameActive: false,
            soundEnabled: true
        };

       
        const wordCategories = {
            animales: {
                facil: [
                'GATO', 'PERRO', 'PATO', 'OSO', 'LEON', 'MONO', 'PEZ', 'LOBO', 'RANA',
                'RATON', 'ZORRO', 'LORO', 'BURRO', 'OVEJA', 'CABRA', 'CERDO', 'VACA',
                'POLLO', 'CABALLO', 'GALLINA', 'CONEJO', 'TORTUGA', 'GANSO', 'FOCA',
                'GAVIOTA', 'AGUILA', 'ARDILLA', 'DELFIN', 'MARIPOSA', 'ABEJA'
                ],
                medio: [
                'ELEFANTE', 'JIRAFA', 'CABALLO', 'CONEJO', 'TIGRE', 'ZEBRA', 'DELFIN',
                'CAMELLO', 'CANGURO', 'VENADO', 'GORILA', 'AVESTRUZ', 'IGUANA', 'PAVO',
                'BUITRE', 'HORMIGA', 'MARTINPESCADOR', 'LEOPARDO', 'MAPACHE', 'NUTRIA',
                'KOALA', 'PINGÜINO', 'PELICANO', 'HALCON', 'CASTOR', 'BISONTE',
                'SERPIENTE', 'ERIZO', 'JABALI', 'FLAMENCO'
                ],
                dificil: [
                'RINOCERONTE', 'HIPOPOTAMO', 'COCODRILO', 'MURCIELAGO', 'ARMADILLO',
                'ORNITORRINCO', 'CAMALEON', 'TARANTULA', 'ESCORPION', 'PANGOLIN',
                'NARVAL', 'OKAPI', 'QUOKKA', 'CARPINCHO', 'AXOLOTE', 'DRAGONKOMODO',
                'GAVIAL', 'CIGUEÑA', 'ALPACA', 'ÑANDU', 'IGUANAMARINA', 'TUCAN',
                'AGUIPERDICERA', 'CANGREJOYETI', 'PEZESPADA', 'MEDUSA', 'MANTARAYA',
                'CABALLITO DE MAR', 'CAMARONPISTOLA', 'PULPOGIGANTE'
                ]
            },
            comida: {
                facil: [
                'PIZZA', 'PASTA', 'PAN', 'POLLO', 'ARROZ', 'SOPA', 'QUESO', 'FRUTA',
                'LECHE', 'HUEVO', 'JAMON', 'CARNE', 'YOGURT', 'ENSALADA', 'GALLETAS',
                'TOMATE', 'MAIZ', 'PAPA', 'MANGO', 'BANANA', 'SANDIA', 'PERA',
                'MANZANA', 'NARANJA', 'UVAS', 'KIWI', 'PIÑA', 'COCO', 'AGUA'
                ],
                medio: [
                'HAMBURGUESA', 'SANDWICH', 'ENSALADA', 'PESCADO', 'VERDURAS', 'TACOS',
                'AREPA', 'CEVICHE', 'EMPANADA', 'CHOCOLATE', 'BROCOLI', 'ZANAHORIA',
                'ESPINACA', 'CALABAZA', 'POLENTA', 'SUSHI', 'CHURROS', 'AREQUIPE',
                'CUPCAKE', 'LENTEJAS', 'FRIJOLES', 'ENSALADILLA', 'RAMEN', 'QUICHE',
                'MERMELADA', 'SALCHICHA', 'ALBONDIGAS', 'CROQUETAS', 'TORTILLA',
                'ENSALADACAPRESE'
                ],
                dificil: [
                'ESPAGUETIS', 'LASAGNA', 'QUESADILLA', 'BROCHETA', 'GUACAMOLE',
                'RATATOUILLE', 'BRUSCHETTA', 'CASSOULET', 'GAZPACHO', 'PAELLA',
                'CALZONE', 'FONDUE', 'BORSCHT', 'MUSAKA', 'TIRAMISU', 'PANETTONE',
                'FALAFEL', 'HUMMUS', 'TAPENADE', 'CAVIAR', 'MOUSSE', 'MACARONS',
                'STRÜDEL', 'SASHIMI', 'TEMPURA', 'DIMSUM', 'KIMCHI', 'BULGOGI',
                'CURRY', 'CHOWMEIN'
                ]
            },
            paises: {
                facil: [
                'PERU', 'CHILE', 'CUBA', 'CHINA', 'BRASIL', 'ITALIA', 'MEXICO', 'JAPON',
                'CANADA', 'USA', 'RUSIA', 'FRANCIA', 'ALEMANIA', 'INDIA', 'ESPAÑA',
                'PORTUGAL', 'ECUADOR', 'COLOMBIA', 'ARGENTINA', 'URUGUAY', 'VENEZUELA',
                'BOLIVIA', 'PARAGUAY', 'PANAMA', 'COSTARICA', 'HONDURAS', 'GUATEMALA',
                'NICARAGUA', 'EL SALVADOR'
                ],
                medio: [
                'ARGENTINA', 'COLOMBIA', 'ECUADOR', 'VENEZUELA', 'URUGUAY', 'AUSTRALIA',
                'NUEVAZELANDA', 'SUDAFRICA', 'EGIPTO', 'MARRUECOS', 'TURQUIA', 'TAILANDIA',
                'FILIPINAS', 'VIETNAM', 'INDONESIA', 'GRECIA', 'SUIZA', 'SUECIA', 'NORUEGA',
                'DINAMARCA', 'FINLANDIA', 'POLONIA', 'HUNGRIA', 'CHEQUIA', 'IRLANDA',
                'ESCOCIA', 'BELGICA', 'HOLANDA', 'AUSTRIA', 'RUMANIA'
                ],
                dificil: [
                'MADAGASCAR', 'KAZAJISTAN', 'AZERBAIYAN', 'UZBEKISTAN', 'KIRGUISTAN',
                'TURKMENISTAN', 'TAJIKISTAN', 'MONGOLIA', 'BIELORRUSIA', 'GEORGIA',
                'LITUANIA', 'LETONIA', 'ESTONIA', 'UCRANIA', 'ESLOVENIA', 'ESLOVAQUIA',
                'CROACIA', 'SERBIA', 'BOSNIA', 'MONTENEGRO', 'MACEDONIA', 'ARMENIA',
                'IRAN', 'IRAQ', 'PAKISTAN', 'AFGANISTAN', 'NEPAL', 'BUTAN', 'MYANMAR',
                'LAOS'
                ]
            },
            deportes: {
                facil: [
                'FUTBOL', 'TENIS', 'GOLF', 'BOXEO', 'NADO', 'SURF', 'RUGBY', 'BASQUET',
                'PADEL', 'HOCKEY', 'ESQUI', 'SKATE', 'JUDO', 'KARATE', 'LUCHA',
                'PINGPONG', 'CICLISMO', 'ATLETISMO', 'VOLEIBOL', 'BALONMANO',
                'ESCALADA', 'ESGRIMA', 'SOFTBOL', 'BILLAR', 'DARDOS'
                ],
                medio: [
                'BALONCESTO', 'VOLEIBOL', 'ATLETISMO', 'CICLISMO', 'GIMNASIA',
                'HANDBALL', 'BMX', 'SNOWBOARD', 'WINDSURF', 'TAEKWONDO', 'PILOTA',
                'TRIATLON', 'HEPTATLON', 'DECATLON', 'KITESURF', 'ESCALADA',
                'PATINAJE', 'REMOS', 'NATACION', 'ARQUERIA', 'BEISBOL', 'SQUASH',
                'VELA', 'POLO', 'CURLING', 'ESQUIACUATICO', 'ESCALADADEPORTIVA',
                'ULTRAMARATON', 'CANOTAJE', 'MOTOCROSS'
                ],
                dificil: [
                'HALTEROFILIA', 'PENTATHLON', 'BADMINTON', 'WATERPOLO', 'ESGRIMA',
                'LUGE', 'BANDY', 'KABADDI', 'SEPAPAKTAKRAW', 'SKELETON', 'BIATLON',
                'TRINEO', 'CROSSFIT', 'TAFISA', 'BOBSLEIGH', 'PESAPALLO', 'UNDERWATERHOCKEY',
                'ORIENTACION', 'TEQBALL', 'PICKLEBALL', 'FUTSAL', 'ULTIMATEFRISBEE',
                'SOFTBALLFASTPITCH', 'CURLINGMIXTO', 'NORDICCOMBINED', 'KORFBALL',
                'FLOORBALL', 'GYMNASTICAESTETICA', 'AEROBICA', 'SLACKLINE'
                ]
            }
            };



        // Hangman parts order
        const hangmanParts = ['base', 'pole', 'top', 'noose', 'head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

        // Initialize game
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            createAlphabet();
            setupEventListeners();
            updateDisplay();
            startNewGame();
        });

        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.width = Math.random() * 20 + 5 + 'px';
                particle.style.height = particle.style.width;
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        function createAlphabet() {
            const alphabetGrid = document.getElementById('alphabetGrid');
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            
            for (let letter of letters) {
                const button = document.createElement('button');
                button.className = 'letter-btn';
                button.textContent = letter;
                button.dataset.letter = letter;
                button.onclick = () => guessLetter(letter);
                alphabetGrid.appendChild(button);
            }
        }

        function setupEventListeners() {
            
            document.getElementById('categorySelector').addEventListener('click', function(e) {
                if (e.target.classList.contains('selector-btn')) {
                    document.querySelectorAll('#categorySelector .selector-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    e.target.classList.add('active');
                    gameState.currentCategory = e.target.dataset.category;
                    updateCategoryHint();
                    playSound(300, 150);
                }
            });

            
            document.getElementById('difficultySelector').addEventListener('click', function(e) {
                if (e.target.classList.contains('selector-btn')) {
                    document.querySelectorAll('#difficultySelector .selector-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    e.target.classList.add('active');
                    gameState.currentDifficulty = e.target.dataset.difficulty;
                    playSound(300, 150);
                }
            });

            document.addEventListener('keydown', function(event) {
                if (gameState.gameActive) {
                    const letter = event.key.toUpperCase();
                    if (letter >= 'A' && letter <= 'Z') {
                        guessLetter(letter);
                    }
                }
            });
        }

        function startNewGame() {
            
            gameState.currentWord = getRandomWord();
            gameState.guessedLetters = [];
            gameState.wrongGuesses = 0;
            gameState.gameActive = true;

            
            resetAlphabet();
            resetHangman();
            updateWordDisplay();
            updateCategoryHint();
            hideGameResult();
            
            playSound(400, 300);
        }

        function getRandomWord() {
            const words = wordCategories[gameState.currentCategory][gameState.currentDifficulty];
            return words[Math.floor(Math.random() * words.length)];
        }

        function guessLetter(letter) {
            if (!gameState.gameActive || gameState.guessedLetters.includes(letter)) {
                return;
            }

            gameState.guessedLetters.push(letter);
            const letterBtn = document.querySelector(`[data-letter="${letter}"]`);
            letterBtn.disabled = true;

            if (gameState.currentWord.includes(letter)) {
                
                letterBtn.classList.add('correct');
                playSound(500, 200);
                updateWordDisplay();
                
                
                if (isWordComplete()) {
                    winGame();
                }
            } else {
                
                letterBtn.classList.add('incorrect');
                gameState.wrongGuesses++;
                showHangmanPart();
                playSound(200, 300);
                
                // Check if game is lost
                if (gameState.wrongGuesses >= gameState.maxWrongGuesses) {
                    loseGame();
                }
            }
        }

        function updateWordDisplay() {
            const wordDisplay = document.getElementById('wordDisplay');
            wordDisplay.innerHTML = '';
            
            for (let letter of gameState.currentWord) {
                const letterBox = document.createElement('div');
                letterBox.className = 'letter-box';
                
                if (gameState.guessedLetters.includes(letter)) {
                    letterBox.textContent = letter;
                    letterBox.classList.add('revealed');
                } else {
                    letterBox.textContent = '';
                }
                
                wordDisplay.appendChild(letterBox);
            }
        }

        function updateCategoryHint() {
            const categoryNames = {
                animales: 'Animales',
                comida: 'Comida',
                paises: 'Países',
                deportes: 'Deportes'
            };
            
            document.getElementById('categoryHint').textContent = 
                `Categoría: ${categoryNames[gameState.currentCategory]}`;
        }

        function isWordComplete() {
            return gameState.currentWord.split('').every(letter => 
                gameState.guessedLetters.includes(letter)
            );
        }

        function showHangmanPart() {
            if (gameState.wrongGuesses <= hangmanParts.length) {
                const partId = hangmanParts[gameState.wrongGuesses - 1];
                const part = document.getElementById(partId);
                if (part) {
                    part.classList.add('visible');
                }
            }
        }

        function resetHangman() {
            hangmanParts.forEach(partId => {
                const part = document.getElementById(partId);
                if (part) {
                    part.classList.remove('visible');
                }
            });
        }

        function resetAlphabet() {
            const letterBtns = document.querySelectorAll('.letter-btn');
            letterBtns.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('correct', 'incorrect');
            });
        }

        function winGame() {
            gameState.gameActive = false;
            const points = calculatePoints();
            gameState.score += points;
            gameState.wordsCorrect++;
            
            showScoreAnimation(points);
            updateDisplay();
            
            setTimeout(() => {
                showGameResult(true, points);
            }, 1500);
            
            playSound(600, 500);
        }

        function loseGame() {
            gameState.gameActive = false;
            showGameResult(false, 0);
            playSound(150, 800);
        }

        function calculatePoints() {
            const difficultyMultiplier = {
                'facil': 50,
                'medio': 100,
                'dificil': 200
            };
            
            const basePoints = difficultyMultiplier[gameState.currentDifficulty];
            const wrongGuessesDeduction = gameState.wrongGuesses * 10;
            return Math.max(basePoints - wrongGuessesDeduction, 10);
        }

        function showScoreAnimation(points) {
            const animation = document.createElement('div');
            animation.className = 'score-animation';
            animation.textContent = `+${points}`;
            animation.style.left = '50%';
            animation.style.top = '50%';
            animation.style.transform = 'translate(-50%, -50%)';
            
            document.body.appendChild(animation);
            
            setTimeout(() => {
                document.body.removeChild(animation);
            }, 1200);
        }

        function showGameResult(won, points) {
            const overlay = document.getElementById('gameResultOverlay');
            const title = document.getElementById('resultTitle');
            const word = document.getElementById('resultWord');
            const stats = document.getElementById('resultStats');
            
            if (won) {
                title.textContent = '¡GANASTE!';
                title.className = 'result-title win';
                stats.textContent = `Puntuación: +${points}`;
            } else {
                title.textContent = '¡PERDISTE!';
                title.className = 'result-title lose';
                stats.textContent = `Intentos fallidos: ${gameState.wrongGuesses}`;
            }
            
            word.textContent = `La palabra era: ${gameState.currentWord}`;
            
            overlay.style.display = 'flex';
            setTimeout(() => {
                overlay.classList.add('show');
            }, 10);
        }

        function hideGameResult() {
            const overlay = document.getElementById('gameResultOverlay');
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }

        function continueGame() {
            hideGameResult();
            startNewGame();
        }

        function resetGame() {
            gameState.score = 0;
            gameState.wordsCorrect = 0;
            updateDisplay();
            hideGameResult();
            startNewGame();
        }

        function updateDisplay() {
            document.getElementById('score').textContent = gameState.score;
            document.getElementById('wordsCorrect').textContent = gameState.wordsCorrect;
        }

        function toggleSound() {
            gameState.soundEnabled = !gameState.soundEnabled;
            const soundToggle = document.querySelector('.sound-toggle');
            soundToggle.textContent = gameState.soundEnabled ? '🔊' : '🔇';
        }

        function playSound(frequency, duration) {
            if (!gameState.soundEnabled) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration / 1000);
            } catch (error) {
                // Silently handle audio context errors
            }
        }
    