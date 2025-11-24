document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');
    const addItemBtn = document.getElementById('add-item-btn');
    const receiptItemsList = document.getElementById('r-items-list');
    const rItemCount = document.getElementById('r-item-count');
    const rSubtotal = document.getElementById('r-subtotal');
    const rTaxRate = document.getElementById('r-tax-rate');
    const rTaxAmount = document.getElementById('r-tax-amount');
    const rTotal = document.getElementById('r-total');
    const rPaymentTotal = document.getElementById('r-payment-total');
    const taxRateInput = document.getElementById('tax-rate');

    // Initial Items Data
    let items = [
        { name: 'PLANTAINS', price: 3.00, flag: 'N' },
        { name: 'LAUNDRYDET', price: 3.97, flag: 'X' },
        { name: '18PK HANGERS', price: 1.50, flag: 'T' },
        { name: 'HN 3PK ANKLE', price: 1.00, flag: 'T' }
    ];

    function renderInputs() {
        itemsContainer.innerHTML = '';
        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'form-group';
            div.style.border = '1px solid #ccc';
            div.style.padding = '5px';
            div.style.marginBottom = '5px';

            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.gap = '5px';

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.placeholder = 'Name';
            nameInput.value = item.name;
            nameInput.addEventListener('input', (e) => updateItem(index, 'name', e.target.value));

            const priceInput = document.createElement('input');
            priceInput.type = 'number';
            priceInput.step = '0.01';
            priceInput.placeholder = 'Price';
            priceInput.value = item.price;
            priceInput.style.width = '60px';
            priceInput.addEventListener('input', (e) => updateItem(index, 'price', e.target.value));

            const flagInput = document.createElement('input');
            flagInput.type = 'text';
            flagInput.placeholder = 'Flg';
            flagInput.value = item.flag;
            flagInput.style.width = '30px';
            flagInput.addEventListener('input', (e) => updateItem(index, 'flag', e.target.value));

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'X';
            removeBtn.onclick = () => removeItem(index);

            row.appendChild(nameInput);
            row.appendChild(priceInput);
            row.appendChild(flagInput);
            row.appendChild(removeBtn);
            div.appendChild(row);

            itemsContainer.appendChild(div);
        });
    }

    const updateItem = (index, field, value) => {
        if (field === 'price') {
            items[index][field] = parseFloat(value) || 0;
        } else {
            items[index][field] = value;
        }
        renderReceipt();
    };

    const removeItem = (index) => {
        items.splice(index, 1);
        renderInputs();
        renderReceipt();
    };

    addItemBtn.addEventListener('click', () => {
        items.push({ name: 'NEW ITEM', price: 0.00, flag: 'N' });
        renderInputs();
        renderReceipt();
    });

    taxRateInput.addEventListener('input', () => {
        renderReceipt();
    });

    // Listeners for store address updates
    ['store-address-1', 'store-address-2', 'store-address-3', 'store-address-4'].forEach((id, index) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                document.getElementById(`r-address-${index + 1}`).textContent = e.target.value;
            });
        }
    });

    // Listeners for Date, Time, and TC#
    const dateInput = document.getElementById('receipt-date');
    const timeInput = document.getElementById('receipt-time');
    const tcInput = document.getElementById('receipt-tc');

    if (dateInput) {
        dateInput.addEventListener('input', (e) => {
            document.getElementById('r-date').textContent = e.target.value;
            document.getElementById('r-bottom-date').textContent = e.target.value;
        });
    }

    if (timeInput) {
        timeInput.addEventListener('input', (e) => {
            document.getElementById('r-time').textContent = e.target.value;
            document.getElementById('r-bottom-time').textContent = e.target.value;
        });
    }

    if (tcInput) {
        tcInput.addEventListener('input', (e) => {
            document.getElementById('r-tc').textContent = e.target.value;
        });
    }

    function renderReceipt() {
        receiptItemsList.innerHTML = '';
        let subtotal = 0;
        let itemCount = 0;

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item-row';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            nameSpan.textContent = item.name;

            const priceSpan = document.createElement('span');
            priceSpan.className = 'item-price';
            priceSpan.textContent = item.price.toFixed(2);

            const flagSpan = document.createElement('span');
            flagSpan.className = 'item-flag';
            flagSpan.textContent = item.flag;

            div.appendChild(nameSpan);
            div.appendChild(priceSpan);
            div.appendChild(flagSpan);
            receiptItemsList.appendChild(div);

            subtotal += item.price;
            itemCount++;
        });

        rItemCount.textContent = itemCount;
        rSubtotal.textContent = subtotal.toFixed(2);

        const taxRate = parseFloat(taxRateInput.value) || 0;
        rTaxRate.textContent = taxRate.toFixed(3) + '%';

        // Simple Tax Calculation: Items flagged with 'X' or 'T' are taxable.
        let taxableAmount = items.reduce((sum, item) => {
            return (item.flag.includes('T') || item.flag.includes('X')) ? sum + item.price : sum;
        }, 0);

        let taxAmount = taxableAmount * (taxRate / 100);
        rTaxAmount.textContent = taxAmount.toFixed(2);

        let total = subtotal + taxAmount;
        rTotal.textContent = total.toFixed(2);
        rPaymentTotal.textContent = total.toFixed(2);
    }

    renderInputs();
    renderReceipt();
});
