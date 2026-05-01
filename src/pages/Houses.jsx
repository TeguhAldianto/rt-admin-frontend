import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Houses() {
    const [houses, setHouses] = useState([]);
    const [occupants, setOccupants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Tambahkan state trigger

    const [assignForm, setAssignForm] = useState({
        occupant_id: '',
        start_date: ''
    });

    // Fetching logic dimasukkan langsung ke dalam useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [housesResponse, occupantsResponse] = await Promise.all([
                    api.get('/houses'),
                    api.get('/occupants')
                ]);
                setHouses(housesResponse.data.data);
                setOccupants(occupantsResponse.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refreshTrigger]); // Effect akan berjalan ulang jika refreshTrigger berubah

    const handleAssignChange = (e) => {
        setAssignForm({ ...assignForm, [e.target.name]: e.target.value });
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        if (!selectedHouse) return;

        setLoading(true);
        try {
            await api.post(`/houses/${selectedHouse.id}/assign`, assignForm);
            alert('Penghuni berhasil didaftarkan ke rumah ini!');

            setAssignForm({ occupant_id: '', start_date: '' });
            setSelectedHouse(null);

            // Update trigger untuk memancing useEffect berjalan ulang (refresh data)
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error assigning occupant:', error);
            alert('Gagal mendaftarkan penghuni.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <h1 className="text-3xl font-semibold text-indigo-400">Manajemen Rumah</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {houses.map((house) => {
                            const isActive = house.status === 'dihuni';
                            const currentOccupantHistory = house.house_histories?.find(h => h.is_active);

                            return (
                                <div
                                    key={house.id}
                                    className={`p-5 rounded-xl border transition-all cursor-pointer shadow-lg
                    ${selectedHouse?.id === house.id ? 'border-indigo-500 bg-gray-800' : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'}
                  `}
                                    onClick={() => setSelectedHouse(house)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-bold text-gray-100">{house.house_number}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${isActive ? 'bg-indigo-900/80 text-indigo-300 border border-indigo-700/50' : 'bg-green-900/80 text-green-300 border border-green-700/50'
                                            }`}>
                                            {isActive ? 'Dihuni' : 'Kosong'}
                                        </span>
                                    </div>

                                    {isActive && currentOccupantHistory ? (
                                        <div className="text-sm text-gray-400 mt-2">
                                            <p className="flex items-center gap-2 mb-1">
                                                <span className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center">👤</span>
                                                <span className="font-medium text-gray-300">{currentOccupantHistory.occupant.full_name}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">Sejak: {currentOccupantHistory.start_date}</p>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic mt-2">
                                            Rumah ini belum memiliki penghuni.
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="lg:col-span-1">
                        {selectedHouse ? (
                            <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-indigo-500/30 sticky top-8">
                                <h2 className="text-xl font-bold text-white mb-2">Detail {selectedHouse.house_number}</h2>
                                <div className="mb-6 pb-6 border-b border-gray-700">
                                    <p className="text-gray-400 text-sm">Status: <span className="font-semibold text-gray-200">{selectedHouse.status === 'dihuni' ? 'Sedang Dihuni' : 'Tersedia'}</span></p>
                                </div>

                                <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4">
                                    {selectedHouse.status === 'dihuni' ? 'Ganti Penghuni' : 'Isi Rumah Kosong'}
                                </h3>

                                <form onSubmit={handleAssignSubmit} className="space-y-4 mb-8">
                                    <div>
                                        <label className="block text-sm mb-1 text-gray-400">Pilih Data Penghuni</label>
                                        <select
                                            name="occupant_id" required
                                            value={assignForm.occupant_id} onChange={handleAssignChange}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="">-- Pilih Penghuni --</option>
                                            {occupants.map(occ => (
                                                <option key={occ.id} value={occ.id}>{occ.full_name} ({occ.occupant_status})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1 text-gray-400">Tanggal Mulai Menempati</label>
                                        <input
                                            type="date" name="start_date" required
                                            value={assignForm.start_date} onChange={handleAssignChange}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <button
                                        type="submit" disabled={loading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Memproses...' : 'Daftarkan ke Rumah Ini'}
                                    </button>
                                </form>

                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Riwayat Penghuni</h3>
                                {selectedHouse.house_histories?.length > 0 ? (
                                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedHouse.house_histories.map((history, idx) => (
                                            <div key={idx} className="bg-gray-900/80 p-3 rounded-lg border border-gray-700/50">
                                                <p className="font-medium text-sm text-gray-200">{history.occupant.full_name}</p>
                                                <p className="text-xs text-gray-500 mt-1 flex justify-between">
                                                    <span>Masuk: {history.start_date}</span>
                                                    {history.is_active ? (
                                                        <span className="text-indigo-400 font-medium">Aktif</span>
                                                    ) : (
                                                        <span className="text-red-400">Keluar: {history.end_date}</span>
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Belum ada riwayat penghuni.</p>
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700 border-dashed text-center h-full flex flex-col items-center justify-center">
                                <span className="text-4xl mb-4">🏠</span>
                                <h3 className="text-xl font-medium text-gray-400 mb-2">Belum Ada Rumah Dipilih</h3>
                                <p className="text-gray-500 text-sm">Klik salah satu kotak rumah di sebelah kiri untuk melihat detail, mendaftarkan penghuni, atau melihat riwayatnya.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}