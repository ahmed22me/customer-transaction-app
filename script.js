document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#transactions-table tbody');
    const filterName = document.querySelector('#filter-name');
    const filterAmount = document.querySelector('#filter-amount');
    const ctx = document.querySelector('#transactions-graph').getContext('2d');
    let transactions = [];
    let customers = [];

    // Fetch data from the local server
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            customers = data.customers;
            transactions = data.transactions;

            renderTable(transactions);
            renderChart(transactions, '');

            filterName.addEventListener('input', () => {
                const name = filterName.value.toLowerCase();
                const filteredTransactions = transactions.filter(t => {
                    const customer = customers.find(c => c.id === t.customer_id);
                    return customer && customer.name.toLowerCase().includes(name);
                });
                renderTable(filteredTransactions);
                renderChart(filteredTransactions, name);
            });

            filterAmount.addEventListener('input', () => {
                const amount = parseFloat(filterAmount.value);
                if (!isNaN(amount)) {
                    const filteredTransactions = transactions.filter(t => t.amount >= amount);
                    renderTable(filteredTransactions);
                } else {
                    renderTable(transactions);
                }
            });
        });

    function renderTable(transactions) {
        tableBody.innerHTML = '';
        transactions.forEach(transaction => {
            const customer = customers.find(c => c.id === transaction.customer_id);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer ? customer.name : 'Unknown'}</td>
                <td>${transaction.date}</td>
                <td>${transaction.amount}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function renderChart(transactions, customerName) {
        const filteredTransactions = customerName
            ? transactions.filter(t => {
                const customer = customers.find(c => c.id === t.customer_id);
                return customer && customer.name.toLowerCase().includes(customerName.toLowerCase());
            })
            : transactions;

        const dailyTotals = filteredTransactions.reduce((acc, transaction) => {
            acc[transaction.date] = (acc[transaction.date] || 0) + transaction.amount;
            return acc;
        }, {});

        const labels = Object.keys(dailyTotals);
        const data = Object.values(dailyTotals);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Total Transaction Amount',
                    data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
