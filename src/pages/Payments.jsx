import { useState, useEffect } from 'react';
import { getOccupants, createPayment } from '../services/api';

const Payments = () => {
  const [occupants, setOccupants] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    occupant_id: '',
    type: 'iuran_kebersihan',
    amount: 15000,
    payment_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    getOccupants().then(res => setOccupants(res.data.data));
  }, []);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const amount = type === 'iuran_satpam' ? 100000 : 15000;
    setFormData({ ...formData, type, amount });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayment(formData);
      setMessage('✅ Pembayaran berhasil dicatat!');
      setFormData({ ...formData, occupant_id: '' });
    } catch (error) {
      console.error(error);
      setMessage('❌ Gagal mencatat pembayaran.');
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1>Catat Iuran Warga</h1>
      <div style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', marginTop: '1.5rem' }}>
        {message && <p style={{ marginBottom: '1rem' }}>{message}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <select required value={formData.occupant_id} onChange={(e) => setFormData({...formData, occupant_id: e.target.value})} style={inputStyle}>
            <option value="">-- Pilih Warga --</option>
            {occupants.map(occ => <option key={occ.id} value={occ.id}>{occ.full_name}</option>)}
          </select>
          <select value={formData.type} onChange={handleTypeChange} style={inputStyle}>
            <option value="iuran_kebersihan">Kebersihan (15k)</option>
            <option value="iuran_satpam">Satpam (100k)</option>
          </select>
          <input type="date" value={formData.payment_date} onChange={(e) => setFormData({...formData, payment_date: e.target.value})} style={inputStyle} />
          <button type="submit" style={{ padding: '1rem', backgroundColor: '#b19cd9', color: '#121212', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Simpan Transaksi</button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#121212', color: '#fff' };

export default Payments;