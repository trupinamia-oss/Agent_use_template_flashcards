const accounts = [
    { name: "Bargeld", balance: 150 },
    { name: "Girokonto", balance: 2300 },
    { name: "Gold", balance: 1800 },
    { name: "ETFs", balance: 4500 },
    { name: "Kredit", balance: -3000 }
];

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

renderAccounts();