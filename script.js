/* withdraw-math.js */
/* Mathematical Withdraw Decoder + Balance Handler */

// ===== Wallet Data =====
let wallet = JSON.parse(localStorage.getItem("wallet")) || {
    balance: 100 // initial balance
};

// ===== Decode Function =====
function decodeWithdrawAmount(code) {
    const multiplied = Math.floor(code * 10);
    const decimalPart = code % 1;

    const x = multiplied % 256;
    const bits = x.toString(2).padStart(8, '0');

    let baseAmount = 0;
    for (let bit of bits) {
        baseAmount += (bit === '1') ? 2 : 1;
    }

    const extra = Math.round(decimalPart * 9);
    const finalAmount = baseAmount + extra;

    return {
        code,
        bits,
        baseAmount,
        extra,
        finalAmount
    };
}

// ===== Withdraw Logic =====
function withdrawByCode(code) {
    const result = decodeWithdrawAmount(code);

    if (wallet.balance < result.finalAmount) {
        return {
            success: false,
            message: "Insufficient balance",
            balance: wallet.balance
        };
    }

    wallet.balance -= result.finalAmount;
    localStorage.setItem("wallet", JSON.stringify(wallet));

    return {
        success: true,
        code: result.code,
        bits: result.bits,
        withdrawn: result.finalAmount,
        remainingBalance: wallet.balance
    };
}