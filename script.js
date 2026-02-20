// ===== Wallet Data =====
let wallet = JSON.parse(localStorage.getItem("wallet")) || { balance: 100 };

// ===== Withdraw Section =====
const withdrawBtn = document.getElementById('withdraw-btn');
const amountInput = document.getElementById('withdraw-amount-input');
const balanceSpan = document.getElementById('balance');
const resultDiv = document.getElementById('withdraw-result');
const withdrawnSpan = document.getElementById('withdrawed-amount');
const balanceResultSpan = document.getElementById('withdraw-balance');

withdrawBtn.addEventListener('click', () => {
  const amount = parseFloat(amountInput.value);
  if(isNaN(amount) || amount <= 0){
    alert("Enter a valid amount");
    return;
  }

  if(wallet.balance < amount){
    alert("Insufficient balance");
    return;
  }

  wallet.balance -= amount;
  localStorage.setItem("wallet", JSON.stringify(wallet));

  // تحديث العرض
  balanceSpan.textContent = wallet.balance;
  withdrawnSpan.textContent = amount;
  balanceResultSpan.textContent = wallet.balance;

  resultDiv.classList.remove('hidden');
});

// ===== Watch Ad Section =====
const watchBtn = document.getElementById('watch-btn');
const watchResult = document.getElementById('watch-result');
const earnedSpan = document.getElementById('earned-w');

watchBtn.addEventListener('click', () => {
  watchBtn.disabled = true;
  watchBtn.textContent = "Watching... 30s";

  let countdown = 30;
  const interval = setInterval(() => {
    countdown--;
    watchBtn.textContent = `Watching... ${countdown}s`;

    if(countdown <= 0){
      clearInterval(interval);
      const earned = 5;
      wallet.balance += earned;
      localStorage.setItem("wallet", JSON.stringify(wallet));

      balanceSpan.textContent = wallet.balance;
      earnedSpan.textContent = earned;
      watchResult.classList.remove('hidden');

      watchBtn.textContent = "Watch Ad";
      watchBtn.disabled = false;
    }
  }, 1000);
});