const accounts = [
    { name: "Bargeld", balance: 150 },
    { name: "Girokonto", balance: 2300 },
    { name: "Sparbuch", balance: 0 },
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
const categorySelect = document.getElementById("category");
const categoryForm = document.getElementById("category-form");
const categoryInput = document.getElementById("new-category");
const categorySymbolSelect = document.getElementById("category-symbol");
const categoryList = document.getElementById("category-list");
const expenseCategoryList = document.getElementById("expense-category-list");
const categorySection = document.getElementById("category-section");
const showCategoriesButton = document.getElementById("show-categories-button");
const balanceSection = document.getElementById("balance-section");
const showBalancesButton = document.getElementById("show-balances-button");
const balanceForm = document.getElementById("balance-form");
const balanceAccountSelect = document.getElementById("balance-account");
const balanceAmountInput = document.getElementById("balance-amount");

const categories = [
    { name: "Gehalt", symbol: "💼" },
    { name: "Food", symbol: "🍔" },
    { name: "Clothes", symbol: "👕" },
    { name: "Sonstiges", symbol: "✨" }
];
const expenseEntries = [];

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
    accountsList.innerHTML = "";

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
    balanceAccountSelect.innerHTML = "";

    for (const account of accounts) {
        const accountOption = document.createElement("option");
        accountOption.value = account.name;
        accountOption.textContent = account.name;
        accountSelect.appendChild(accountOption);

        const targetOption = document.createElement("option");
        targetOption.value = account.name;
        targetOption.textContent = account.name;
        targetAccountSelect.appendChild(targetOption);

        const balanceOption = document.createElement("option");
        balanceOption.value = account.name;
        balanceOption.textContent = account.name;
        balanceAccountSelect.appendChild(balanceOption);
    }
}

// Zeigt alle auswählbaren Kategorien im Formular.
function renderCategories() {
    categorySelect.innerHTML = "";
    categoryList.innerHTML = "";

    for (const category of categories) {
        const categoryOption = document.createElement("option");
        categoryOption.value = category.name;
        categoryOption.textContent = category.symbol + " " + category.name;
        categorySelect.appendChild(categoryOption);

        const categoryItem = document.createElement("li");
        categoryItem.textContent = category.symbol + " " + category.name;
        categoryList.appendChild(categoryItem);
    }
}

// Öffnet oder schließt die Kategorieverwaltung.
function toggleCategorySection() {
    if (categorySection.className === "category-section hidden") {
        categorySection.className = "category-section";
    } else {
        categorySection.className = "category-section hidden";
    }
}

// Öffnet oder schließt die Verwaltung für Kontostände.
function toggleBalanceSection() {
    if (balanceSection.className === "category-section hidden") {
        balanceSection.className = "category-section";
    } else {
        balanceSection.className = "category-section hidden";
    }
}

// Fügt eine neue Kategorie hinzu, wenn sie noch nicht existiert.
function addCategory(event) {
    event.preventDefault();

    const newCategory = categoryInput.value.trim();
    if (newCategory === "") {
        return;
    }

    const categoryExists = categories.some(function (category) {
        return category.name === newCategory;
    });
    if (!categoryExists) {
        categories.push({
            name: newCategory,
            symbol: categorySymbolSelect.value
        });
        renderCategories();
    }

    categoryForm.reset();
}

// Zeigt die Summe aller Ausgaben für jede Kategorie.
function renderExpenseCategories() {
    expenseCategoryList.innerHTML = "";

    for (const category of categories) {
        let categoryTotal = 0;

        for (const expense of expenseEntries) {
            if (expense.category === category.name) {
                categoryTotal = categoryTotal + expense.amount;
            }
        }

        if (categoryTotal > 0) {
            const categoryItem = document.createElement("li");
            categoryItem.textContent =
                category.symbol + " " + category.name + ": " +
                formatEuro(categoryTotal);
            expenseCategoryList.appendChild(categoryItem);
        }
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

// Speichert einen neuen Kontostand für das gewählte Konto.
function saveBalance(event) {
    event.preventDefault();

    const accountName = balanceAccountSelect.value;
    const amount = Number(balanceAmountInput.value);
    updateAccountBalance("balance", accountName, amount);
    renderAccounts();
    balanceForm.reset();
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
        if (type === "expense") {
            expenseEntries.push({
                category: categorySelect.value,
                amount: amount
            });
        }
    }

    renderAccounts();
    renderExpenseCategories();
    entryForm.reset();
    entryDate.value = new Date().toISOString().split("T")[0];
    updateTargetAccountField();
}

entryDate.value = new Date().toISOString().split("T")[0];
entryType.addEventListener("change", updateTargetAccountField);
entryForm.addEventListener("submit", saveEntry);
categoryForm.addEventListener("submit", addCategory);
showCategoriesButton.addEventListener("click", toggleCategorySection);
showBalancesButton.addEventListener("click", toggleBalanceSection);
balanceForm.addEventListener("submit", saveBalance);

fillAccountSelects();
renderCategories();
renderAccounts();
renderExpenseCategories();