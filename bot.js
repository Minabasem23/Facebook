// bot.js
const { Telegraf } = require('telegraf');
const express = require('express');
const app = express();

// استخدم التوكن والجروب التجريبي للأختبار
const BOT_TOKEN = '8598281162:AAE7-tKfbvL4057cggKT8Mf50qvc_fV6fCc';
const GROUP_ID = 7560767142;

const bot = new Telegraf(BOT_TOKEN);

app.use(express.json());

// مسار استقبال طلب السحب من واجهة المستخدم
app.post('/withdraw', (req, res) => {
  const { wallet, amount } = req.body;

  if (!wallet || !amount) {
    return res.status(400).send({ status: "error", message: "Missing wallet or amount" });
  }

  // إرسال رسالة للجروب
  bot.telegram.sendMessage(
    GROUP_ID,
    `💰 New withdrawal request!\nWallet: ${wallet}\nAmount: ${amount.toFixed(6)} USDT`
  ).then(() => {
    console.log(`Withdrawal sent: ${wallet} - ${amount}`);
  }).catch(err => {
    console.error('Error sending message:', err);
  });

  // إعادة رد للواجهة
  res.send({ status: "ok" });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});