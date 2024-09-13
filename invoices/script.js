// Access the jsPDF constructor
const { jsPDF } = window.jspdf;

document.getElementById('invoiceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const date = document.getElementById('date').value;
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const itemsInput = document.getElementById('items').value.trim();
    
    if (!itemsInput) {
        alert('Veuillez entrer au moins un article.');
        return;
    }
    
    const items = itemsInput.split('\n');
    
    let total = 0;
    let itemsHtml = '';
    
    items.forEach((item, index) => {
        const parts = item.split(',');
        if (parts.length !== 3) {
            alert(`Format incorrect à la ligne ${index + 1}. Veuillez utiliser le format: nom article, quantité, prix`);
            return;
        }
        const [name, quantity, price] = parts.map(part => part.trim());
        const quantityNumber = parseFloat(quantity);
        const priceNumber = parseFloat(price);
        
        if (isNaN(quantityNumber) || isNaN(priceNumber)) {
            alert(`Quantité ou prix invalide à la ligne ${index + 1}.`);
            return;
        }
        
        const itemTotal = quantityNumber * priceNumber;
        total += itemTotal;
        
        itemsHtml += `
            <tr>
                <td>${name}</td>
                <td>${quantityNumber}</td>
                <td>€${priceNumber.toFixed(2)}</td>
                <td>€${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });
    
    const invoiceHtml = `
        <h2>Facture</h2>
        <p><strong>Numéro de Facture:</strong> ${invoiceNumber}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Client:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        
        <table border="1" cellpadding="5" cellspacing="0" style="width: 100%;">
            <tr>
                <th>Article</th>
                <th>Quantité</th>
                <th>Prix</th>
                <th>Total</th>
            </tr>
            ${itemsHtml}
            <tr>
                <td colspan="3" align="right"><strong>Total:</strong></td>
                <td>€${total.toFixed(2)}</td>
            </tr>
        </table>
    `;
    
    document.getElementById('invoice').innerHTML = invoiceHtml;
    document.getElementById('downloadPdf').style.display = 'inline-block';
});

document.getElementById('downloadPdf').addEventListener('click', function() {
    const doc = new jsPDF();
    const invoice = document.getElementById('invoice');

    doc.html(invoice, {
        callback: function(doc) {
            doc.save('facture.pdf');
        },
        x: 15,
        y: 15,
        width: 170,
        windowWidth: 650
    });
});
