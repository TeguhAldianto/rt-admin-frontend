import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState({ total_pemasukan: 0, total_pengeluaran: 0, saldo_sisa: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getDashboardSummary();
        setSummary(response.data.data);
      } catch (error) {
        console.error("Gagal load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

  if (loading) return <p>Memuat data...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard Keuangan</h1>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <p style={{ color: '#a0a0a0' }}>Total Pemasukan</p>
          <h2 style={{ color: '#b19cd9' }}>{formatRupiah(summary.total_pemasukan)}</h2>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#a0a0a0' }}>Total Pengeluaran</p>
          <h2 style={{ color: '#ff6b6b' }}>{formatRupiah(summary.total_pengeluaran)}</h2>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#a0a0a0' }}>Saldo Kas RT</p>
          <h2 style={{ color: '#4ade80' }}>{formatRupiah(summary.saldo_sisa)}</h2>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#1e1e1e',
  padding: '1.5rem',
  borderRadius: '12px',
  flex: '1 1 250px',
  border: '1px solid #333'
};

export default Dashboard;