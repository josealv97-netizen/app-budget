import { useState } from 'react';
import { useData } from '../context/store';
import { Search } from 'lucide-react';
import { TransactionTable } from '../components/TransactionTable';

export const Transactions = ({ onEdit }) => {
    const { data, removeTransaction } = useData();
    const [search, setSearch] = useState('');

    const filtered = data.transactions.filter(t =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div>
                    <h2 className="heading-lg mb-1">Movimientos</h2>
                    <p className="text-slate-500">Historial completo de tus gastos e ingresos.</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        className="pl-10 w-full md:w-64"
                        placeholder="Buscar movimiento..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
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
