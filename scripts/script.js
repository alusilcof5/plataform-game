
        // Sistema de datos de juegos y estadísticas
        class GameStats {
            constructor() {
                this.initializeData();
                this.loadStatsFromStorage();
                this.startStatsUpdater();
            }

            initializeData() {
                this.games = {
                    'ajedrez.html': { name: 'Ajedrez', plays: 0, rating: 4.8, difficulty: 'easy' },
                    'damas.html': { name: 'Damas', plays: 0, rating: 4.6, difficulty: 'easy' },
                    'memoria.html': { name: 'Memoria', plays: 0, rating: 4.9, difficulty: 'medium' },
                    'sudoku.html': { name: 'Sudoku', plays: 0, rating: 4.7, difficulty: 'hard' },
                    'loteria.html': { name: 'Lotería', plays: 0, rating: 4.5, difficulty: 'easy' },
                    'breakout.html': { name: 'Breakout', plays: 0, rating: 4.8, difficulty: 'medium' }
                };

                this.totalUsers = 0;
                this.sessionStart = Date.now();
            }

            loadStatsFromStorage() {
                // Simular carga de datos (en una app real, aquí cargarías desde una base de datos)
                const savedData = this.loadFromMemory();
                if (savedData) {
                    this.games = { ...this.games, ...savedData.games };
                    this.totalUsers = savedData.totalUsers || this.generateInitialUsers();
                } else {
                    // Generar datos iniciales realistas
                    this.generateInitialStats();
                }
            }

            generateInitialStats() {
                // Generar estadísticas iniciales realistas
                const baseUsers = Math.floor(Math.random() * 500) + 100; // 100-600 usuarios
                this.totalUsers = baseUsers;
                
                Object.keys(this.games).forEach(gameKey => {
                    // Los juegos más fáciles tienen más partidas
                    const difficultyMultiplier = {
                        'easy': 1.5,
                        'medium': 1.0,
                        'hard': 0.7
                    };
                    
                    const multiplier = difficultyMultiplier[this.games[gameKey].difficulty];
                    this.games[gameKey].plays = Math.floor(Math.random() * 800 * multiplier) + 50;
                    
                    // Rating ligeramente aleatorio pero realista
                    const baseRating = this.games[gameKey].rating;
                    this.games[gameKey].rating = Math.round((baseRating + (Math.random() * 0.4 - 0.2)) * 10) / 10;
                });

                this.saveToMemory();
            }

            generateInitialUsers() {
                return Math.floor(Math.random() * 500) + 100;
            }

            // Simular almacenamiento en memoria (sin localStorage)
            saveToMemory() {
                this.memoryData = {
                    games: this.games,
                    totalUsers: this.totalUsers,
                    lastSave: Date.now()
                };
            }

            loadFromMemory() {
                return this.memoryData;
            }

            // Registrar cuando alguien juega un juego
            recordGamePlay(gameUrl) {
                if (this.games[gameUrl]) {
                    this.games[gameUrl].plays++;
                    
                    // Pequeña probabilidad de nuevo usuario
                    if (Math.random() < 0.1) {
                        this.totalUsers++;
                    }
                    
                    this.saveToMemory();
                    this.updateStatsDisplay();
                }
            }

            // Calcular estadísticas en tiempo real
            calculateStats() {
                const totalPlays = Object.values(this.games).reduce((sum, game) => sum + game.plays, 0);
                const availableGames = Object.keys(this.games).length;
                const avgRating = Object.values(this.games).reduce((sum, game) => sum + game.rating, 0) / availableGames;
                
                // Simular usuarios activos (5-15% del total)
                const activeUsers = Math.floor(this.totalUsers * (0.05 + Math.random() * 0.10));

                return {
                    availableGames,
                    totalPlays,
                    activeUsers,
                    avgRating: Math.round(avgRating * 10) / 10
                };
            }

            updateStatsDisplay() {
                const stats = this.calculateStats();
                
                const statNumbers = document.querySelectorAll('.stat-number');
                if (statNumbers.length >= 4) {
                    statNumbers[0].textContent = stats.availableGames;
                    statNumbers[1].textContent = stats.totalPlays.toLocaleString();
                    statNumbers[2].textContent = stats.activeUsers;
                    statNumbers[3].textContent = stats.avgRating + '⭐';
                }
            }

            // Simular actividad en tiempo real
            startStatsUpdater() {
                // Actualizar cada 10 segundos
                setInterval(() => {
                    // Simular nuevas partidas ocasionalmente
                    if (Math.random() < 0.3) { // 30% de probabilidad
                        const games = Object.keys(this.games);
                        const randomGame = games[Math.floor(Math.random() * games.length)];
                        this.games[randomGame].plays++;
                    }

                    // Simular nuevos usuarios ocasionalmente
                    if (Math.random() < 0.1) { // 10% de probabilidad
                        this.totalUsers++;
                    }

                    this.saveToMemory();
                    this.updateStatsDisplay();
                }, 10000);

                // Pequeñas actualizaciones cada 3 segundos
                setInterval(() => {
                    if (Math.random() < 0.2) { // 20% de probabilidad
                        this.updateStatsDisplay();
                    }
                }, 3000);
            }

            // Obtener el juego más popular
            getMostPopularGame() {
                return Object.entries(this.games).reduce((max, [key, game]) => 
                    game.plays > max.plays ? { ...game, url: key } : max, 
                    { plays: 0 }
                );
            }

            // Obtener estadísticas de un juego específico
            getGameStats(gameUrl) {
                return this.games[gameUrl] || null;
            }
        }

        // Inicializar el sistema de estadísticas
        const gameStats = new GameStats();

        function navigateToGame(gameUrl) {
            // Registrar la jugada
            gameStats.recordGamePlay(gameUrl);
            
            // Efecto de carga
            const card = event.currentTarget;
            const button = card.querySelector('.play-button');
            const originalText = button.textContent;
            
            button.textContent = 'Cargando...';
            button.style.background = '#95a5a6';
            
            // Simular carga y redirigir
            setTimeout(() => {
                // En un entorno real, aquí harías window.location.href = gameUrl
                alert(`Redirigiendo a: ${gameUrl}\n\n(En desarrollo: Esta página aún no existe)\n\n📊 Estadísticas actualizadas!`);
                
                // Restaurar botón
                button.textContent = originalText;
                button.style.background = '';
            }, 1000);
        }

        function showComingSoon() {
            alert('🚧 Este juego estará disponible muy pronto!\n\nMantente atento a las actualizaciones.');
        }

        // Mostrar estadísticas adicionales en consola para desarrollo
        function showDetailedStats() {
            console.log('📊 Estadísticas Detalladas:');
            console.log('Games:', gameStats.games);
            console.log('Total Users:', gameStats.totalUsers);
            console.log('Most Popular:', gameStats.getMostPopularGame());
        }

        // Efecto de entrada para las cards
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.game-card');
            
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });

            // Inicializar estadísticas después de cargar
            setTimeout(() => {
                gameStats.updateStatsDisplay();
            }, 500);

            // Hacer disponible la función para debugging
            window.showStats = showDetailedStats;
        });

        // Easter egg: doble click en las estadísticas muestra detalles
        document.addEventListener('DOMContentLoaded', function() {
            const statsSection = document.querySelector('.stats');
            if (statsSection) {
                statsSection.addEventListener('dblclick', showDetailedStats);
            }
        });
   
  