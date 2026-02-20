document.addEventListener("DOMContentLoaded", () => {
    let walletData = JSON.parse(localStorage.getItem('walletData')) || {balance:100, adn:0};
    let balance = walletData.balance;
    document.getElementById('balance').textContent = balance;

    const withdrawBtn = document.getElementById('withdraw-btn');
    withdrawBtn.addEventListener('click', () => {
        let amount = parseFloat(document.getElementById('withdraw-amount').value);
        if(isNaN(amount) || amount <= 0){
            alert("Enter a valid amount!");
            return;
        }
        if(amount > balance){
            alert("Not enough balance!");
            return;
        }

        // الوقت الحالي بالمللي ثانية
        const timeNow = performance.now();
        let temp = timeNow * 5;

        // توليد رقم عشوائي 5 أرقام (لا أصفار)
        const isArr = Array.from({length:5}, () => Math.floor(Math.random()*9)+1);

        // ضرب كل رقم من is في temp
        let result = temp;
        for(let i=0;i<isArr.length;i++){
            result *= isArr[i];
        }

        // قسمة على 3.14
        result = result / 3.14;

        // خصم الرصيد
        balance -= amount;
        walletData.balance = balance;
        localStorage.setItem('walletData', JSON.stringify(walletData));
        document.getElementById('balance').textContent = balance;

        // عرض النتيجة
        document.getElementById('withdraw-amount').value = "";
        document.getElementById('withdrawed-amount').textContent = amount;
        document.getElementById('withdraw-code').textContent = result.toFixed(1);
        document.getElementById('withdraw-balance').textContent = balance;
        document.getElementById('withdraw-result').style.display = "block";
    });
});