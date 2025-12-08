
import { useState, useEffect } from 'react';
import { useData } from '../context/store';
import { Card } from '../components/Card';
import { TransactionTable } from '../components/TransactionTable';
import { BalanceChart } from '../components/BalanceChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, Calendar, Plus, Maximize2, X, Minimize2, Pizza, Car, PartyPopper, Zap, HandCoins, RotateCw, CircleDollarSign, Circle, ShoppingBag, Coffee, Home, Dumbbell, Plane, Gift, Wifi, Smartphone, BookOpen, Music, Film, Heart } from 'lucide-react';
import { format, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';

// Icon Map
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
                        className={`px - 2 lg: px - 3 py - 1 rounded - md text - [10px] lg: text - xs font - medium transition - all ${range === r.key ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'} `}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            {/* Direction Switcher */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                    onClick={() => setDirection('past')}
                    className={`px - 2 lg: px - 3 py - 1 rounded - md text - [10px] lg: text - xs font - medium transition - all ${direction === 'past' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'} `}
                >
                    Historique
                </button>
                <button
                    onClick={() => setDirection('future')}
                    className={`px - 2 lg: px - 3 py - 1 rounded - md text - [10px] lg: text - xs font - medium transition - all ${direction === 'future' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'} `}
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
                            <div className="text-right hidden sm:block">
                                <h3 className="text-[10px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Projection (Fin de mois)</h3>
                                <div className="text-lg lg:text-xl font-bold text-blue-600">€{projected.toLocaleString()}</div>
                            </div>
                            <button
                                onClick={() => setIsFullScreen(true)}
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                                title="Plein écran"
                            >
                                <Maximize2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-2 z-10">
                        <Controls />
                    </div>

                    <div className="flex-1 w-full min-h-0 pl-0 -ml-2">
                        <BalanceChart data={chartData} direction={direction} />
                    </div>
                </Card>

                {/* 2. Budget / Pie Chart */}
                <Card className="flex flex-col h-[350px] lg:h-auto">
                    <h3 className="heading-md mb-4">Répartition des Dépenses</h3>
                    {pieData.length > 0 ? (
                        <div className="flex-1 flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell - ${index} `} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `€${value.toLocaleString()} `} />
                                    {/* <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ right: 0 }} /> */}
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -ml-20">
                                <span className="text-2xl font-bold text-slate-800">{pieData.length}</span>
                                <span className="text-xs text-slate-400">Catégories</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400">
                            Aucune donnée
                        </div>
                    )}
                </Card>
            </div>

            {/* BOTTOM SECTION - Unified Timeline */}
            <Card className="pb">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="heading-md flex items-center gap-2">
                        <Calendar size={20} className="text-slate-400" />
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
