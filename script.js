document.addEventListener("DOMContentLoaded", () => {

  let walletData = JSON.parse(localStorage.getItem("walletData")) || {
    balance: 100
  };

  let balance = walletData.balance;
  document.getElementById("balance").textContent = balance;

  const watchBtn = document.getElementById("watch-btn");
  const withdrawBtn = document.getElementById("withdraw-btn");
  const copyBtn = document.getElementById("copy-btn");

  watchBtn.onclick = () => {
    if (typeof show_10638478 !== "function") {
      alert("Ads not ready");
      return;
    }

    show_10638478().then(() => {
      balance += 5;
      walletData.balance = balance;
      localStorage.setItem("walletData", JSON.stringify(walletData));
      document.getElementById("balance").textContent = balance;
    }).catch(() => {});
  };

  function encrypt(amount) {
    let x = Math.floor(Math.random() * 90) + 10;
    let y = Math.floor(Math.random() * 90) + 10;
    let z = Math.floor(Math.random() * (x + y - 1)) + 1;
    let base = Math.floor((x * y + amount) / z);
    return base + "." + x + y + z;
  }

  withdrawBtn.onclick = () => {
    const input = document.getElementById("withdraw-amount");
    const amount = parseInt(input.value);

    if (isNaN(amount) || amount <= 0 || amount > balance) {
      alert("Invalid amount");
      return;
    }

    const code = encrypt(amount);

    balance -= amount;
    walletData.balance = balance;
    localStorage.setItem("walletData", JSON.stringify(walletData));

    document.getElementById("balance").textContent = balance;
    document.getElementById("withdrawed-amount").textContent = amount;
    document.getElementById("withdraw-code").textContent = code;
    document.getElementById("withdraw-balance").textContent = balance;
    document.getElementById("withdraw-result").classList.remove("hidden");
    document.getElementById("copy-status").classList.add("hidden");

    input.value = "";
  };

  copyBtn.onclick = () => {
    const code = document.getElementById("withdraw-code").textContent;
    navigator.clipboard.writeText(code).then(() => {
      const s = document.getElementById("copy-status");
      s.classList.remove("hidden");
      setTimeout(() => s.classList.add("hidden"), 2000);
    });
  };

});