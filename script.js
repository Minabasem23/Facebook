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
    watchBtn.addEventListener('click', () => {

        let nextAd;
        if(walletData.adn === 0) {
            nextAd = 1; // أول إعلان
        } else if(walletData.adn === 1) {
            // قبل فتح الإعلان الثاني، تحقق captcha
            if(!solveCaptcha()){
                alert("Wrong answer! You cannot watch the ad.");
                return; // يمنع فتح الإعلان الثاني
            }
            nextAd = 2;
        } else {
            // إذا وصلنا بعد الإعلان الثاني، نبدأ من الأول مرة أخرى
            nextAd = 1;
        }

        // فتح الإعلان في نافذة جديدة
        const adWindow = window.open(ads[nextAd], "_blank", "width=800,height=600");
        let watched = false;

        // عداد 30 ثانية
        const timer = setTimeout(() => {
            watched = true;
            adWindow.close();
            addW(nextAd);
        }, 30000);

        const checkInterval = setInterval(() => {
            if (adWindow.closed) {
                clearInterval(checkInterval);
                if(!watched){
                    const replay = confirm("You didn't wait 30s. Do you want to replay?");
                    if(replay){
                        watchBtn.click();
                    }
                }
            }
        }, 1000);

        function addW(ad) {
            balance += 5;
            walletData.balance = balance;
            walletData.adn = ad;
            walletData.timestamp = new Date().toISOString();
            localStorage.setItem('walletData', JSON.stringify(walletData));
            document.getElementById('balance').textContent = balance;
        }
    });

    function solveCaptcha(){
        let num1 = Math.floor(Math.random()*9) + 1;
        let num2 = Math.floor(Math.random()*9) + 1;
        let operator;

        if(num1 >= num2){
            operator = "-";
        } else {
            operator = "+";
        }

        const result = operator === "+" ? num1 + num2 : num1 - num2;
        const userAnswer = prompt(`Solve this to continue: ${num1} ${operator} ${num2} = ?`);

        return parseInt(userAnswer) === result;
    }
});