document.addEventListener("DOMContentLoaded", () => {
    let walletData = JSON.parse(localStorage.getItem('walletData')) || {balance:100};
    let balance = walletData.balance;

    document.getElementById('balance').textContent = balance;

    const withdrawBtn = document.getElementById('withdraw-btn');
    const copyBtn = document.getElementById('copy-btn');

    withdrawBtn.addEventListener('click', () => {
        let amount = parseFloat(document.getElementById('withdraw-amount').value);

        if(isNaN(amount) || amount <= 0){
            alert("Enter a valid amount");
            return;
        }
        if(amount > balance){
            alert("Not enough balance");
            return;
        }

        // time × 5
        const timeNow = performance.now();
        let temp = timeNow * 5;

        // random 5 digits (1–9)
        const isArr = Array.from({length:5}, () => Math.floor(Math.random()*9)+1);

        let result = temp;
        isArr.forEach(n => result *= n);

        result = result / 3.14;
        const finalCode = result.toFixed(1);

        // update balance
        balance -= amount;
        walletData.balance = balance;
        localStorage.setItem('walletData', JSON.stringify(walletData));

        // UI update
        document.getElementById('withdrawed-amount').textContent = amount;
        document.getElementById('withdraw-code').textContent = finalCode;
        document.getElementById('withdraw-balance').textContent = balance;
        document.getElementById('balance').textContent = balance;

        document.getElementById('withdraw-result').style.display = "block";
        document.getElementById('copy-status').style.display = "none";
        document.getElementById('withdraw-amount').value = "";
    });

    copyBtn.addEventListener('click', () => {
        const codeText = document.getElementById('withdraw-code').textContent;

        navigator.clipboard.writeText(codeText).then(() => {
            document.getElementById('copy-status').style.display = "block";
            setTimeout(() => {
                document.getElementById('copy-status').style.display = "none";
            }, 2000);
        });
    });
});