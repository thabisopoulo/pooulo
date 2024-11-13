import React, { useState } from 'react';

const Inventory = ({ products, setProducts }) => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [editMode, setEditMode] = useState({ active: false, productId: null });

    const addProduct = async () => {
        if (!productName || !description || !category || price < 0 || quantity < 0) return;
        
        const newProduct = { name: productName, description, category, price, quantity };
        
        try {
            const response = await fetch('http://localhost:5116/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            const result = await response.json();
            if (result.id) {
                setProducts([...products, { ...newProduct, id: result.id }]);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
        
        clearFields();
    };

    const updateProduct = async () => {
        if (!productName || !description || !category || price < 0 || quantity < 0) return;

        const updatedProduct = { name: productName, description, category, price, quantity };

        try {
            const response = await fetch(`http://localhost:5116/api/products/${editMode.productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            const result = await response.json();
            if (result.message === 'Product quantity updated') {
                setProducts(products.map(product =>
                    product.id === editMode.productId
                        ? { ...product, ...updatedProduct }
                        : product
                ));
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }

        clearFields();
    };

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:5116/api/products/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.message === 'Product deleted') {
                setProducts(products.filter(product => product.id !== id));
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const editProduct = (product) => {
        setProductName(product.name);
        setDescription(product.description);
        setCategory(product.category);
        setPrice(product.price);
        setQuantity(product.quantity);
        setEditMode({ active: true, productId: product.id });
    };

    const clearFields = () => {
        setProductName('');
        setDescription('');
        setCategory('');
        setPrice(0);
        setQuantity(0);
        setEditMode({ active: false, productId: null });
    };

    return (
        <div>
            <h1>Product Management</h1>
            <div>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button onClick={editMode.active ? updateProduct : addProduct}>
                    {editMode.active ? 'Update Product' : 'Add Product'}
                </button>
                {editMode.active && <button onClick={clearFields}>Cancel</button>}
            </div>

            <table border="1">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td>{`M${product.price.toFixed(2)}`}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <button onClick={() => editProduct(product)}>Edit</button>
                                <button onClick={() => deleteProduct(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inventory;
