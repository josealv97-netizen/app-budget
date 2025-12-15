import { CategoryIcon } from './CategoryIcon';
import { Check } from 'lucide-react';

export const CategorySelector = ({ categories, selectedId, onSelect, multiSelect = false }) => {
    const handleSelect = (catId) => {
        if (multiSelect) {
            // selectedId is array
            const current = Array.isArray(selectedId) ? selectedId : [];
            if (current.includes(catId)) {
                onSelect(current.filter(id => id !== catId));
            } else {
                onSelect([...current, catId]);
            }
        } else {
            // Single select
            onSelect(catId);
        }
    };

    const isSelected = (catId) => {
        if (multiSelect) {
            return Array.isArray(selectedId) && selectedId.includes(catId);
        }
        return selectedId === catId; // Matches by ID (or name if passed as value, but ID is safer if available)
    };

    return (
        <div className="grid grid-cols-4 gap-3">
            {categories.map(cat => {
                const active = isSelected(cat.name); // Using name for compatibility with existing forms that use name
                // Ideally we should migrate to IDs, but for now stick to name as value if that's what forms use.
                // Re-reading TransactionForm: value={formData.category} which is name.

                return (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelect(cat.name)}
                        className={`
                            relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                            ${active
                                ? 'bg-blue-50 border-blue-500 scale-105 shadow-sm'
                                : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                            }
                        `}
                    >
                        <CategoryIcon iconName={cat.icon} color={cat.color} size={20} className="w-10 h-10 shadow-sm" />
                        <span className={`text-[10px] font-medium text-center leading-tight ${active ? 'text-slate-900' : 'text-slate-500'}`}>
                            {cat.name}
                        </span>
                        {active && (
                            <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
                                <Check size={10} strokeWidth={3} />
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
