// ================= PASSWORD GUARD =================

// Get HTML elements
const passwordInput = document.getElementById("passwordInput");

const scoreValue = document.getElementById("scoreValue");
const scoreRing = document.getElementById("scoreRing");

const strengthText = document.getElementById("strengthText");
const strengthMessage = document.getElementById("strengthMessage");

const strengthProgress = document.getElementById("strengthProgress");

const lengthValue = document.getElementById("lengthValue");
const entropyValue = document.getElementById("entropyValue");
const requirementsValue = document.getElementById("requirementsValue");

// Requirement elements
const reqLength = document.getElementById("reqLength");
const reqUppercase = document.getElementById("reqUppercase");
const reqLowercase = document.getElementById("reqLowercase");
const reqNumber = document.getElementById("reqNumber");
const reqSymbol = document.getElementById("reqSymbol");


// ================= PASSWORD ANALYSIS =================

function analyzePassword(password) {

    const length = password.length;

    // Security requirements
    const hasLength = length >= 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    // Count passed requirements
    const passedRequirements = [
        hasLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSymbol
    ].filter(Boolean).length;


    // ================= SCORE =================

    let score = 0;

    // Length points
    if (length >= 8) score += 10;
    if (length >= 12) score += 15;
    if (length >= 16) score += 10;
    if (length >= 20) score += 5;

    // Character variety
    if (hasUppercase) score += 15;
    if (hasLowercase) score += 15;
    if (hasNumber) score += 15;
    if (hasSymbol) score += 15;

    // Bonus for satisfying all requirements
    if (passedRequirements === 5) {
        score += 10;
    }

    // Maximum score = 100
    score = Math.min(score, 100);


    // ================= CHARACTER SET =================

    let characterSetSize = 0;

    if (hasLowercase) characterSetSize += 26;
    if (hasUppercase) characterSetSize += 26;
    if (hasNumber) characterSetSize += 10;
    if (hasSymbol) characterSetSize += 32;


    // ================= ENTROPY =================

    let entropy = 0;

    if (length > 0 && characterSetSize > 0) {
        entropy = Math.round(
            length * Math.log2(characterSetSize)
        );
    }


    // ================= STRENGTH =================

    let strength = "Very Weak";
    let message = "This password needs significant improvement.";

    if (score >= 80) {
        strength = "Strong";
        message = "Excellent password complexity.";
    } else if (score >= 60) {
        strength = "Good";
        message = "Good password, but there is room for improvement.";
    } else if (score >= 40) {
        strength = "Medium";
        message = "Try adding more length and character variety.";
    } else if (score >= 20) {
        strength = "Weak";
        message = "This password is relatively easy to guess.";
    }


    // ================= UPDATE UI =================

    scoreValue.textContent = score;

    lengthValue.textContent = length;

    entropyValue.textContent = entropy;

    requirementsValue.textContent =
        `${passedRequirements}/5`;

    strengthText.textContent = strength;

    strengthMessage.textContent = message;

    strengthProgress.style.width = `${score}%`;

    scoreRing.style.setProperty(
        "--score-angle",
        `${score * 3.6}deg`
    );


    // Requirements state
    reqLength.classList.toggle("active", hasLength);

    reqUppercase.classList.toggle("active", hasUppercase);

    reqLowercase.classList.toggle("active", hasLowercase);

    reqNumber.classList.toggle("active", hasNumber);

    reqSymbol.classList.toggle("active", hasSymbol);
}


// ================= INPUT EVENT =================

passwordInput.addEventListener("input", function () {

    analyzePassword(passwordInput.value);

});


// ================= INITIAL STATE =================

analyzePassword("");
// ================= SHOW / HIDE PASSWORD =================

const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁";

    }

});


// ================= CLEAR PASSWORD =================

const clearPassword = document.getElementById("clearPassword");

clearPassword.addEventListener("click", function () {

    passwordInput.value = "";

    analyzePassword("");

    passwordInput.focus();

});
// ================= SECURE PASSWORD GENERATOR =================

const generatedPassword = document.getElementById("generatedPassword");
const generatePassword = document.getElementById("generatePassword");
const copyGenerated = document.getElementById("copyGenerated");

const includeUppercase = document.getElementById("includeUppercase");
const includeLowercase = document.getElementById("includeLowercase");
const includeNumbers = document.getElementById("includeNumbers");
const includeSymbols = document.getElementById("includeSymbols");


const CHARACTERS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{}:,.?"
};


function secureRandomIndex(max) {

    const randomArray = new Uint32Array(1);

    crypto.getRandomValues(randomArray);

    return randomArray[0] % max;
}


function generateSecurePassword(length = 18) {

    let characterPool = "";

    const selectedSets = [];

    if (includeUppercase.checked) {
        characterPool += CHARACTERS.uppercase;
        selectedSets.push(CHARACTERS.uppercase);
    }

    if (includeLowercase.checked) {
        characterPool += CHARACTERS.lowercase;
        selectedSets.push(CHARACTERS.lowercase);
    }

    if (includeNumbers.checked) {
        characterPool += CHARACTERS.numbers;
        selectedSets.push(CHARACTERS.numbers);
    }

    if (includeSymbols.checked) {
        characterPool += CHARACTERS.symbols;
        selectedSets.push(CHARACTERS.symbols);
    }


    // At least one character type must be selected
    if (characterPool.length === 0) {
        generatedPassword.value = "";
        alert("Please select at least one character type.");
        return;
    }


    let password = "";


    // Guarantee at least one character from every selected category
    selectedSets.forEach(function (set) {

        const index = secureRandomIndex(set.length);

        password += set[index];

    });


    // Fill remaining characters
    while (password.length < length) {

        const index = secureRandomIndex(characterPool.length);

        password += characterPool[index];

    }


    // Shuffle password using secure randomness
    const passwordArray = password.split("");

    for (let i = passwordArray.length - 1; i > 0; i--) {

        const randomIndex = secureRandomIndex(i + 1);

        [passwordArray[i], passwordArray[randomIndex]] =
            [passwordArray[randomIndex], passwordArray[i]];

    }


    generatedPassword.value = passwordArray.join("");
}


// Generate password
generatePassword.addEventListener("click", function () {

    generateSecurePassword(18);

});


// Copy generated password
copyGenerated.addEventListener("click", async function () {

    if (!generatedPassword.value) {
        return;
    }

    try {

        await navigator.clipboard.writeText(
            generatedPassword.value
        );

        copyGenerated.textContent = "COPIED!";

        setTimeout(function () {
            copyGenerated.textContent = "COPY";
        }, 1500);

    } catch (error) {

        alert("Unable to copy password.");

    }

});