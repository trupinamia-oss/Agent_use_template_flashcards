const accounts = [
    { name: "Bargeld", balance: 150 },
    { name: "Girokonto", balance: 2300 },
    { name: "Gold", balance: 1800 },
    { name: "ETFs", balance: 4500 },
    { name: "Kredit", balance: -3000 }
];

const entryForm = document.getElementById("entry-form");
const entryDate = document.getElementById("entry-date");
const entryType = document.getElementById("entry-type");
const accountSelect = document.getElementById("account");
const targetAccountSelect = document.getElementById("target-account");
const targetAccountField = document.getElementById("target-account-field");

// Formatiert einen Betrag für die Anzeige in Euro.
function formatEuro(amount) {
    return amount.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR"
    });
}

// Zeigt die Konten aus der Startwertliste in der Tabelle.
function renderAccounts() {
    const accountsList = document.getElementById("accounts-list");

    for (const account of accounts) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const balanceCell = document.createElement("td");

        nameCell.textContent = account.name;
        balanceCell.textContent = formatEuro(account.balance);

        if (account.balance < 0) {
            balanceCell.className = "negative";
        }

        row.appendChild(nameCell);
        row.appendChild(balanceCell);
        accountsList.appendChild(row);
    }
}

// Füllt beide Konten-Auswahlfelder mit allen Konten.
function fillAccountSelects() {
    accountSelect.innerHTML = "";
    targetAccountSelect.innerHTML = "";

    for (const account of accounts) {
        const accountOption = document.createElement("option");
        accountOption.value = account.name;
        accountOption.textContent = account.name;
        accountSelect.appendChild(accountOption);

        const targetOption = document.createElement("option");
        targetOption.value = account.name;
        targetOption.textContent = account.name;
        targetAccountSelect.appendChild(targetOption);
    }
}

// Zeigt das Zielkonto nur für Umbuchungen an.
function updateTargetAccountField() {
    if (entryType.value === "transfer") {
        targetAccountField.className = "";
    } else {
        targetAccountField.className = "hidden";
    }
}

// Ändert einen Kontostand je nach gewählter Buchungsart.
function updateAccountBalance(type, accountName, amount) {
    for (const account of accounts) {
        if (account.name === accountName) {
            if (type === "balance") {
                account.balance = amount;
            }
            if (type === "income") {
                account.balance = account.balance + amount;
            }
            if (type === "expense") {
                account.balance = account.balance - amount;
            }
        }
    }
}

// Führt eine Umbuchung zwischen zwei Konten durch.
function transferAmount(sourceName, targetName, amount) {
    updateAccountBalance("expense", sourceName, amount);
    updateAccountBalance("income", targetName, amount);
}

// Verarbeitet das Formular und aktualisiert die Kontenübersicht.
function saveEntry(event) {
    event.preventDefault();

    const type = entryType.value;
    const accountName = accountSelect.value;
    const targetName = targetAccountSelect.value;
    const amount = Number(document.getElementById("amount").value);

    if (type === "transfer") {
        if (accountName === targetName) {
            alert("Quellkonto und Zielkonto müssen verschieden sein.");
            return;
        }
        transferAmount(accountName, targetName, amount);
    } else {
        updateAccountBalance(type, accountName, amount);
    }

    renderAccounts();
    entryForm.reset();
    entryDate.value = new Date().toISOString().split("T")[0];
    updateTargetAccountField();
}

entryDate.value = new Date().toISOString().split("T")[0];
entryType.addEventListener("change", updateTargetAccountField);
entryForm.addEventListener("submit", saveEntry);

fillAccountSelects();
renderAccounts();