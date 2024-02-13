const ANIMATION_DURATION = 1000;
const RESULT_DISPLAY_DELAY = 1100;

const symbols = ["cherry", "lemon", "orange", "plum", "bell", "bar"];
const payouts = {
    "lemon": 5,
    "orange": 10,
    "plum": 15,
    "bar": 25,
    "cherry": 30,
    "bell": 50
};

let playerBalance = parseInt(localStorage.getItem("playerBalance")) || 200;

function getRandomSymbol() {
    const randomValue = Math.random();
    let cumulativeProbability = 0;

    // Calculate the total payout for all symbols
    const totalPayout = Object.values(payouts).reduce((total, payout) => total + payout, 0);

    const adjustedProbabilities = {};

    // Define adjustment factors for each symbol
    const adjustmentFactors = {
        "cherry": 0.9,
        "lemon": 1.2,
        "orange": 1.15,
        "plum": 1.0,
        "bell": 0.8,
        "bar": 0.95
    };

    // Adjust the probability for each symbol individually
    symbols.forEach(symbol => {
        const symbolProbability = payouts[symbol] / totalPayout;
        adjustedProbabilities[symbol] = symbolProbability * adjustmentFactors[symbol];
    });

    for (const symbol of symbols) {
        cumulativeProbability += adjustedProbabilities[symbol];

        if (randomValue <= cumulativeProbability) {
            return symbol;
        }
    }

    // Fallback to a random symbol if something goes wrong
    return symbols[Math.floor(Math.random() * symbols.length)];
}




function setReelBackground(reelElement, symbol) {
    reelElement.style.backgroundImage = `url('images/${symbol}.png')`;
}

function spinReel(reelElement, stopSymbol) {
    const startTime = Date.now();
    let isSpinning = true;

    function shuffleFrame() {
        if (!isSpinning) {
            setReelBackground(reelElement, stopSymbol);
            return;
        }

        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed < ANIMATION_DURATION) {
            setReelBackground(reelElement, getRandomSymbol());
            requestAnimationFrame(shuffleFrame);
        } else {
            setReelBackground(reelElement, stopSymbol);
            isSpinning = false;
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
        }, RESULT_DISPLAY_DELAY);
    }
}

function handleWin(payout) {
    playerBalance += payout;

    // Flashing effect when there's a win
    document.querySelector('.reels').classList.add('flash');
    updateBalance(`Congratulations! You won ${payout.toLocaleString()} coins!`, 'flash');
}

function handleLoss(wager) {
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

function spin() {
    const reel1 = document.getElementById("reel1");
    const reel2 = document.getElementById("reel2");
    const reel3 = document.getElementById("reel3");
    const wagerInput = document.getElementById("wagerInput");

    const result1 = getRandomSymbol();
    const result2 = getRandomSymbol();
    const result3 = getRandomSymbol();

    setReelBackground(reel1, result1);
    setReelBackground(reel2, result2);
    setReelBackground(reel3, result3);

    // Remove the flashing class before starting the spin
    document.querySelector('.reels').classList.remove('flash');

    //Click and touch screen
    document.getElementById("spinButton").addEventListener("click", spin);
    document.getElementById("spinButton").addEventListener("touchstart", spin);

    spinReel(reel1, result1);
    spinReel(reel2, result2);
    spinReel(reel3, result3);

    const wager = parseInt(wagerInput.value, 10);

    if (isNaN(wager) || wager <= 0 || wager > playerBalance) {
        updateBalance("Invalid wager. Please enter a valid amount.", '');
        return;
    }

    setTimeout(() => {
        setReelBackground(reel1, result1);
        setReelBackground(reel2, result2);
        setReelBackground(reel3, result3);

        if (result1 === result2 && result2 === result3) {
            const payout = payouts[result1] * wager;

            // Flashing effect when there's a win
            handleWin(payout);
        } else {
            // Handle loss and check for game over condition
            handleLoss(wager);
        }
    }, RESULT_DISPLAY_DELAY);
}

updateBalance();

document.getElementById("spinButton").addEventListener("click", spin);
document.getElementById("spinButton").addEventListener("touchstart", spin);

const reels = document.querySelectorAll('.reel');
reels.forEach((reel) => {
    reel.addEventListener('touchstart', handleReelTouch);
});

function handleReelTouch(event) {
    // Handle touch interaction for the reels if needed
    // You can customize this function based on your requirements
}
