let chemicals = [];
let addedChemicals = [];

async function loadData() {
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) throw new Error('Failed to load chemicals data');
        chemicals = await response.json();

        const addedResponse = await fetch('data/addedChemicals.json');
        if (!addedResponse.ok) throw new Error('Failed to load added chemicals data');
        addedChemicals = await addedResponse.json();

        displayChemicals();
    } catch (error) {
        showAlert(`Error: ${error.message}`);
    }
}

function displayChemicals() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    [...chemicals, ...addedChemicals].forEach(chemical => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox"></td>
            <td>${chemical.id}</td>
            <td contenteditable="true">${chemical.chemicalName}</td>
            <td contenteditable="true">${chemical.vendor}</td>
            <td contenteditable="true">${chemical.density}</td>
            <td contenteditable="true">${chemical.viscosity}</td>
            <td contenteditable="true">${chemical.packaging}</td>
            <td contenteditable="true">${chemical.packSize}</td>
            <td contenteditable="true">${chemical.unit}</td>
            <td contenteditable="true">${chemical.quantity}</td>
        `;
        
        const checkbox = row.querySelector('.row-checkbox');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                row.style.backgroundColor = 'blue';
                row.style.color = 'white';
            } else {
                row.style.backgroundColor = '';
                row.style.color = '';
            }
        });
        
        tableBody.appendChild(row);
    });
}

function showAlert(message) {
    const alertBox = document.querySelector('.alert');
    alertBox.querySelector('.msg').textContent = message;
    alertBox.classList.remove('hide');
    alertBox.classList.add('show');

    setTimeout(() => {
        alertBox.classList.remove('show');
        alertBox.classList.add('hide');
    }, 5000);
}

document.getElementById('addRow').addEventListener('click', () => {
    const newRow = {
        id: chemicals.length + addedChemicals.length + 1,
        chemicalName: '',
        vendor: '',
        density: '',
        viscosity: '',
        packaging: '',
        packSize: '',
        unit: '',
        quantity: ''
    };
    addedChemicals.push(newRow);
    displayChemicals();
    showAlert('Chemical row added successfully!');
});

document.getElementById('moveRowUp').addEventListener('click', () => {
    const selectedRow = document.querySelector('#tableBody tr input:checked');
    if (selectedRow) {
        const row = selectedRow.closest('tr');
        const previousRow = row.previousElementSibling;
        if (previousRow) {
            row.parentNode.insertBefore(row, previousRow);
            showAlert('Row moved up successfully!');
        } else {
            showAlert('This row is already at the top!');
        }
    } else {
        showAlert('Please select a row to move.');
    }
});

document.getElementById('moveRowDown').addEventListener('click', () => {
    const selectedRow = document.querySelector('#tableBody tr input:checked');
    if (selectedRow) {
        const row = selectedRow.closest('tr');
        const nextRow = row.nextElementSibling;
        if (nextRow) {
            row.parentNode.insertBefore(nextRow, row);
            showAlert('Row moved down successfully!');
        } else {
            showAlert('This row is already at the bottom!');
        }
    } else {
        showAlert('Please select a row to move.');
    }
});

document.getElementById('deleteRow').addEventListener('click', () => {
    const selectedRow = document.querySelector('#tableBody tr input:checked');
    if (selectedRow) {
        const row = selectedRow.closest('tr');
        const index = Array.from(row.parentNode.children).indexOf(row);
        if (index < chemicals.length) {
            chemicals.splice(index, 1);
        } else {
            addedChemicals.splice(index - chemicals.length, 1);
        }
        row.remove();
        showAlert('Row deleted successfully!');
    } else {
        showAlert('Please select a row to delete.');
    }
});

document.getElementById('refreshData').addEventListener('click', loadData);

document.getElementById('saveData').addEventListener('click', () => {
    const allData = [...chemicals, ...addedChemicals];
    const jsonData = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'updatedChemicals.json';
    link.click();
    showAlert('Data saved and downloaded successfully!');
});

window.onload = loadData;
