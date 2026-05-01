import { useState } from 'react';
import { createExpense } from '../services/api';

const Expenses = () => {
  const [formData, setFormData] = useState({ description: '', amount: '', expense_date: new Date().toISOString().split('T')[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExpense(formData);
      alert('Berhasil simpan pengeluaran!');
      setFormData({ ...formData, description: '', amount: '' });
    } catch (error) {
      console.error(error);
      alert('Gagal simpan data.');
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1>Pengeluaran RT</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <input placeholder="Deskripsi Pengeluaran" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={inputStyle} required />
        <input type="number" placeholder="Nominal (Rp)" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} style={inputStyle} required />
        <input type="date" value={formData.expense_date} onChange={(e) => setFormData({...formData, expense_date: e.target.value})} style={inputStyle} />
        <button type="submit" style={{ padding: '1rem', backgroundColor: '#ff6b6b', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Catat Pengeluaran</button>
      </form>
    </div>
  );
};

const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff' };

export default Expenses;