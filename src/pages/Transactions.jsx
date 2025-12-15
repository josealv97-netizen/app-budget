import { useState } from 'react';
import { useData } from '../context/store';
import { Search } from 'lucide-react';
import { TransactionTable } from '../components/TransactionTable';

export const Transactions = ({ onEdit }) => {
    const { data, removeTransaction } = useData();
    const [search, setSearch] = useState('');
    const [monthFilter, setMonthFilter] = useState('');

    const filtered = data.transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase());

        const matchesMonth = monthFilter
            ? t.date.startsWith(monthFilter)
            : true;

        return matchesSearch && matchesMonth;
    }).map(t => ({ ...t, status: new Date(t.date) > new Date() ? "En attente" : "Validé" }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div>
                    <h2 className="heading-lg mb-1">Historique</h2>
                    <p className="text-slate-500">Liste complète des transactions.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                        type="month"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="p-2 border border-slate-200 rounded-lg text-sm"
                    />
                    <div className="relative w-full md:w-auto flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            className="pl-10 w-full md:w-64 border border-slate-200 p-2 rounded-lg"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)] overflow-hidden">
                <TransactionTable
                    transactions={filtered}
                    onEdit={onEdit}
                    onDelete={removeTransaction}
                />
            </div>
        </div>
    )
}
