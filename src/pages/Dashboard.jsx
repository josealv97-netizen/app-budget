
import { useState, useEffect } from 'react';
import { useData } from '../context/store';
import { Card } from '../components/Card';
import { TransactionTable } from '../components/TransactionTable';
import { BalanceChart } from '../components/BalanceChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, Calendar, Plus, Maximize2, X, Minimize2 } from 'lucide-react';
import { format, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CategoryIcon } from '../components/CategoryIcon';


export const Dashboard = ({ onOpenTransaction }) => {
    const { getCurrentBalance, getProjectedBalanceAPI, getDailyBalanceData, getMergedUpcoming, data } = useData();
    const [range, setRange] = useState('1M'); // Default to 3M for useful projection
    const [direction, setDirection] = useState('future'); // 'past' | 'future'
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Prevent body scroll when fullscreen
    useEffect(() => {
        if (isFullScreen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => document.body.style.overflow = 'unset';
    }, [isFullScreen]);

    const balance = getCurrentBalance();
    const projected = getProjectedBalanceAPI();
    const chartData = getDailyBalanceData(range, direction);
    const upcoming = getMergedUpcoming();
    const recent = data.transactions.slice(0, 50);

    // Unified Timeline
    const unifiedTimeline = [
        ...upcoming.map(u => ({ ...u, status: 'En attente', isFuture: true })),
        ...recent.filter(r => new Date(r.date) <= new Date()).map(r => ({ ...r, status: 'Completé', isFuture: false }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Limit display
    const timelineDisplay = unifiedTimeline.slice(0, 15);

    // Pie Data
    const expensesByCategory = data.transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            const cat = data.categories.find(c => c.name === curr.category);
            const key = cat ? cat.name : 'Autres';
            const color = cat ? cat.color : '#94a3b8';

            if (!acc[key]) acc[key] = { name: key, value: 0, color };
            acc[key].value += Number(curr.amount);
            return acc;
        }, {});

    const pieData = Object.values(expensesByCategory);

    const ranges = [
        { key: '1M', label: '1 Mois' },
        { key: '3M', label: '3 Mois' },
        { key: '6M', label: '6 Mois' },
        { key: '1Y', label: '1 An' },
    ];

    const Controls = () => (
        <div className="flex flex-wrap items-center gap-2 lg:gap-4 z-10 transition-all">
            {/* Range Switcher */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {ranges.map(r => (
                    <button
                        key={r.key}
                        onClick={() => setRange(r.key)}
                        className={`px-2 lg:px-3 py-1 rounded-md text-[10px] lg:text-xs font-medium transition-all ${range === r.key ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'} `}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            {/* Direction Switcher */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                    onClick={() => setDirection('past')}
                    className={`px-2 lg:px-3 py-1 rounded-md text-[10px] lg:text-xs font-medium transition-all ${direction === 'past' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'} `}
                >
                    Historique
                </button>
                <button
                    onClick={() => setDirection('future')}
                    className={`px-2 lg:px-3 py-1 rounded-md text-[10px] lg:text-xs font-medium transition-all ${direction === 'future' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'} `}
                >
                    Futur
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 h-full flex flex-col relative">
            {/* Full Screen Overlay */}
            {isFullScreen && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-bold text-slate-900">Analyse Détaillée</h3>
                            <Controls />
                        </div>
                        <button
                            onClick={() => setIsFullScreen(false)}
                            className="p-2 rounded-full hover:bg-slate-200 text-slate-500"
                        >
                            <Minimize2 size={24} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50/30 p-4">
                        <div className="h-full min-w-[200%] md:min-w-full lg:min-w-0" style={{ minWidth: '150vw' }}> {/* Force Horizontal Scroll on Touch */}
                            <BalanceChart data={chartData} direction={direction} />
                        </div>
                    </div>
                </div>
            )}

            {/* TOP SECTION */}
            <div className="flex gap-6 lg:h-[50vh] flex-col md:flex-row ">
                {/* 1. Balance Trend & Summary */}
                <Card className="flex md:flex-1 flex-col relative overflow-hidden bg-white border-slate-200 h-[380px] lg:h-auto">
                    <div className="flex justify-between items-start mb-4 z-10">
                        <div>
                            <h3 className="text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Solde Actuel</h3>
                            <div className="text-2xl lg:text-3xl font-bold text-slate-900">€{balance.toLocaleString()}</div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="text-right  sm:block">
                                <h3 className="text-[10px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Projection (Fin de mois)</h3>
                                <div className="text-lg lg:text-xl font-bold text-blue-600">€{projected.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-2 z-10 flex items-center justify-between">
                        <Controls className="flex-1" />
                        <button
                            onClick={() => setIsFullScreen(true)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                            title="Plein écran"
                        >
                            <Maximize2 size={20} />
                        </button>
                    </div>

                    <div className="flex-1 w-full min-h-0 pl-0 -ml-2">

                        <BalanceChart data={chartData} direction={direction} />
                    </div>
                </Card>

                {/* 2. Limits / Modules */}
                <Card className="flex flex-col h-[380px] lg:h-auto overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="heading-md">Límites Mensuales</h3>
                        <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded">
                            {format(new Date(), 'MMMM', { locale: fr })}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {data.limits.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                                <p className="mb-2">No has definido límites.</p>
                                <p className="text-xs">Ve a la pestaña "Límites" para configurar tu presupuesto.</p>
                            </div>
                        ) : (
                            data.limits.map(limit => {
                                // Calculate spent for this limit in current month
                                const now = new Date();
                                const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                                const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

                                const spent = data.transactions
                                    .filter(t => {
                                        const tDate = new Date(t.date);
                                        return t.type === 'expense' &&
                                            tDate >= currentMonthStart &&
                                            tDate <= currentMonthEnd &&
                                            limit.category_ids.includes(t.category);
                                    })
                                    .reduce((sum, t) => sum + Number(t.amount), 0);

                                const percentage = Math.min((spent / limit.amount) * 100, 100);
                                const isOver = spent > limit.amount;

                                // Color logic
                                let colorClass = 'bg-blue-500';
                                if (percentage < 50) colorClass = 'bg-emerald-500';
                                else if (percentage < 75) colorClass = 'bg-yellow-500'; // Yellow
                                else if (percentage < 100) colorClass = 'bg-orange-500';
                                else colorClass = 'bg-red-500'; // Over limit

                                return (
                                    <div key={limit.id} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold text-slate-700">{limit.name}</span>
                                            <span className="font-medium text-slate-900">
                                                {Math.round(spent)} <span className="text-slate-400 text-xs">/ {Math.round(limit.amount)}</span>
                                            </span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                                                style={{ width: `${isOver ? 100 : percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>
            </div>

            {/* BOTTOM SECTION - Unified Timeline */}
            <Card className="px-0 ">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="heading-md flex items-center gap-2 text-xs">
                        <Calendar size={18} className="text-slate-400" />
                        Chronologie des Activités
                    </h3>
                    {/* Hidden on Mobile, Visible on Desktop */}
                    <button
                        onClick={onOpenTransaction}
                        className="hidden md:flex bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-medium items-center transition-colors shadow-sm hover:shadow-md"
                    >
                        <Plus size={16} className="mr-2" /> Nouvelle Transaction
                    </button>
                </div>
                {/* Reusable Table Component */}
                <div className="overflow-x-auto">
                    <TransactionTable
                        transactions={timelineDisplay}
                        onEdit={onOpenTransaction}
                    // Dashboard view implies read-only for delete usually, or passing it?
                    // User didn't ask to delete from Dashboard specifically but said "equal".
                    // If I don't pass onDelete, the delete button won't show (as per my implementation).
                    />
                </div>
            </Card>
            <button
                onClick={onOpenTransaction}
                className="md:hidden fixed bottom-24 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                title="Nouvelle Transaction"
            >
                <Plus size={28} />
            </button>
        </div>
    )
}
