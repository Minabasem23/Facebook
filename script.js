document.addEventListener("DOMContentLoaded", () => {
  let balance = parseFloat(localStorage.getItem('balance')) || 0;
  const maxAds = 250;
  const pauseAfter = 50;
  const pauseTime = 5 * 60 * 1000; // 5 دقائق
  let adsWatched = parseInt(localStorage.getItem('adsWatched')) || 0;

  const balanceDisplay = document.getElementById('balance');
  const watchBtn = document.getElementById('watch-btn');
  const rewardDiv = document.getElementById('reward');
  const withdrawBtn = document.getElementById('withdraw-btn');

  balanceDisplay.textContent = balance.toFixed(6);

  watchBtn.addEventListener('click', () => {
    if (adsWatched >= maxAds) {
      alert("Reached daily ad limit!");
      return;
    }

    adsWatched++;
    localStorage.setItem('adsWatched', adsWatched);

    balance += 0.0002;
    localStorage.setItem('balance', balance.toFixed(6));
    balanceDisplay.textContent = balance.toFixed(6);

    rewardDiv.classList.remove('hidden');
    setTimeout(() => rewardDiv.classList.add('hidden'), 2000);

    if (adsWatched % pauseAfter === 0) {
      watchBtn.disabled = true;
      setTimeout(() => {
        watchBtn.disabled = false;
      }, pauseTime);
    }
  });

  withdrawBtn.addEventListener('click', () => {
    const wallet = document.getElementById('withdraw-wallet').value.trim();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);

    if (!wallet) { alert("Enter wallet address"); return; }
    if (!amount || amount > balance || amount < 0.0002) { alert("Invalid amount"); return; }

    balance -= amount;
    localStorage.setItem('balance', balance.toFixed(6));
    balanceDisplay.textContent = balance.toFixed(6);

    document.getElementById('withdrawed-amount').textContent = amount.toFixed(6);
    document.getElementById('withdraw-wallet-display').textContent = wallet;
    document.getElementById('withdraw-result').classList.remove('hidden');

    // إرسال البيانات للبوت سيتم عبر bot.js في السيرفر
  });
});