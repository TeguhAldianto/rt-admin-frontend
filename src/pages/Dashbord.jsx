import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';

// Registrasi komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const [reportData, setReportData] = useState(null);
    const currentYear = new Date().getFullYear();

    // Perbaikan: Definisi fungsi langsung di dalam useEffect
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await api.get(`/reports/summary?year=${currentYear}`);
                setReportData(response.data.data);
            } catch (error) {
                console.error('Error fetching report:', error);
            }
        };

        fetchReport();
    }, [currentYear]); // Effect dijalankan ulang jika currentYear berubah

    if (!reportData) return <div className="p-8 text-gray-400">Memuat Data Dashboard...</div>;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    // Konfigurasi Data untuk Chart.js
    const chartData = {
        labels: reportData.chart_data.map(d => d.month_name),
        datasets: [
            {
                label: 'Pemasukan (Iuran)',
                data: reportData.chart_data.map(d => d.income),
                backgroundColor: 'rgba(52, 211, 153, 0.8)', // Emerald
            },
            {
                label: 'Pengeluaran RT',
                data: reportData.chart_data.map(d => d.expense),
                backgroundColor: 'rgba(244, 63, 94, 0.8)', // Rose
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: '#e5e7eb' } },
            title: { display: true, text: `Grafik Keuangan Tahun ${reportData.year}`, color: '#e5e7eb' },
        },
        scales: {
            y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
            x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <h1 className="text-3xl font-semibold text-blue-400">Dashboard & Laporan</h1>
                </div>

                {/* Card Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Pemasukan</h3>
                        <p className="text-3xl font-bold text-emerald-400">{formatRupiah(reportData.summary.total_income)}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Pengeluaran</h3>
                        <p className="text-3xl font-bold text-rose-400">{formatRupiah(reportData.summary.total_expense)}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-blue-500/30 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Saldo Saat Ini</h3>
                        <p className="text-3xl font-bold text-blue-400">{formatRupiah(reportData.summary.current_balance)}</p>
                    </div>
                </div>

                {/* Grafik 1 Tahun */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <Bar options={chartOptions} data={chartData} />
                </div>

            </div>
        </div>
    );
}