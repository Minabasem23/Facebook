document.addEventListener("DOMContentLoaded", () => {

  let data = JSON.parse(localStorage.getItem("wallet")) || { balance: 0 };
  let balance = data.balance;

  const balanceEl = document.getElementById("balance");
  const watchBtn = document.getElementById("watch-btn");
  const withdrawBtn = document.getElementById("withdraw-btn");
  const copyBtn = document.getElementById("copy-btn");

  balanceEl.textContent = balance;

  function makeCode(w) {
    let x = Math.floor(Math.random() * 90) + 10;
    let y = Math.floor(Math.random() * 90) + 10;
    let z = Math.floor(Math.random() * (x + y - 1)) + 1;
    let n = Math.floor((x * y + w) / z);
    return n + "." + x.toString() + y.toString() + z.toString();
  }

  watchBtn.onclick = () => {
    show_10638478().then(() => {
      balance += 5;
      data.balance = balance;
      localStorage.setItem("wallet", JSON.stringify(data));
      balanceEl.textContent = balance;
    }).catch(() => {});
  };

  withdrawBtn.onclick = () => {
    const input = document.getElementById("withdraw-amount");
    const w = parseInt(input.value);

    if (!w || w < 10 || w > 1000 || w > balance) return;

    const code = makeCode(w);

    balance -= w;
    data.balance = balance;
    localStorage.setItem("wallet", JSON.stringify(data));

    balanceEl.textContent = balance;
    document.getElementById("withdrawed-amount").textContent = w;
    document.getElementById("withdraw-code").textContent = code;
    document.getElementById("withdraw-balance").textContent = balance;
    document.getElementById("withdraw-result").classList.remove("hidden");
    document.getElementById("copy-status").classList.add("hidden");

    input.value = "";
  };

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(
      document.getElementById("withdraw-code").textContent
    ).then(() => {
      const s = document.getElementById("copy-status");
      s.classList.remove("hidden");
      setTimeout(() => s.classList.add("hidden"), 2000);
    });
  };

});