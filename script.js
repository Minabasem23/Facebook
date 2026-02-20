document.addEventListener("DOMContentLoaded", () => {

    // ========================
    // WALLET INIT
    // ========================
    let walletData = JSON.parse(localStorage.getItem('walletData')) || { balance: 100, adn: 0 };
    let balance = walletData.balance;
    document.getElementById('balance').textContent = balance;

    // ========================
    // ADS CONFIG
    // ========================
    const ads = {1:"https://omg10.com/4/10591369", 2:"https://omg10.com/4/10591326"};
    const watchBtn = document.getElementById('watch-btn');
    const captchaContainer = document.getElementById('captcha-container');
    const captchaQuestion = document.getElementById('captcha-question');
    const captchaAnswer = document.getElementById('captcha-answer');
    const verifyBtn = document.getElementById('verify-btn');
    const rewardDiv = document.getElementById('reward');

    let nextAd = 1;
    let captchaResult = 0;

    // ========================
    // WATCH ADS
    // ========================
    watchBtn.addEventListener('click', () => {
        nextAd = (walletData.adn === 0) ? 1 : 2;
        if(nextAd === 2){
            generateCaptcha();
            captchaContainer.classList.remove('hidden');
            watchBtn.disabled = true;
        } else startAd(nextAd);
    });

    verifyBtn.addEventListener('click', () => {
        const userAns = parseInt(captchaAnswer.value);
        if(userAns === captchaResult){
            captchaContainer.classList.add('hidden');
            captchaAnswer.value = "";
            watchBtn.disabled = false;
            startAd(nextAd);
        } else alert("Wrong answer! Try again.");
    });

    function generateCaptcha(){
        let a = Math.floor(Math.random()*9)+1;
        let b = Math.floor(Math.random()*9)+1;
        if(a<b){ captchaResult = a+b; captchaQuestion.textContent = `${a} + ${b} = ?`; }
        else{ captchaResult = a-b; captchaQuestion.textContent = `${a} - ${b} = ?`; }
    }

    function startAd(ad){
        const adWindow = window.open(ads[ad], "_blank", "width=800,height=600");
        let watched = false;
        setTimeout(()=>{ watched=true; adWindow.close(); giveReward(ad); }, 30000);
        const checker = setInterval(()=>{
            if(adWindow.closed){
                clearInterval(checker);
                if(!watched && confirm("You didn't wait 30s. Replay?")) watchBtn.click();
            }
        },1000);
    }

    function giveReward(ad){
        balance+=5;
        walletData.balance=balance;
        walletData.adn=ad;
        walletData.timestamp=Date.now();
        localStorage.setItem('walletData', JSON.stringify(walletData));
        document.getElementById('balance').textContent = balance;
        rewardDiv.classList.remove('hidden');
        setTimeout(()=>rewardDiv.classList.add('hidden'),3000);
    }

    // ========================
    // ENCRYPTION SYSTEM FIXED
    // ========================
    function generateCode(currently){
        const X = Math.floor(Math.random() * 90) + 10; // 10~99
        const Y = Math.floor(Math.random() * 90) + 10;
        const Z = Math.floor(Math.random() * (X + Y - 1)) + 1; // 1 ~ X+Y-1
        const result = (X*Y + currently)/Z;
        const intPart = Math.floor(result);
        const code = `${intPart}.${X}${Y}${Z}`;
        return { code, X, Y, Z, intPart };
    }

    function decodeCode(code,X,Y,Z){
        const intPart = parseInt(code.split('.')[0]);
        const currently = intPart*Z - (X*Y);
        return currently;
    }

    // ========================
    // WITHDRAW
    // ========================
    const withdrawBtn=document.getElementById('withdraw-btn');
    const copyBtn=document.getElementById('copy-btn');

    withdrawBtn.addEventListener('click', ()=>{
        const input=document.getElementById('withdraw-amount');
        const amount=parseFloat(input.value);
        if(!input || isNaN(amount) || amount<=0){ alert("Enter valid amount"); return; }
        if(amount>balance){ alert("Not enough balance"); return; }

        // 🔐 إنشاء كود مطابق للمبلغ
        const {code, X, Y, Z} = generateCode(amount);

        balance -= amount;
        walletData.balance = balance;
        localStorage.setItem('walletData',JSON.stringify(walletData));

        // تحديث واجهة المستخدم
        document.getElementById('balance').textContent=balance;
        document.getElementById('withdrawed-amount').textContent=amount;
        document.getElementById('withdraw-code').textContent=code;
        document.getElementById('withdraw-balance').textContent=balance;
        document.getElementById('withdraw-result').classList.remove('hidden');
        document.getElementById('copy-status').classList.add('hidden');
        input.value="";
    });

    copyBtn.addEventListener('click', ()=>{
        const code=document.getElementById('withdraw-code').textContent;
        navigator.clipboard.writeText(code).then(()=>{
            document.getElementById('copy-status').classList.remove('hidden');
            setTimeout(()=>document.getElementById('copy-status').classList.add('hidden'),2000);
        });
    });

});