import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/products', formData);
            navigate('/');
        } catch (err) {
            alert('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', cursor: 'pointer', fontWeight: '600' }}>
                <ArrowLeft size={18} /> Back
            </button>
            <div className="card">
                <h3 style={{ marginBottom: '25px' }}>Add New Product</h3>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="iPhone 15 Pro" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="input-group">
                            <label>Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="999" />
                        </div>
                        <div className="input-group">
                            <label>Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required placeholder="50" />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Electronics" />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Detailed product description..." rows="4"></textarea>
                    </div>
                    <div className="input-group">
                        <label>Image URL</label>
                        <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://image-link.com" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Save size={18} /> {loading ? 'Saving...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
