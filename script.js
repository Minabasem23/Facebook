/* withdraw-math.js */
/* Mathematical Withdraw Decoder + Balance Handler */

/*
 Rules:
 1) Take code (example: 53307515.9)
 2) Extract integer part * 10
 3) Mod 256 → convert to 8-bit binary
 4) Bits:
    - 1 => 2 W
    - 0 => 1 W
 5) Decimal part fixes the missing value
 6) Final amount is deducted from balance
*/

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

// ===== Example Usage =====
const exampleCode = 53307515.9;
const withdrawResult = withdrawByCode(exampleCode);

console.log("Withdraw Result:", withdrawResult);
console.log("Current Balance:", wallet.balance, "W");