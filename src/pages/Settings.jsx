import { useState } from 'react';
import { useData } from '../context/store';
import { Card } from '../components/Card';
import { Save, Plus, Trash2 } from 'lucide-react';

export const Settings = () => {
    const { data, updatePreferences, addCategory, DEFAULT_CATEGORIES } = useData();
    const [initialBalance, setInitialBalance] = useState(data.preferences.initialBalance);
    const [newCatName, setNewCatName] = useState('');

    const handleSaveBalance = () => {
        updatePreferences({ initialBalance: Number(initialBalance) });
        alert('Saldo inicial actualizado');
    };

    const handleAddCategory = () => {
        if (!newCatName) return;
        addCategory({ name: newCatName, color: '#64748b', type: 'expense' });
        setNewCatName('');
    };

    return (
        <div className="space-y-6">
            <h2 className="heading-lg">Configuración</h2>

            <Card title="Saldo Inicial">
                <p className="text-gray-400 mb-4 text-sm">Define con cuánto dinero comienzas (cuenta de banco actual).</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        className="flex-1"
                    />
                    <button onClick={handleSaveBalance} className="btn">
                        <Save size={18} /> Guardar
                    </button>
                </div>
            </Card>

            <Card title="Categorías / Widgets">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {data.categories.map(cat => (
                        <div key={cat.id} className="p-3 bg-slate-800 rounded flex items-center justify-between border-l-4" style={{ borderLeftColor: cat.color }}>
                            <span>{cat.name}</span>
                            {/* Deleting logic not requested as core but good to have, skipping for speed unless needed */}
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        placeholder="Nueva categoría..."
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                    />
                    <button onClick={handleAddCategory} className="btn btn-secondary">
                        <Plus size={18} />
                    </button>
                </div>
            </Card>
        </div>
    )
}
