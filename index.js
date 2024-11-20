import bigInt from "./biginteger.js";

const text = document.querySelector(".text");

const keyPublic = document.querySelector(".keyPublic");
const keyPrivate = document.querySelector(".keyPrivate");

const encryptBtn = document.querySelector(".encrypt-button");
const decryptBtn = document.querySelector(".decrypt-button");
const clearBtn = document.querySelector(".clear-button");
const resultText = document.querySelector(".result-text");

encryptBtn.addEventListener("click", getEncryptedText);
decryptBtn.addEventListener("click", getDecryptedText);
clearBtn.addEventListener("click", clear);

function gcd(e, phiN) {
    while (!phiN.isZero()) {
        let temp = phiN;
        phiN = e.mod(phiN);
        e = temp;
    }

    return e;
}

function modInverse(e, phiN) {
    let phiN0 = phiN;
    let x0 = bigInt.zero;
    let x1 = bigInt.one;

    if (phiN.equals(bigInt.one)) {
        return bigInt.zero;
    }

    while (e.compare(bigInt.one) > 0) {
        let q = e.divide(phiN);
        let temp = phiN;
        phiN = e.mod(phiN);
        e = temp;
        temp = x0;
        x0 = x1.subtract(q.multiply(x0));
        x1 = temp;
    }

    if (x1.compare(bigInt.zero) < 0) {
        x1 = x1.add(phiN0);
    }

    return x1;
}

function generatePrime() {
    let prime;

    do {
        prime = bigInt.randBetween(bigInt(2).pow(32 - 1), bigInt(2).pow(32).minus(bigInt(1)));
    } while (!prime.isProbablePrime(20));

    return prime;
}

function encrypt(inputText, e, n) {
    let encrypted = [];

    for (let i = 0; i < inputText.length; i++) {
        let charCode = bigInt(inputText.charCodeAt(i));
        let encryptedChar = charCode.modPow(e, n);
        encrypted.push(encryptedChar);
    }

    return encrypted;
}

function decrypt(resultEnc, d, n) {
    let decrypted = '';

    for (let i = 0; i < resultEnc.length; i++) {
        let decryptedChar = resultEnc[i].modPow(d, n);
        decrypted += String.fromCharCode(decryptedChar.toJSNumber());
    }

    return decrypted;
}

let p = generatePrime();
let q = generatePrime();

let n = p.multiply(q);
let phiN = p.subtract(bigInt(1)).multiply(q.subtract(bigInt(1)));

let e = bigInt(65537);
while (e.compare(phiN) < 0 && gcd(e, phiN).compare(bigInt(1)) !== 0) {
    e = bigInt.randBetween(bigInt(2), phiN.minus(bigInt(1)));
}

let d = modInverse(e, phiN);

let resultEnc;
let resultDec;

function getEncryptedText(){
    resultText.innerHTML = "";

    let inputText = text.value;
    resultEnc = encrypt(inputText, e, n);

    keyPublic.innerHTML = e.toString() + n.toString();

    clearBtn.style.display = "block";
    resultText.style.opacity = "1";
    resultText.innerHTML = resultText.innerHTML + resultEnc.join('');
}

function getDecryptedText() {
    resultText.innerHTML = "";

    resultDec = decrypt(resultEnc, d, n);

    keyPrivate.innerHTML = d.toString() + n.toString();

    clearBtn.style.display = "block";
    resultText.style.opacity = "1";
    resultText.innerHTML = resultText.innerHTML + resultDec;
}

function clear() {
    resultText.innerHTML = "";
    keyPrivate.innerHTML = "";
    keyPublic.innerHTML = "";
    resultText.style.opacity = "0";
    clearBtn.style.display = "none";
}