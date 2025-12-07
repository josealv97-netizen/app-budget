import { useState } from 'react';
import { useData } from '../context/store';
import { Search, TrendingUp, TrendingDown, Filter, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Wallet, Calendar, Plus, Pizza, Car, PartyPopper, Zap, HandCoins, RotateCw, CircleDollarSign, Circle, ShoppingBag, Coffee, Home, Dumbbell, Plane, Gift, Wifi, Smartphone, BookOpen, Music, Film, Heart } from 'lucide-react';

const ICON_MAP = {
    Pizza, Car, PartyPopper, Zap, Wallet, HandCoins, RotateCw, CircleDollarSign, Circle,
    ShoppingBag, Coffee, Home, Dumbbell, Plane, Gift, Wifi, Smartphone, BookOpen, Music, Film, Heart
};
const CategoryIcon = ({ iconName, color }) => {
    const Icon = ICON_MAP[iconName] || Circle;
    return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: color }}>
            <Icon size={16} />
        </div>
    );
};

export const Transactions = ({ onEdit }) => {
    const { data, removeTransaction } = useData();
    const [search, setSearch] = useState('');

    const filtered = data.transactions.filter(t =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {filtered.length === 0 && (
                        <div className="p-8 text-center text-slate-400">
                            No se encontraron movimientos.
                        </div>
                    )}
                    {filtered.map(t => {
                        let catName = t.category;
                        const cat = data.categories.find(c => c.name === catName);
                        return (
                            <div key={t.id} className="px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        <CategoryIcon iconName={cat?.icon} color={cat?.color || '#cbd5e1'} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{t.description}</div>
                                        <div className="text-sm text-slate-500 flex items-center gap-2">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{t.category}</span>
                                            <span>• {format(new Date(t.date), 'd MMM yyyy', { locale: es })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                                    <div className={`font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}>
                                        {t.type === 'expense' && '-'}
                                        €{Number(t.amount).toLocaleString()}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit && onEdit(t)}
                                            className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => removeTransaction(t.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    )}
                </div>
            </div>
        </div>
    )
}
