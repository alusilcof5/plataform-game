    let playerScore = 0;
    let computerScore = 0;

    function computerPlay() {
        const choices = ['piedra', 'papel', 'tijeras'];
        return choices[Math.floor(Math.random() * 3)];
    }

    function play(playerSelection) {
        const computerSelection = computerPlay();
        let result = '';

        if (playerSelection === computerSelection) {
            result = 'Empate 😐';
        } else if (
            (playerSelection === 'piedra' && computerSelection === 'tijeras') ||
            (playerSelection === 'papel' && computerSelection === 'piedra') ||
            (playerSelection === 'tijeras' && computerSelection === 'papel')
        ) {
            playerScore++;
            result = `Ganaste 🎉 (${playerSelection} vence a ${computerSelection})`;
        } else {
            computerScore++;
            result = `Perdiste 😢 (${computerSelection} vence a ${playerSelection})`;
        }

        document.getElementById('player-score').textContent = playerScore;
        document.getElementById('computer-score').textContent = computerScore;
        document.getElementById('result').textContent = result;
    }
