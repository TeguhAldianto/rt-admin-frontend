import { useState, useEffect, useCallback } from 'react';
import { getOccupants, createOccupant } from '../services/api';

const Occupants = () => {
  const [occupants, setOccupants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    nik: '',
    phone: '',
    is_permanent: true
  });

  // Membungkus fungsi fetch dengan useCallback untuk menjaga stabilitas referensi
  const fetchOccupants = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOccupants();
      setOccupants(response.data.data);
    } catch (error) {
      console.error("Gagal memuat data warga:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Menjalankan fetchOccupants saat komponen dimuat
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchOccupants();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchOccupants]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOccupant(formData);
      alert('Warga berhasil ditambahkan!');
      setFormData({ full_name: '', nik: '', phone: '', is_permanent: true });
      setShowForm(false);
      await fetchOccupants(); 
    } catch (error) {
      console.error("Gagal menambah warga:", error);
      alert('Gagal menambah warga. Pastikan NIK belum terdaftar dan server menyala.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Data Warga</h1>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
          {showForm ? 'Batal' : '+ Tambah Warga'}
        </button>
      </div>

      {showForm && (
        <div style={formCardStyle}>
          <form onSubmit={handleSubmit} style={gridStyle}>
            <input 
              placeholder="Nama Lengkap" 
              value={formData.full_name} 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
              style={inputStyle} 
              required 
            />
            <input 
              placeholder="NIK (16 Digit)" 
              value={formData.nik} 
              onChange={(e) => setFormData({...formData, nik: e.target.value})} 
              style={inputStyle} 
              required 
            />
            <input 
              placeholder="Nomor Telepon" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              style={inputStyle} 
              required 
            />
            <select 
              value={formData.is_permanent} 
              onChange={(e) => setFormData({...formData, is_permanent: e.target.value === 'true'})} 
              style={inputStyle}
            >
              <option value="true">Warga Tetap</option>
              <option value="false">Warga Kontrak</option>
            </select>
            <button type="submit" style={submitBtnStyle}>Simpan Warga</button>
          </form>
        </div>
      )}

      <div style={tableWrapStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', color: '#a0a0a0', textAlign: 'left' }}>
              <th style={thStyle}>Nama</th>
              <th style={thStyle}>NIK</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Telepon</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Memuat data...</td></tr>
            ) : occupants.length > 0 ? (
              occupants.map(person => (
                <tr key={person.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={tdStyle}>{person.full_name}</td>
                  <td style={tdStyle}>{person.nik}</td>
                  <td style={tdStyle}>{person.is_permanent ? 'Tetap' : 'Kontrak'}</td>
                  <td style={tdStyle}>{person.phone}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Belum ada data warga.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styling Object
const btnStyle = { padding: '0.8rem 1.5rem', backgroundColor: '#b19cd9', color: '#121212', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', border: 'none' };
const formCardStyle = { backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #333' };
const gridStyle = { display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' };
const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#121212', color: '#fff' };
const submitBtnStyle = { gridColumn: 'span 2', padding: '1rem', backgroundColor: '#4ade80', color: '#121212', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', border: 'none' };
const tableWrapStyle = { backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' };
const thStyle = { padding: '1rem' };
const tdStyle = { padding: '1rem' };

export default Occupants;