import { useState, useEffect } from 'react';
import { getHouses } from '../services/api';

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await getHouses();
        setHouses(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil data rumah:", err);
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Memuat data rumah...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Data Rumah</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        {houses.map((house) => (
          <div key={house.id} style={{
            backgroundColor: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            textAlign: 'center',
            transition: 'transform 0.2s'
          }}>
            <div style={{ 
              fontSize: '0.8rem', 
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem'
            }}>Kavling</div>
            <h2 style={{ color: 'var(--accent-lavender)', marginBottom: '1rem' }}>{house.house_number}</h2>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              backgroundColor: house.status === 'dihuni' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              color: house.status === 'dihuni' ? '#4ade80' : 'var(--text-secondary)',
              border: `1px solid ${house.status === 'dihuni' ? '#4ade80' : 'var(--border-color)'}`
            }}>
              {house.status === 'dihuni' ? '● DIHUNI' : '○ KOSONG'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Houses;