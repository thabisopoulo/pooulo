document.getElementById('add-product-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;

    const product = {
        name: name,
        description: description,
        category: category,
        price: price,
        quantity: quantity
    };

    try {
        const response = await fetch('http://localhost:5111/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Product added successfully');
            // Optionally, reset form or redirect to another page
        } else {
            alert('Error adding product: ' + result.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
