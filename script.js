document.addEventListener("DOMContentLoaded", () => {
    let balance = 0;
    let walletData = JSON.parse(localStorage.getItem('walletData')) || {balance:0, adn:0};
    balance = walletData.balance;
    document.getElementById('balance').textContent = balance;

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

    let nextAd, currentResult;

    watchBtn.addEventListener('click', () => {
        // تحديد الإعلان التالي
        if(walletData.adn === 0) nextAd = 1;
        else if(walletData.adn === 1) nextAd = 2;
        else nextAd = 1;

        // إذا الإعلان الثاني، إظهار captcha
        if(nextAd === 2){
            generateCaptcha();
            captchaContainer.style.display = "block";
            watchBtn.disabled = true;
        } else {
            startAd(nextAd);
        }
    });

    verifyBtn.addEventListener('click', () => {
        const userAnswer = parseInt(captchaAnswer.value);
        if(userAnswer === currentResult){
            captchaContainer.style.display = "none";
            captchaAnswer.value = "";
            watchBtn.disabled = false;
            startAd(nextAd);
        } else {
            alert("Wrong answer! Try again.");
        }
    });

    function generateCaptcha(){
        let num1 = Math.floor(Math.random()*9)+1;
        let num2 = Math.floor(Math.random()*9)+1;
        let operator = num1 >= num2 ? "-" : "+";
        currentResult = operator === "+" ? num1+num2 : num1-num2;
        captchaQuestion.textContent = `${num1} ${operator} ${num2} = ?`;
    }

    function startAd(ad){
        const adWindow = window.open(ads[ad], "_blank", "width=800,height=600");
        let watched = false;

        const timer = setTimeout(() => {
            watched = true;
            adWindow.close();
            giveReward(ad);
        }, 30000); // 30s

        const checkInterval = setInterval(() => {
            if(adWindow.closed){
                clearInterval(checkInterval);
                if(!watched){
                    const replay = confirm("You didn't wait 30s. Do you want to replay?");
                    if(replay) watchBtn.click();
                }
            }
        }, 1000);
    }

    function giveReward(ad){
        balance += 5;
        walletData.balance = balance;
        walletData.adn = ad;
        walletData.timestamp = new Date().toISOString();
        localStorage.setItem('walletData', JSON.stringify(walletData));
        document.getElementById('balance').textContent = balance;

        rewardDiv.style.display = "block";
        setTimeout(()=> rewardDiv.style.display = "none", 3000); // اختفاء بعد 3s
    }
});