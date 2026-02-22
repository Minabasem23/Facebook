document.addEventListener("DOMContentLoaded", () => {

  // Wallet
  let walletData = JSON.parse(localStorage.getItem("wallet")) || { balance: 0 };
  let balance = walletData.balance;
  const balanceEl = document.getElementById("balance");
  balanceEl.textContent = balance;

  // Buttons
  const watchBtn = document.getElementById("watch-btn");
  const withdrawBtn = document.getElementById("withdraw-btn");
  const copyBtn = document.getElementById("copy-btn");

  // Watch Ad
  watchBtn.addEventListener("click", () => {
    if (typeof show_10638478 !== "function") {
      alert("Ads not ready. Please wait a moment.");
      return;
    }

    show_10638478().then(() => {
      // الإعلان اتشاف بالكامل
      balance += 5;
      walletData.balance = balance;
      localStorage.setItem("wallet", JSON.stringify(walletData));
      balanceEl.textContent = balance;
    }).catch(() => {
      alert("You must finish the ad to get reward.");
    });
  });

  // Generate Withdraw Code
  function generateCode(amount) {
    let x = Math.floor(Math.random() * 90) + 10;
    let y = Math.floor(Math.random() * 90) + 10;
    let z = Math.floor(Math.random() * (x + y - 1)) + 1;
    let base = Math.floor((x * y + amount) / z);
    return base + "." + x + y + z;
  }

  // Withdraw
  withdrawBtn.addEventListener("click", () => {
    const input = document.getElementById("withdraw-amount");
    const amount = parseInt(input.value);

    if (!amount || amount < 10 || amount > 1000 || amount > balance) {
      alert("Invalid amount");
      return;
    }

    const code = generateCode(amount);

    balance -= amount;
    walletData.balance = balance;
    localStorage.setItem("wallet", JSON.stringify(walletData));

    balanceEl.textContent = balance;
    document.getElementById("withdrawed-amount").textContent = amount;
    document.getElementById("withdraw-code").textContent = code;
    document.getElementById("withdraw-balance").textContent = balance;
    document.getElementById("withdraw-result").classList.remove("hidden");
    document.getElementById("copy-status").classList.add("hidden");

    input.value = "";
  });

  // Copy Code
  copyBtn.addEventListener("click", () => {
    const code = document.getElementById("withdraw-code").textContent;
    navigator.clipboard.writeText(code).then(() => {
      const status = document.getElementById("copy-status");
      status.classList.remove("hidden");
      setTimeout(() => status.classList.add("hidden"), 2000);
    });
  });

});