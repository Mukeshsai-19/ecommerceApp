import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products?sellerId=${user.id}`);
                setProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [user.id]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    return (
        <div style={{ paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>My Products ({products.length})</h3>
                <Link to="/add-product" className="btn btn-primary" style={{ width: 'auto', padding: '10px 18px' }}>
                    <Plus size={18} /> Add
                </Link>
            </div>

            {loading ? <p>Loading products...</p> : products.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '100px 30px' }}>
                    <Package size={50} style={{ color: 'var(--text-dim)', marginBottom: '15px' }} />
                    <p style={{ color: 'var(--text-dim)' }}>No products found. Start by adding your first item!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {products.map(product => (
                        <div key={product._id} className="card" style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '15px' }}>
                            <div style={{ width: '70px', height: '70px', background: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={product.image || 'https://via.placeholder.com/70'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{product.name}</h4>
                                <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>${product.price}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Stock: {product.stock}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => navigate(`/edit-product/${product._id}`)} style={{ background: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Edit2 size={18} /></button>
                                <button onClick={() => handleDelete(product._id)} style={{ background: 'none', color: 'var(--error)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
