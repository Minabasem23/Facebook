document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send-btn");
  const amountInput = document.getElementById("amount");
  const walletInput = document.getElementById("wallet");
  const outputDiv = document.getElementById("output");

  sendBtn.addEventListener("click", () => {
    const amount = amountInput.value;
    const wallet = walletInput.value;

    if (!amount || !wallet) {
      alert("يرجى ملء المبلغ والعنوان");
      return;
    }

    // الرسالة التي ستظهر في الجروب
    const message = `💰 سحب جديد!\nالمبلغ: ${amount} USDT\nالمحفظة: ${wallet}`;

    // عرض الرسالة على الصفحة للنسخ اليدوي
    outputDiv.textContent = message;
    outputDiv.classList.remove("hidden");

    // نسخة تلقائية للنسخ
    navigator.clipboard.writeText(message).then(() => {
      alert("تم نسخ الرسالة! يمكنك إرسالها للجروب الآن");
    });
  });
});