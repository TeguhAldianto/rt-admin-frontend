import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Payments() {
    const [occupants, setOccupants] = useState([]);
    const [loading, setLoading] = useState(false);

    // State untuk form Iuran Pemasukan
    const [paymentForm, setPaymentForm] = useState({
        occupant_id: '',
        payment_type: 'satpam',
        payment_period: 'bulan',
        start_month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });

    // State untuk form Pengeluaran
    const [expenseForm, setExpenseForm] = useState({
        description: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0]
    });

    // Perbaikan: Definisi fungsi langsung di dalam useEffect
    useEffect(() => {
        const fetchOccupants = async () => {
            try {
                const response = await api.get('/occupants');
                setOccupants(response.data.data);
            } catch (error) {
                console.error('Error fetching occupants:', error);
            }
        };

        fetchOccupants();
    }, []); // Array dependency kosong karena hanya dijalankan sekali saat mount

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/payments', paymentForm);
            alert('Pembayaran Iuran berhasil dicatat!');
            setPaymentForm({ ...paymentForm, occupant_id: '' });
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Gagal mencatat pembayaran.');
        } finally {
            setLoading(false);
        }
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/expenses', expenseForm);
            alert('Pengeluaran berhasil dicatat!');
            setExpenseForm({ ...expenseForm, description: '', amount: '' });
        } catch (error) {
            console.error('Error recording expense:', error);
            alert('Gagal mencatat pengeluaran.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <h1 className="text-3xl font-semibold text-emerald-400">Keuangan & Transaksi</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Panel Form Pemasukan (Iuran) */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-emerald-500/30">
                        <h2 className="text-xl font-bold mb-6 text-emerald-400">Catat Pemasukan (Iuran)</h2>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Pilih Penghuni</label>
                                <select
                                    required
                                    value={paymentForm.occupant_id}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, occupant_id: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                                >
                                    <option value="">-- Pilih Penghuni --</option>
                                    {occupants.map(o => <option key={o.id} value={o.id}>{o.full_name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1 text-gray-400">Jenis Iuran</label>
                                    <select
                                        value={paymentForm.payment_type}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, payment_type: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                                    >
                                        <option value="satpam">Satpam (Rp 100.000)</option>
                                        <option value="kebersihan">Kebersihan (Rp 15.000)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-400">Periode Bayar</label>
                                    <select
                                        value={paymentForm.payment_period}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, payment_period: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                                    >
                                        <option value="bulan">1 Bulan</option>
                                        <option value="tahun">Langsung 1 Tahun</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1 text-gray-400">Mulai Bulan Ke-</label>
                                    <input
                                        type="number" min="1" max="12" required
                                        value={paymentForm.start_month}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, start_month: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-400">Tahun</label>
                                    <input
                                        type="number" min="2000" required
                                        value={paymentForm.year}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, year: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors mt-2"
                            >
                                {loading ? 'Memproses...' : 'Simpan Pembayaran'}
                            </button>
                        </form>
                    </div>

                    {/* Panel Form Pengeluaran */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-rose-500/30">
                        <h2 className="text-xl font-bold mb-6 text-rose-400">Catat Pengeluaran RT</h2>
                        <form onSubmit={handleExpenseSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Keterangan Pengeluaran</label>
                                <input
                                    type="text" required placeholder="Contoh: Perbaikan Selokan, Gaji Satpam"
                                    value={expenseForm.description}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 focus:border-rose-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Nominal (Rp)</label>
                                <input
                                    type="number" min="1" required placeholder="50000"
                                    value={expenseForm.amount}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 focus:border-rose-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Tanggal Pengeluaran</label>
                                <input
                                    type="date" required
                                    value={expenseForm.expense_date}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 focus:border-rose-500 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-medium py-3 rounded-lg transition-colors mt-6"
                            >
                                {loading ? 'Memproses...' : 'Simpan Pengeluaran'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}