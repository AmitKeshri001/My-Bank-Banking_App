
/* =================================
   BANK CLASS
================================= */

class Bank {

    constructor(name, accountNumber, accountType, balance, pin) {
        this.name = name;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.pin = pin;

        // Transaction history
        this.transactions = [];
    }

    // Getters
    getBalance() {
        return this.balance;
    }

    getName() {
        return this.name;
    }

    // PIN validation
    isCorrectPin(enteredPin) {
        return enteredPin === String(this.pin);
    }

    // Deposit money
    deposit(amount) {
        if (!Number.isFinite(amount) || amount <= 0) {
            return "Enter a valid amount.";
        }

        this.balance += amount;

        this.transactions.unshift({
            type: "Deposit",
            amount: amount,
            balance: this.balance
        });

        return "Money deposited successfully!";
    }

    // Withdraw money
    withdraw(amount) {
        if (!Number.isFinite(amount) || amount <= 0) {
            return "Enter a valid amount.";
        }

        if (amount > this.balance) {
            return "Insufficient balance!";
        }

        this.balance -= amount;

        this.transactions.unshift({
            type: "Withdraw",
            amount: amount,
            balance: this.balance
        });

        return "Money withdrawn successfully!";
    }

    // Account details
    showAccountDetails() {
        return `
            <strong>Name:</strong> ${this.name}<br>
            <strong>Account Number:</strong> ${this.accountNumber}<br>
            <strong>Account Type:</strong> ${this.accountType}<br>
            <strong>Balance:</strong> ${formatMoney(this.balance)}
        `;
    }
}


/* =================================
   CREATE BANK ACCOUNT
================================= */

const account = new Bank(
    "Amit Kumar",
    1690012401,
    "Saving Account",
    1000,
    2580
);


/* =================================
   GET HTML ELEMENTS
================================= */

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");

const pinDots = document.querySelectorAll("#pinDots span");
const loginMessage = document.getElementById("loginMessage");

const balanceElement = document.getElementById("balance");
const message = document.getElementById("message");

const actionPanel = document.getElementById("actionPanel");
const actionTitle = document.getElementById("actionTitle");
const amountInput = document.getElementById("amountInput");

const detailsPanel = document.getElementById("detailsPanel");
const transactionList = document.getElementById("transactionList");

let enteredPin = "";
let currentAction = "";


/* =================================
   PIN KEYPAD
================================= */

// Number buttons
document.querySelectorAll(".key").forEach(function(button) {

    button.addEventListener("click", function() {

        if (enteredPin.length < 4) {
            enteredPin += button.dataset.number;
        }

        updatePinDots();
        loginMessage.textContent = "";

        // Check PIN when 4 digits are entered
        if (enteredPin.length === 4) {
            checkLogin();
        }
    });

});


// Clear button
document.getElementById("clearBtn").addEventListener("click", function() {
    enteredPin = "";
    updatePinDots();
    loginMessage.textContent = "";
});


// Backspace button
document.getElementById("backBtn").addEventListener("click", function() {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDots();
    loginMessage.textContent = "";
});


// Fill PIN dots
function updatePinDots() {

    pinDots.forEach(function(dot, index) {
        dot.classList.toggle("filled", index < enteredPin.length);
    });

}


// Login validation
function checkLogin() {

    if (account.isCorrectPin(enteredPin)) {

        loginScreen.classList.add("hidden");
        dashboard.classList.remove("hidden");

        document.getElementById("welcome").textContent =
            "Welcome, " + account.getName() + "!";

        updateBalance();

    } else {

        loginMessage.textContent = "Wrong PIN! Try again.";
        enteredPin = "";
        updatePinDots();

    }

}


/* =================================
   BALANCE
================================= */

function formatMoney(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}


function updateBalance() {
    balanceElement.textContent = formatMoney(account.getBalance());
}


/* =================================
   DEPOSIT AND WITHDRAW
================================= */

// Deposit button
document.getElementById("depositBtn").addEventListener("click", function() {
    openAmountPanel("deposit");
});


// Withdraw button
document.getElementById("withdrawBtn").addEventListener("click", function() {
    openAmountPanel("withdraw");
});


// Show amount input panel
function openAmountPanel(action) {

    currentAction = action;

    if (action === "deposit") {
        actionTitle.textContent = "Deposit Amount";
    } else {
        actionTitle.textContent = "Withdraw Amount";
    }

    actionPanel.classList.remove("hidden");
    detailsPanel.classList.add("hidden");

    amountInput.value = "";
    message.textContent = "";
    amountInput.focus();
}


// Confirm deposit or withdrawal
document.getElementById("confirmBtn").addEventListener("click", function() {

    const amount = Number(amountInput.value);

    let result;

    if (currentAction === "deposit") {
        result = account.deposit(amount);
    } else {
        result = account.withdraw(amount);
    }

    message.textContent = result;

    // Update screen only if the transaction succeeded
    if (result.includes("successfully!")) {
        updateBalance();
        showTransactions();

        actionPanel.classList.add("hidden");
        amountInput.value = "";
    }

});


// Cancel button
document.getElementById("cancelBtn").addEventListener("click", function() {
    actionPanel.classList.add("hidden");
    amountInput.value = "";
    message.textContent = "";
});


/* =================================
   ACCOUNT DETAILS
================================= */

document.getElementById("detailsBtn").addEventListener("click", function() {

    actionPanel.classList.add("hidden");
    detailsPanel.classList.remove("hidden");

    detailsPanel.innerHTML = account.showAccountDetails();

    message.textContent = "";

});


/* =================================
   MINI STATEMENT
================================= */

document.getElementById("statementBtn").addEventListener("click", function() {

    actionPanel.classList.add("hidden");
    detailsPanel.classList.add("hidden");

    showTransactions();

    message.textContent = "Showing recent transactions.";

});


// Display transaction history
function showTransactions() {

    if (account.transactions.length === 0) {
        transactionList.innerHTML =
            '<p class="empty">No transactions yet.</p>';
        return;
    }

    transactionList.innerHTML = "";

    account.transactions.forEach(function(transaction) {

        const row = document.createElement("div");
        row.className = "transaction";

        const name = document.createElement("span");
        name.textContent = transaction.type;
        name.className =
            transaction.type === "Deposit" ? "credit" : "debit";

        const amount = document.createElement("span");
        const sign = transaction.type === "Deposit" ? "+" : "-";

        amount.textContent = sign + formatMoney(transaction.amount);
        amount.className = name.className;

        row.appendChild(name);
        row.appendChild(amount);

        transactionList.appendChild(row);

    });

}


/* =================================
   LOGOUT
================================= */

document.getElementById("logoutBtn").addEventListener("click", function() {

    dashboard.classList.add("hidden");
    loginScreen.classList.remove("hidden");

    enteredPin = "";
    updatePinDots();

    loginMessage.textContent = "";
    message.textContent = "";

    actionPanel.classList.add("hidden");
    detailsPanel.classList.add("hidden");

    amountInput.value = "";

});
