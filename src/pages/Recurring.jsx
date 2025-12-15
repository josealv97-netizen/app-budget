import { useState } from 'react';
import { useData } from '../context/store';
import { Plus, Calendar, Trash2, Edit2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { CategorySelector } from '../components/CategorySelector';

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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="heading-lg">Transactions Récurrentes</h2>
                    <p className="text-slate-500 text-sm">Gérez vos abonnements et factures mensuelles.</p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                >
                    <Plus size={18} /> Nouveau
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                        <CategorySelector
                            categories={availableCategories}
                            selectedId={formData.category}
                            onSelect={(id) => setFormData({ ...formData, category: id })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Montant (€)</label>
                            <input
                                type="number"
                                required
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jour du mois</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                required
                                value={formData.dayOfMonth}
                                onChange={e => setFormData({ ...formData, dayOfMonth: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                                placeholder="1-31"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'expense' })}
                            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${formData.type === 'expense' ? 'bg-red-50 text-red-600 ring-2 ring-red-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            Dépense
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'income' })}
                            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${formData.type === 'income' ? 'bg-green-50 text-green-600 ring-2 ring-green-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            Revenu
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4"
                    >
                        {editingId ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                </form>
            </Modal>
        </div>
    )
}
