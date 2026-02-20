document.addEventListener("DOMContentLoaded", () => {

    /* =====================
       WALLET INIT
    ===================== */
    let walletData = JSON.parse(localStorage.getItem('walletData')) || {
        balance: 100,
        adn: 0
    };

    let balance = walletData.balance;
    document.getElementById('balance').textContent = balance;

    /* =====================
       ADS CONFIG
    ===================== */
    const ads = {
        1: "https://omg10.com/4/10591369",
        2: "https://omg10.com/4/10591326"
    };

    const watchBtn = document.getElementById('watch-btn');
    const captchaContainer = document.getElementById('captcha-container');
    const captchaQuestion = document.getElementById('captcha-question');
    const captchaAnswer = document.getElementById('captcha-answer');
    const verifyBtn = document.getElementById('verify-btn');
    const rewardDiv = document.getElementById('reward');

    let nextAd = 1;
    let captchaResult = 0;

    /* =====================
       WATCH AD
    ===================== */
    watchBtn.addEventListener('click', () => {
        if (walletData.adn === 0) nextAd = 1;
        else if (walletData.adn === 1) nextAd = 2;
        else nextAd = 1;

        if (nextAd === 2) {
            generateCaptcha();
            captchaContainer.classList.remove('hidden');
            watchBtn.disabled = true;
        } else {
            startAd(nextAd);
        }
    });

    verifyBtn.addEventListener('click', () => {
        const userAns = parseInt(captchaAnswer.value);
        if (userAns === captchaResult) {
            captchaContainer.classList.add('hidden');
            captchaAnswer.value = "";
            watchBtn.disabled = false;
            startAd(nextAd);
        } else {
            alert("Wrong answer! Try again.");
        }
    });

    function generateCaptcha() {
        let a = Math.floor(Math.random() * 9) + 1;
        let b = Math.floor(Math.random() * 9) + 1;

        if (a < b) {
            captchaResult = a + b;
            captchaQuestion.textContent = `${a} + ${b} = ?`;
        } else {
            captchaResult = a - b;
            captchaQuestion.textContent = `${a} - ${b} = ?`;
        }
    }

    function startAd(ad) {
        const adWindow = window.open(ads[ad], "_blank", "width=800,height=600");
        let watched = false;

        setTimeout(() => {
            watched = true;
            adWindow.close();
            giveReward(ad);
        }, 30000);

        const checker = setInterval(() => {
            if (adWindow.closed) {
                clearInterval(checker);
                if (!watched) {
                    const replay = confirm("You didn't wait 30s. Do you want to replay?");
                    if (replay) watchBtn.click();
                }
            }
        }, 1000);
    }

    function giveReward(ad) {
        balance += 5;
        walletData.balance = balance;
        walletData.adn = ad;
        walletData.timestamp = Date.now();
        localStorage.setItem('walletData', JSON.stringify(walletData));

        document.getElementById('balance').textContent = balance;
        rewardDiv.classList.remove('hidden');
        setTimeout(() => rewardDiv.classList.add('hidden'), 3000);
    }

    /* =====================
       ENCRYPTION SYSTEM
    ===================== */

    function encryptNumber(number) {
        const multiplier1 = 0.001;
        const multiplier2 = 5;
        const multiplier3 = 7;
        const divisor = 3.14;

        let code = ((number * multiplier1) * multiplier2 * multiplier3) / divisor;
        return code.toFixed(1);
    }

    function decryptNumber(code) {
        const multiplier1 = 0.001;
        const multiplier2 = 5;
        const multiplier3 = 7;
        const divisor = 3.14;

        let number = (code * divisor) / (multiplier1 * multiplier2 * multiplier3);
        return Math.round(number);
    }

    /* =====================
       WITHDRAW
    ===================== */
    const withdrawBtn = document.getElementById('withdraw-btn');
    const copyBtn = document.getElementById('copy-btn');

    withdrawBtn.addEventListener('click', () => {
        const input = document.getElementById('withdraw-amount');
        const amount = parseFloat(input.value);

        if (!input || isNaN(amount) || amount <= 0) {
            alert("Enter valid amount");
            return;
        }

        if (amount > balance) {
            alert("Not enough balance");
            return;
        }

        // 🔐 Encrypt using our system
        const finalCode = encryptNumber(amount);

        // Update balance
        balance -= amount;
        walletData.balance = balance;
        localStorage.setItem('walletData', JSON.stringify(walletData));

        // Update UI
        document.getElementById('balance').textContent = balance;
        document.getElementById('withdrawed-amount').textContent = amount;
        document.getElementById('withdraw-code').textContent = finalCode;
        document.getElementById('withdraw-balance').textContent = balance;

        document.getElementById('withdraw-result').classList.remove('hidden');
        document.getElementById('copy-status').classList.add('hidden');
        input.value = "";
    });

    /* =====================
       COPY CODE
    ===================== */
    copyBtn.addEventListener('click', () => {
        const code = document.getElementById('withdraw-code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const s = document.getElementById('copy-status');
            s.classList.remove('hidden');
            setTimeout(() => s.classList.add('hidden'), 2000);
        });
    });

});