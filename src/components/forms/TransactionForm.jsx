import { useState, useEffect } from 'react';
import { useData } from '../../context/store';
import { format } from 'date-fns';
import { CategorySelector } from '../CategorySelector';

export const TransactionForm = ({ onClose, initialData = null }) => {
    const { addTransaction, updateTransaction, data } = useData();

    // Default today's date
    const today = format(new Date(), 'yyyy-MM-dd HH:mm');

    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: '',
        type: 'expense',
        date: today
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                amount: initialData.amount,
                description: initialData.description,
                category: initialData.category,
                type: initialData.type,
                date: initialData.date
            });
        }
    }, [initialData]);

    const filteredCategories = data.categories.filter(c => c.type === formData.type);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.description) return;

        if (initialData && initialData.id) {
            updateTransaction(initialData.id, formData);
        } else {
            addTransaction(formData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">

            {/* Type Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${formData.type === 'expense' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Dépense
                </button>
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${formData.type === 'income' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Revenu
                </button>
            </div>

            <div className="space-y-4">
                {/* Amount */}
                <div>
                    <label>Montant</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">€</span>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            className="pl-9 text-lg font-semibold"
                            autoFocus={!initialData} // Only autofocus if new
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label>Description</label>
                    <input
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder={formData.type === 'expense' ? 'Ex: Supermarché' : 'Ex: Salaire'}
                    />
                </div>

                {/* Date */}
                <div>
                    <label>Date</label>
                    <input
                        type="datetime-local"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Catégorie</label>
                    <CategorySelector
                        categories={filteredCategories}
                        selectedId={formData.category} // Using name as ID
                        onSelect={(id) => setFormData({ ...formData, category: id })}
                    />
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4"
                >
                    {(initialData && initialData.id) ? 'Mettre à jour' : 'Ajouter la transaction'}
                </button>
            </div>
        </form>
    )
}
