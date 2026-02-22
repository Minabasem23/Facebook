// -----------------------------
// Wallet System + Ads + Encrypt
// -----------------------------
let balance = 0.0;
const earnPerAd = 0.0002;
const balanceEl = document.getElementById('balance');
const withdrawDataEl = document.getElementById('withdrawData');
const watchAdBtn = document.getElementById('watchAdBtn');
const withdrawBtn = document.getElementById('withdrawBtn');

// ---------- Encryptor ----------
function to10Bit(char, salt) {
    let code = char.charCodeAt(0);
    code = code + salt % 4;
    let binary = code.toString(2).padStart(10, '0');
    let first5 = binary.slice(0,5);
    let last5 = binary.slice(5);
    return last5 + first5;
}

function from10Bit(bits, salt) {
    let last5 = bits.slice(0,5);
    let first5 = bits.slice(5);
    let original = first5 + last5;
    return String.fromCharCode(parseInt(original,2) - salt%4);
}

function generateSalt() { return Math.floor(Math.random()*1000); }

function encryptText(text) {
    let salt = generateSalt();
    let result = [];
    for(let char of text) result.push(to10Bit(char,salt));
    return salt.toString().padStart(4,'0') + ':' + result.join(' ');
}

function decryptText(bitsText) {
    let [saltStr,bitsPart] = bitsText.split(':');
    let salt = parseInt(saltStr);
    let bitsArray = bitsPart.trim().split(' ');
    let result = '';
    for(let bits of bitsArray) result += from10Bit(bits,salt);
    return result;
}

// ---------- Ads ----------
watchAdBtn.addEventListener('click', () => {
    if(typeof show_10638478 === 'function'){
        // استدعاء SDK الرسمي
        show_10638478().then(() => {
            balance += earnPerAd;
            balanceEl.innerText = balance.toFixed(4);
            alert(`You earned ${earnPerAd} USDT!`);
        }).catch(() => {
            alert("Ad failed or skipped.");
        });
    } else {
        // fallback محاكاة الإعلان إذا SDK لم يحمل
        watchAdBtn.disabled = true;
        watchAdBtn.innerText = "Watching Ad...";
        setTimeout(() => {
            balance += earnPerAd;
            balanceEl.innerText = balance.toFixed(4);
            watchAdBtn.disabled = false;
            watchAdBtn.innerText = `Watch Ad (Earn ${earnPerAd} USDT)`;
            alert(`You earned ${earnPerAd} USDT!`);
        }, 3000);
    }
});

// ---------- Withdraw ----------
withdrawBtn.addEventListener('click', () => {
    if(balance <= 0){
        alert("Your balance is 0!");
        return;
    }
    let walletAddress = prompt("Enter your wallet address:");
    if(!walletAddress) return;

    let textToEncrypt = `${walletAddress}:${balance.toFixed(4)}`;
    let encrypted = encryptText(textToEncrypt);
    withdrawDataEl.value = encrypted;

    balance = 0;
    balanceEl.innerText = balance.toFixed(4);
});