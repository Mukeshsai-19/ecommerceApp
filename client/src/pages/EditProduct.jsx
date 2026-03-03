import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products`);
                // Simple client side filter for demo, better API would be /products/:id
                const p = res.data.find(item => item._id === id);
                if (p) {
                    setFormData({
                        name: p.name,
                        price: p.price,
                        description: p.description,
                        stock: p.stock,
                        category: p.category,
                        image: p.image || ''
                    });
                }
            } catch (err) {
                console.error('Fetch error');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await axios.put(`http://localhost:5000/api/products/${id}`, formData);
            navigate('/');
        } catch (err) {
            alert('Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <p>Loading product...</p>;

    return (
        <div>
            <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', cursor: 'pointer', fontWeight: '600' }}>
                <ArrowLeft size={18} /> Back
            </button>
            <div className="card">
                <h3 style={{ marginBottom: '25px' }}>Edit Product</h3>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="input-group">
                            <label>Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="4"></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={updating}>
                        <RefreshCw size={18} /> {updating ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
