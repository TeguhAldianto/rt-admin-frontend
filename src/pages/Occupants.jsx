import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Occupants() {
    const [occupants, setOccupants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Tambahkan state trigger
    const [formData, setFormData] = useState({
        full_name: '',
        id_card_photo: null,
        occupant_status: 'tetap',
        phone_number: '',
        marital_status: 'belum_menikah',
    });

    // Fetching logic dimasukkan langsung ke dalam useEffect
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
    }, [refreshTrigger]); // Effect akan berjalan ulang jika refreshTrigger berubah

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'id_card_photo') {
            setFormData({ ...formData, id_card_photo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('full_name', formData.full_name);
        data.append('occupant_status', formData.occupant_status);
        data.append('phone_number', formData.phone_number);
        data.append('marital_status', formData.marital_status);

        if (formData.id_card_photo) {
            data.append('id_card_photo', formData.id_card_photo);
        }

        try {
            await api.post('/occupants', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setFormData({
                full_name: '',
                id_card_photo: null,
                occupant_status: 'tetap',
                phone_number: '',
                marital_status: 'belum_menikah',
            });

            // Update trigger untuk memancing useEffect berjalan ulang (refresh data)
            setRefreshTrigger(prev => prev + 1);
            alert('Penghuni berhasil ditambahkan!');
        } catch (error) {
            console.error('Error saving occupant:', error);
            alert('Gagal menyimpan data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <h1 className="text-3xl font-semibold text-purple-300">Manajemen Penghuni</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-fit">
                        <h2 className="text-xl font-medium mb-6 text-purple-400">Tambah Penghuni Baru</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Nama Lengkap</label>
                                <input
                                    type="text" name="full_name" required
                                    value={formData.full_name} onChange={handleInputChange}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Nomor Telepon</label>
                                <input
                                    type="text" name="phone_number" required
                                    value={formData.phone_number} onChange={handleInputChange}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1 text-gray-400">Status Penghuni</label>
                                    <select
                                        name="occupant_status"
                                        value={formData.occupant_status} onChange={handleInputChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
                                    >
                                        <option value="tetap">Tetap</option>
                                        <option value="kontrak">Kontrak</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-gray-400">Pernikahan</label>
                                    <select
                                        name="marital_status"
                                        value={formData.marital_status} onChange={handleInputChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
                                    >
                                        <option value="belum_menikah">Belum</option>
                                        <option value="menikah">Menikah</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Foto KTP</label>
                                <input
                                    type="file" name="id_card_photo" accept="image/*"
                                    onChange={handleInputChange}
                                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-900 file:text-purple-300 hover:file:bg-purple-800 transition-colors cursor-pointer"
                                />
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2.5 rounded-lg transition-colors mt-4 disabled:opacity-50"
                            >
                                {loading ? 'Menyimpan...' : 'Simpan Penghuni'}
                            </button>
                        </form>
                    </div>

                    <div className="col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 overflow-x-auto">
                        <h2 className="text-xl font-medium mb-6 text-purple-400">Daftar Penghuni</h2>
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="text-xs uppercase bg-gray-900 text-gray-300 border-b border-gray-700">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Nama</th>
                                    <th className="px-4 py-3">Telepon</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Pernikahan</th>
                                    <th className="px-4 py-3 rounded-tr-lg">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {occupants.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                            Belum ada data penghuni.
                                        </td>
                                    </tr>
                                ) : (
                                    occupants.map((occupant) => (
                                        <tr key={occupant.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-200">{occupant.full_name}</td>
                                            <td className="px-4 py-3">{occupant.phone_number}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${occupant.occupant_status === 'tetap' ? 'bg-indigo-900 text-indigo-300' : 'bg-orange-900 text-orange-300'
                                                    }`}>
                                                    {occupant.occupant_status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 capitalize">{occupant.marital_status.replace('_', ' ')}</td>
                                            <td className="px-4 py-3">
                                                <button className="text-purple-400 hover:text-purple-300 text-xs font-medium">Edit</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}