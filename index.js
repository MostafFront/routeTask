fetch('http://localhost:3000/data')
      .then(response => response.json())
      .then(data => {
        // Populate the table
        populateTable(data);
        // Create the chart
        createChart(data);
      });

    function populateTable(data) {
      const tableBody = document.getElementById('table-body');
      data.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${data.name}</td>
          <td>${data.amount}</td>
          <td>${data.date}</td>
        `;
        tableBody.appendChild(row);
      });
    }

    function filterTable() {
      const tableRows = document.querySelectorAll('#customer-table tbody tr');
      const nameFilter = document.getElementById('filter-name').value.toLowerCase();
      const amountFilter = parseFloat(document.getElementById('filter-amount').value);

      tableRows.forEach(row => {
        const customerName = row.cells[0].textContent.toLowerCase();
        const transactionAmount = parseFloat(row.cells[1].textContent);

        if (
          (nameFilter === '' || customerName.includes(nameFilter)) &&
          (isNaN(amountFilter) || transactionAmount >= amountFilter)
        ) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }

    function createChart(data) {
      const ctx = document.getElementById('transaction-chart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [...new Set(data.map(t => t.date))],
          datasets: [
            {
              label: 'Total Transaction Amount',
              data: data.reduce((acc, t) => {
                if (!acc[t.date]) {
                  acc[t.date] = 0;
                }
                acc[t.date] += t.amount;
                return acc;
              }, {}),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
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