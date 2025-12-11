import { useState, useRef, useEffect } from 'react';
import { Trash2, Copy, Edit2, MoreVertical, X } from 'lucide-react';
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
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: color }}>
            <Icon size={16} />
        </div>
    );
};

export const TransactionTable = ({ transactions, onEdit, onDelete }) => {
    const { data } = useData();
    const [activeMenu, setActiveMenu] = useState(null); // ID of transaction with open menu
    const menuRef = useRef(null);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) {
            onDelete && onDelete(id);
        }
        setActiveMenu(null);
    };

    const handleDuplicate = (e, t) => {
        e.stopPropagation();
        if (window.confirm("Dupliquer cette transaction ?")) {
            onEdit && onEdit({ ...t, id: undefined, date: new Date().toISOString() });
        }
        setActiveMenu(null);
    };

    if (transactions.length === 0) {
        return (
            <div className="p-8 text-center text-slate-400 text-sm">
                Aucune transaction trouvée.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* MOBILE VIEW (Single Column List) */}
            <div className="md:hidden overflow-y-auto flex-1 p-2 space-y-2 pb-24">
                {transactions.map(t => {
                    let catName = t.category;
                    const cat = data.categories.find(c => c.name === catName);
                    const isFuture = t.isFuture;

                    return (
                        <div
                            key={t.id}
                            onClick={() => onEdit && onEdit(t)}
                            className={`relative py-2 border-b border-slate-100 last:border-0 flex items-start gap-3 transition-colors ${isFuture ? 'bg-amber-50/30' : 'hover:bg-slate-50'}`}
                        >
                            <CategoryIcon iconName={cat?.icon} color={cat?.color || '#cbd5e1'} />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2">

                                    <h4 className="font-semibold text-slate-900 text-sm truncate flex-1">{t.description}</h4>
                                    <span className={`font-bold text-sm whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'expense' && '-'}€{Number(t.amount).toLocaleString()}
                                    </span>
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                                    <span className="font-medium text-slate-600">{t.category}</span>
                                    <span>•</span>
                                    <span>{format(new Date(t.date), 'd/MM HH:mm', { locale: fr })}</span>
                                    {t.status && (
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${t.status === 'En attente' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                            {t.status}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Menu Button - Flex Item now to avoid overlap */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(activeMenu === t.id ? null : t.id);
                                }}
                                className="p-1 -mr-2 text-slate-400 hover:bg-slate-100 rounded-full shrink-0"
                            >
                                <MoreVertical size={16} />
                            </button>

                            {/* Actions Dropdown - Still absolute but relative to something? 
                                We removed 'relative' from parent. 
                                Actually parent needs 'relative' for the dropdown to position correctly 
                                OR we positioning relative to the button?
                                Let's put 'relative' back on the PARENT LINE 119, but remove styling.
                            */}
                            {activeMenu === t.id && (
                                <div ref={menuRef} className="absolute right-8 top-8 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-20 py-1 w-36 animate-fade-in origin-top-right">
                                    <button
                                        onClick={(e) => handleDuplicate(e, t)}
                                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                        <Copy size={12} /> Dupliquer
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, t.id)}
                                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 size={12} /> Supprimer
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* DESKTOP VIEW (Table) */}
            <div className="hidden md:block overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 backdrop-blur sticky top-0 z-10 border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Détail</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Montant</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {transactions.map(t => {
                            let catName = t.category;
                            const cat = data.categories.find(c => c.name === catName);
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
                                                    {t.origin === 'recurring' && <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[10px]">Récurrent</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-xs text-slate-500 whitespace-nowrap">
                                        {format(new Date(t.date), 'd/MM HH:mm', { locale: fr })}
                                    </td>
                                    <td className={`px-4 py-2 font-bold text-sm whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}>
                                        {t.type === 'expense' && '-'}
                                        €{Number(t.amount).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        {t.status && (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${t.status === 'En attente' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                                {t.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1">
                                            <div className="flex items-center gap-1 opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit && onEdit(t); }}
                                                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Éditer"
                                                >
                                                    <Edit2 size={16} />
                                                </button>

                                                {onEdit && (
                                                    <button
                                                        onClick={(e) => handleDuplicate(e, t)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Dupliquer"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                )}

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
