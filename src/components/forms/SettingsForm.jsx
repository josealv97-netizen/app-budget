import { useState } from 'react';
import { useData } from '../../context/store';
import { Pizza, Car, PartyPopper, Zap, Wallet, HandCoins, RotateCw, CircleDollarSign, Circle, ShoppingBag, Coffee, Home, Dumbbell, Plane, Gift, Wifi, Smartphone, BookOpen, Music, Film, Heart, Trash2 } from 'lucide-react';

const ICON_LIST = [
    { name: 'Pizza', Icon: Pizza },
    { name: 'Car', Icon: Car },
    { name: 'PartyPopper', Icon: PartyPopper },
    { name: 'Zap', Icon: Zap },
    { name: 'ShoppingBag', Icon: ShoppingBag },
    { name: 'Coffee', Icon: Coffee },
    { name: 'Home', Icon: Home },
    { name: 'Dumbbell', Icon: Dumbbell },
    { name: 'Plane', Icon: Plane },
    { name: 'Gift', Icon: Gift },
    { name: 'Wifi', Icon: Wifi },
    { name: 'Smartphone', Icon: Smartphone },
    { name: 'BookOpen', Icon: BookOpen },
    { name: 'Music', Icon: Music },
    { name: 'Film', Icon: Film },
    { name: 'Heart', Icon: Heart },
    { name: 'Wallet', Icon: Wallet },
    { name: 'HandCoins', Icon: HandCoins },
    { name: 'RotateCw', Icon: RotateCw },
    { name: 'CircleDollarSign', Icon: CircleDollarSign },
];

export const SettingsForm = ({ onClose }) => {
    const { data, updatePreferences, addCategory, removeCategory } = useData();
    const [initialBalance, setInitialBalance] = useState(data.preferences.initialBalance);
    const [startDate, setStartDate] = useState(data.preferences.startDate);

    // Category Form State
    const [newCatName, setNewCatName] = useState('');
    const [newCatType, setNewCatType] = useState('expense');
    const [newCatColor, setNewCatColor] = useState('#3b82f6');
    const [newCatIcon, setNewCatIcon] = useState('Circle');

    const handleSaveGeneralSettings = () => {
        updatePreferences({ initialBalance: Number(initialBalance), startDate });
        onClose();
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!newCatName) return;
        addCategory({
            name: newCatName,
            type: newCatType,
            color: newCatColor,
            icon: newCatIcon
        });
        setNewCatName('');
        setNewCatIcon('Circle');
    };

    return (
        <div className="space-y-8">
            {/* General Settings */}
            <section>
                <h4 className="text-sm font-semibold text-slate-900 mb-4 px-1">Paramètres Généraux</h4>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Solde Initial</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                            <input
                                type="number"
                                value={initialBalance}
                                onChange={(e) => setInitialBalance(e.target.value)}
                                className="pl-8 w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Date de Début</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full"
                        />
                        <p className="text-xs text-slate-400 mt-1">Les dépenses fixes seront générées automatiquement à partir de cette date.</p>
                    </div>

                    <button onClick={handleSaveGeneralSettings} className="btn w-full bg-slate-900 text-white hover:bg-black">
                        Sauvegarder
                    </button>
                </div>
            </section>

            <hr className="border-slate-100" />

            {/* Categories */}
            <section>
                <h4 className="text-sm font-semibold text-slate-900 mb-4 px-1">Gérer les Catégories</h4>

                <form onSubmit={handleAddCategory} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Nom</label>
                        <input
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            placeholder="Nouvelle Catégorie..."
                            className="bg-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Type</label>
                            <select
                                value={newCatType}
                                onChange={(e) => setNewCatType(e.target.value)}
                                className="bg-white w-full"
                            >
                                <option value="expense">Dépense</option>
                                <option value="income">Revenu</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Couleur</label>
                            <input
                                type="color"
                                value={newCatColor}
                                onChange={(e) => setNewCatColor(e.target.value)}
                                className="w-full h-10 rounded-xl cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Icon Picker */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-2 block">Icône</label>
                        <div className="grid grid-cols-8 gap-2">
                            {ICON_LIST.map(({ name, Icon }) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => setNewCatIcon(name)}
                                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${newCatIcon === name ? 'bg-slate-900 text-white ring-2 ring-offset-2 ring-slate-900' : 'bg-white text-slate-400 hover:bg-slate-200'}`}
                                >
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn w-full bg-white border border-slate-200 text-slate-900 hover:bg-slate-50">
                        Ajouter la catégorie
                    </button>
                </form>

                {/* List Categories */}
                <div className="mt-4 space-y-2 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                    {data.categories.map(cat => (
                        <div key={cat.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 group">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                            <span className="text-sm font-medium text-slate-700 flex-1 truncate">{cat.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded mr-2 flex-shrink-0">
                                {cat.type === 'expense' ? 'Dépense' : 'Revenu'}
                            </span>
                            <button
                                onClick={() => removeCategory(cat.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                title="Supprimer"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
