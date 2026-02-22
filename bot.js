const { Telegraf } = require('telegraf');

// ضع توكن البوت هنا
const bot = new Telegraf('YOUR_BOT_TOKEN');

// ضع هنا معرف الجروب (مثال: -1001234567890)
const groupId = 'YOUR_GROUP_ID';

// أمر لإرسال سحب محدد
bot.command('withdraw', (ctx) => {
    const amount = '0.0002 USDT'; // يمكن تغييره ديناميكيًا
    const wallet = '0xYourWalletAddressHere';

    const message = `💰 سحب جديد!\nالمبلغ: ${amount}\nالمحفظة: ${wallet}`;

    bot.telegram.sendMessage(groupId, message)
        .then(() => {
            ctx.reply('تم إرسال الرسالة للجروب بنجاح ✅');
        })
        .catch(err => {
            console.error(err);
            ctx.reply('حدث خطأ أثناء الإرسال ❌');
        });
});

// تشغيل البوت
bot.launch();
console.log('Bot is running...');