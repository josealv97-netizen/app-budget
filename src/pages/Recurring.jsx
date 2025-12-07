import { useState } from 'react';
import { useData } from '../context/store';
import { Plus, Calendar, Trash2, Edit2 } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Recurring = () => {
    const { data, addRecurring, removeRecurring, updateRecurring } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); // ID of item being edited
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        dayOfMonth: '1',
        type: 'expense'
    });

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingId(item.id);
            setFormData({
                description: item.description,
                amount: item.amount,
                dayOfMonth: item.dayOfMonth,
                type: item.type || 'expense',
                category: item.category || ''
            });
        } else {
            setEditingId(null);
            setFormData({ description: '', amount: '', dayOfMonth: '1', type: 'expense', category: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.description || !formData.amount || !formData.category) return;

        if (editingId) {
            updateRecurring(editingId, formData);
        } else {
            addRecurring(formData);
        }

        setIsModalOpen(false);
        setFormData({ description: '', amount: '', dayOfMonth: '1', type: 'expense', category: '' });
        setEditingId(null);
    };

    // Filter categories based on selected type
    const availableCategories = data.categories.filter(c => c.type === formData.type);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="heading-lg mb-1">Dépenses Récurrentes</h2>
                    <p className="text-slate-500">Paiements automatiques mensuels (Abonnements, Loyer, etc.)</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn bg-slate-900 hover:bg-black text-white">
                    <Plus size={20} className="mr-2" /> Nouveau
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.recurring.map(item => (
                    <div key={item.id} className="relative group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${item.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                <Calendar size={24} />
                            </div>
                            <div className="text-right">
                                <div className={`font-bold ${item.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}>
                                    {item.type === 'expense' && '-'}€{Number(item.amount).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold text-lg text-slate-900 mb-1">{item.description}</h3>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-slate-500">Débité le {item.dayOfMonth}</p>
                                {item.category && (
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                        {item.category}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mensuel</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleOpenModal(item)}
                                    className="text-slate-400 hover:text-blue-600 transition-colors p-2"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => removeRecurring(item.id)}
                                    className="text-slate-400 hover:text-red-600 transition-colors p-2 -mr-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New Card */}
                <button
                    onClick={() => handleOpenModal()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all group min-h-[200px]"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="font-medium">Ajouter un nouveau fixe</span>
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier le paiement" : "Nouveau paiement récurrent"}>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Type Selection */}
                    <div className="flex p-1 bg-slate-100 rounded-lg">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'expense' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setFormData({ ...formData, type: 'expense', category: '' })} // Reset category on type change
                        >
                            Dépense
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setFormData({ ...formData, type: 'income', category: '' })} // Reset category on type change
                        >
                            Revenu
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Ex: Netflix, Loyer..."
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white appearance-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {availableCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Montant</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                                <input
                                    type="number"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white font-bold text-slate-900"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jour du mois</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white appearance-none"
                                value={formData.dayOfMonth}
                                onChange={e => setFormData({ ...formData, dayOfMonth: e.target.value })}
                            >
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="btn w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-medium shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-0.5">
                            {editingId ? "Mettre à jour" : "Sauvegarder"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
