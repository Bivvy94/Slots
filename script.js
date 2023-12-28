const symbols = ["cherry", "lemon", "orange", "plum", "bell", "bar"];
const payouts = {
    "cherry": 50,
    "lemon": 10,
    "orange": 15,
    "plum": 20,
    "bell": 40,
    "bar": 5
};

let playerBalance = parseInt(localStorage.getItem("playerBalance")) || 150;

function getRandomSymbol() {
    const randomValue = Math.random();
    let cumulativeProbability = 0;

    for (const symbol of symbols) {
        cumulativeProbability += 0.45; // Adjust probabilities based on the number of symbols

        if (randomValue <= cumulativeProbability) {
            return symbol;
        }
    }

    return symbols[Math.floor(Math.random() * symbols.length)];
}

function shuffleReel(reelElement, stopSymbol) {
    const startTime = Date.now();
    const duration = 1500;

    function shuffleFrame() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed < duration) {
            const randomSymbol = getRandomSymbol();
            reelElement.style.backgroundImage = `url('images/${randomSymbol}.png')`;
            requestAnimationFrame(shuffleFrame);
        } else {
            reelElement.style.backgroundImage = `url('images/${stopSymbol}.png')`;
        }
    }

    shuffleFrame();
}

function updateBalance(resultMessage, flashClass) {
    const balanceElement = document.getElementById("balance");
    const resultElement = document.getElementById("result");

    playerBalanceText = `Balance: $${playerBalance.toLocaleString()}`;
    resultText = resultMessage ? `\n${resultMessage}` : '';

    balanceElement.textContent = playerBalanceText;
    resultElement.textContent = resultText;

    localStorage.setItem("playerBalance", playerBalance.toString());

    // Remove the flashing class after a delay
    if (flashClass) {
        setTimeout(() => {
            document.querySelector('.reels').classList.remove(flashClass);
        }, 2000);
    }
}

function spin() {
    const reel1 = document.getElementById("reel1");
    const reel2 = document.getElementById("reel2");
    const reel3 = document.getElementById("reel3");
    const wagerInput = document.getElementById("wagerInput");

    const result1 = getRandomSymbol();
    const result2 = getRandomSymbol();
    const result3 = getRandomSymbol();

    reel1.style.backgroundImage = `url('images/${result1}.png')`;
    reel2.style.backgroundImage = `url('images/${result2}.png')`;
    reel3.style.backgroundImage = `url('images/${result3}.png')`;

    // Remove the flashing class before starting the spin
    document.querySelector('.reels').classList.remove('flash');

    shuffleReel(reel1, result1);
    shuffleReel(reel2, result2);
    shuffleReel(reel3, result3);

    const wager = parseInt(wagerInput.value, 10);

    if (isNaN(wager) || wager <= 0 || wager > playerBalance) {
        updateBalance("Invalid wager. Please enter a valid amount.", '');
        return;
    }

    setTimeout(() => {
        reel1.style.backgroundImage = `url('images/${result1}.png')`;
        reel2.style.backgroundImage = `url('images/${result2}.png')`;
        reel3.style.backgroundImage = `url('images/${result3}.png')`;

        if (result1 === result2 && result2 === result3) {
            const payout = payouts[result1] * wager;
            playerBalance += payout;

            // Flashing effect when there's a win
            document.querySelector('.reels').classList.add('flash');
            updateBalance(`Congratulations! You won ${payout.toLocaleString()} coins!`, 'flash');
        } else {
            playerBalance -= wager;
            updateBalance(`Try again. You lost ${wager.toLocaleString()} coins.`, '');
            
            if (playerBalance <= 0) {
                const startOver = confirm("You are out of money. Do you want to start over?");
                if (startOver) {
                    playerBalance = 100;
                    updateBalance("Game restarted. Good luck!", '');
                } else {
                    // Optionally, you can disable the spin button or provide other options
                }
            }
        }
    }, 2000);
}

updateBalance();

document.getElementById("spinButton").addEventListener("click", spin);
