document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#transactions-table tbody');
    const filterName = document.querySelector('#filter-name');
    const filterAmount = document.querySelector('#filter-amount');
    const ctx = document.querySelector('#transactions-graph').getContext('2d');
    let transactions = [];
    let customers = [];
    let chart;

    // Fetch data from the static JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            customers = data.customers;
            transactions = data.transactions;

            renderTable(transactions);
            renderChart(transactions, '');

            filterName.addEventListener('input', () => {
                const name = filterName.value.toLowerCase();
                filterAndRender(name, filterAmount.value);
            });

            filterAmount.addEventListener('input', () => {
                filterAndRender(filterName.value.toLowerCase(), filterAmount.value);
            });
        });

    function filterAndRender(name, amount) {
        const nameFilteredTransactions = transactions.filter(t => {
            const customer = customers.find(c => c.id === t.customer_id);
            return customer && customer.name.toLowerCase().includes(name);
        });

        const amountFilteredTransactions = nameFilteredTransactions.filter(t => {
            const parsedAmount = parseFloat(amount);
            return isNaN(parsedAmount) || t.amount === parsedAmount;
        });

        renderTable(amountFilteredTransactions);
        renderChart(amountFilteredTransactions, name);
    }

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
        if (chart) {
            chart.destroy();
        }

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

        chart = new Chart(ctx, {
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
