const allEmojis = ['😀','😎','🥳','🤖','👽','🐶','🐱','🐸','🐼','🐵','🍎','🍔','🍕','⚽','🚗','🌈','🔥','🎃','🎁','🦄','🐢','🍩','🛸','🎯','🦋','🥑','🍇','🏆','💎','📚','🧩','🎮','🚀','🍦','🏖'];
    let selectedEmojis = [];
    let cardsArray = [];
    let flippedCards = [];
    let matchedCount = 0;
    let timerInterval;
    let seconds = 0;

    const board = document.getElementById('board');
    const timerDisplay = document.getElementById('timer');

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function pickRandomEmojis() {
        let shuffled = shuffle([...allEmojis]);
        return shuffled.slice(0, 15);
    }

    function startTimer() {
        clearInterval(timerInterval);
        seconds = 0;
        timerDisplay.textContent = "⏱ 0:00";
        timerInterval = setInterval(() => {
            seconds++;
            let mins = Math.floor(seconds / 60);
            let secs = seconds % 60;
            timerDisplay.textContent = `⏱ ${mins}:${secs.toString().padStart(2,'0')}`;
        }, 1000);
    }

    function createBoard() {
        board.innerHTML = '';
        matchedCount = 0;
        flippedCards = [];
        let gameEmojis = shuffle([...selectedEmojis, ...selectedEmojis]);
        gameEmojis.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.textContent = emoji;
            card.addEventListener('click', flipCard);
            board.appendChild(card);
        });
        startTimer();
    }

    function flipCard() {
        const card = this;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (flippedCards.length === 2) return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 700);
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.emoji === card2.dataset.emoji) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedCount += 2;
            if (matchedCount === cardsArray.length) {
                clearInterval(timerInterval);
                document.getElementById('finalTime').textContent = `Tiempo: ${timerDisplay.textContent.replace('⏱ ','')}`;
                document.getElementById('winModal').style.display = 'flex';
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }
        flippedCards = [];
    }

    function resetGame() {
        createBoard();
    }

    function newGame() {
        selectedEmojis = pickRandomEmojis();
        cardsArray = [...selectedEmojis, ...selectedEmojis];
        createBoard();
    }

    function closeModal() {
        document.getElementById('winModal').style.display = 'none';
    }

    // Inicializar juego
    selectedEmojis = pickRandomEmojis();
    cardsArray = [...selectedEmojis, ...selectedEmojis];
    createBoard();
