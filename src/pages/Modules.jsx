import { useState } from 'react';
import { useData } from '../context/store';
import { Card } from '../components/Card';
import { Plus, Trash2, Target } from 'lucide-react';
import { Modal } from '../components/Modal';
import { CategorySelector } from '../components/CategorySelector';
import { CategoryIcon } from '../components/CategoryIcon';

export const Modules = () => {
    const { data, addLimit, removeLimit } = useData();
    const [isIdModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        category_ids: [] // Array of category names (using names as IDs for now based on store logic)
    });

    const handleOpenModal = () => {
        setFormData({ name: '', amount: '', category_ids: [] });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.amount || formData.category_ids.length === 0) return;

        addLimit({
            name: formData.name,
            amount: Number(formData.amount),
            category_ids: formData.category_ids
        });
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar este módulo?')) {
            removeLimit(id);
        }
    };

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="heading-lg">Módulos de Presupuesto</h2>
                    <p className="text-slate-500 text-sm">Define límites mensuales para grupos de categorías.</p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                >
                    <Plus size={18} /> Nuevo
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.limits.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                        <Target size={48} className="mx-auto mb-3 opacity-20" />
                        <p>No tienes módulos configurados.</p>
                    </div>
                )}

                {data.limits.map(limit => (
                    <Card key={limit.id} className="relative group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-800 text-lg">{limit.name}</h3>
                            <button
                                onClick={() => handleDelete(limit.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="text-2xl font-bold text-blue-600 mb-4">
                            €{Number(limit.amount).toLocaleString()}
                            <span className="text-xs text-slate-400 font-normal ml-1">/ mes</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {limit.category_ids && limit.category_ids.map((catName, idx) => {
                                // Find cat to get icon/color
                                const cat = data.categories.find(c => c.name === catName);
                                const color = cat ? cat.color : '#94a3b8';
                                const icon = cat ? cat.icon : 'Circle';

                                return (
                                    <div key={idx} className="flex items-center justify-center" title={catName}>
                                        <CategoryIcon iconName={icon} color={color} size={12} className="w-6 h-6" />
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isIdModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nuevo Módulo"
            >
                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input
                            placeholder="Ej: Salidas, Comida, Fijos..."
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Límite Mensual (€)</label>
                        <input
                            type="number"
                            placeholder="300"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full text-lg font-semibold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Categorías Incluidas</label>
                        <CategorySelector
                            categories={data.categories.filter(c => c.type === 'expense')}
                            selectedId={formData.category_ids}
                            onSelect={(ids) => setFormData({ ...formData, category_ids: ids })}
                            multiSelect={true}
                        />
                        <p className="text-xs text-slate-400 mt-2">
                            Selecciona todas las categorías que sumarán a este límite.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn w-full shadow-lg shadow-blue-200 mt-4"
                        disabled={!formData.name || !formData.amount || formData.category_ids.length === 0}
                        style={{ opacity: (!formData.name || !formData.amount || formData.category_ids.length === 0) ? 0.5 : 1 }}
                    >
                        Crear Módulo
                    </button>
                </form>
            </Modal>
        </div>
    );
};
