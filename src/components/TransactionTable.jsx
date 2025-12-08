import { Trash2, Copy, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useData } from '../context/store';
import { Circle, Pizza, Car, PartyPopper, Zap, Wallet, HandCoins, RotateCw, CircleDollarSign, ShoppingBag, Coffee, Home, Dumbbell, Plane, Gift, Wifi, Smartphone, BookOpen, Music, Film, Heart } from 'lucide-react';

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

export const TransactionTable = ({ transactions, onEdit, onDelete }) => {
    const { data } = useData();

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) {
            onDelete(id);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 backdrop-blur sticky top-0 z-10 border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Détail</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Montant</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-400 text-sm">
                                    Aucune transaction trouvée.
                                </td>
                            </tr>
                        )}
                        {transactions.map(t => {
                            let catName = t.category;
                            const cat = data.categories.find(c => c.name === catName);
                            // Dashboard logic passed 'isFuture' sometimes, but we can check if needed or rely on prop
                            const isFuture = t.isFuture;

                            return (
                                <tr
                                    key={t.id}
                                    onClick={() => onEdit && onEdit(t)}
                                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${isFuture ? 'bg-amber-50/30' : ''}`}
                                >
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0">
                                                <CategoryIcon iconName={cat?.icon} color={cat?.color || '#cbd5e1'} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-slate-900 text-sm truncate">{t.description}</div>
                                                <div className="text-xs text-slate-400 flex items-center gap-1">
                                                    <span>{t.category}</span>
                                                    {t.origin === 'recurring' && <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[10px] hidden sm:inline-block">Récurrent</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-xs text-slate-500 hidden md:table-cell whitespace-nowrap">
                                        {format(new Date(t.date), 'd MMM yyyy HH:mm', { locale: fr })}
                                    </td>
                                    <td className={`px-4 py-2 font-bold text-sm whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}>
                                        {t.type === 'expense' && '-'}
                                        €{Number(t.amount).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        {t.status && (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${t.status === 'En attente' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                                {t.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1">
                                            {/* Actions */}
                                            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                {/* Edit (Mobile usually clicks row, but explicit button is good too) */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit && onEdit(t); }}
                                                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors hidden md:block" // Hidden on mobile as row click works
                                                    title="Éditer"
                                                >
                                                    <Edit2 size={16} />
                                                </button>

                                                {/* Duplicate */}
                                                {onEdit && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const copy = { ...t };
                                                            delete copy.id;
                                                            delete copy.date; // Or keep? Usually duplicates are current date or similar. Let's keep data, user changes date.
                                                            // Actually, onEdit usually opens modal with data.
                                                            // For duplicate, we might want to pass a flag or just data without ID.
                                                            // But `onEdit` expects a transaction object.
                                                            // Let's assume the parent can handle a 'new' object if we pass one? 
                                                            // Or better, add `onDuplicate` prop.
                                                            if (window.confirm("Dupliquer cette transaction ?")) {
                                                                // Simple dup for now: pass to parent? 
                                                                // User asked for "Actions". 
                                                                // I'll assume we open the modal with this data but as a NEW transaction.
                                                                // I'll call onEdit with { ...t, id: null } so form treats it as new?
                                                                onEdit({ ...t, id: undefined, date: new Date().toISOString() });
                                                            }
                                                        }}
                                                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Dupliquer"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                )}

                                                {/* Delete */}
                                                {onDelete && (
                                                    <button
                                                        onClick={(e) => handleDelete(e, t.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
