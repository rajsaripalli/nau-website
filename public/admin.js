// Fetch the user data from the server and populate the table
fetch('/admin-users')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#users-table tbody');
        data.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.firstname}</td>
                <td>${user.lastname}</td>
                <td>${user.email}</td>
                <td>${user.nauid}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(err => {
        console.error('Error fetching users:', err);
    });
