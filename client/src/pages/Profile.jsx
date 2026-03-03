import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Save } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({ name, bio, avatar, password: password || undefined });
            setMsg('Profile updated successfully!');
            setPassword('');
        } catch (err) {
            setMsg('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingTop: '10px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                    {avatar ? <img src={avatar} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : <User size={50} />}
                </div>
                <h3>{user.name}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{user.email}</p>
            </div>

            <div className="card">
                <h4 style={{ marginBottom: '20px' }}>Account Settings</h4>
                {msg && <p className={`badge ${msg.includes('success') ? 'badge-success' : 'badge-error'}`} style={{ marginBottom: '15px', display: 'block' }}>{msg}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Public Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Bio / Store Description</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Describe your store..." rows="3"></textarea>
                    </div>
                    <div className="input-group">
                        <label>Avatar URL</label>
                        <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://my-photo-link.com" />
                    </div>
                    <div className="input-group">
                        <label>Update Password (leave blank to keep current)</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Save size={18} /> {loading ? 'Saving...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
