import { useState } from 'react';
import { useData } from '../context/store';
import { Card } from '../components/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Wallet, Calendar, Plus, Pizza, Car, PartyPopper, Zap, HandCoins, RotateCw, CircleDollarSign, Circle, ShoppingBag, Coffee, Home, Dumbbell, Plane, Gift, Wifi, Smartphone, BookOpen, Music, Film, Heart } from 'lucide-react';
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

    const balance = getCurrentBalance();
    const projected = getProjectedBalanceAPI();
    const chartData = getDailyBalanceData(range, direction);
    const upcoming = getMergedUpcoming();
    const recent = data.transactions.slice(0, 50);

    // Unified Timeline
    const unifiedTimeline = [
        ...upcoming.map(u => ({ ...u, status: 'En attente', isFuture: true })),
        ...recent.filter(r => !isFuture(new Date(r.date))).map(r => ({ ...r, status: 'Completé', isFuture: false }))
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

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header Removed */}


            {/* TOP SECTION */}
            <div className="flex gap-6 lg:h-[55vh] flex-col md:flex-row ">
                {/* 1. Balance Trend & Summary */}
                <Card className="flex md:flex-1 flex-col relative overflow-hidden bg-white border-slate-200 h-[380px] lg:h-auto">
                    <div className="flex justify-between items-start mb-4 z-10">
                        <div>
                            <h3 className="text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Solde Actuel</h3>
                            <div className="text-2xl lg:text-3xl font-bold text-slate-900">€{balance.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-[10px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Projection (Fin de mois)</h3>
                            <div className="text-lg lg:text-xl font-bold text-blue-600">€{projected.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Controls: Range + Direction */}
                    <div className="flex flex-wrap items-center gap-2 lg:gap-4 mb-2 z-10">
                        {/* Range Switcher */}
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                            {ranges.map(r => (
                                <button
                                    key={r.key}
                                    onClick={() => setRange(r.key)}
                                    className={`px-2 lg:px-3 py-1 rounded-md text-[10px] lg:text-xs font-medium transition-all ${range === r.key ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        {/* Direction Switcher */}
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setDirection('past')}
                                className={`px-2 lg:px-3 py-1 rounded-md text-[10px] lg:text-xs font-medium transition-all ${direction === 'past' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Historique
                            </button>
                            <button
                                onClick={() => setDirection('future')}
                                className={`px-2 lg:px-3 py-1 rounded-md text-[10px] lg:text-xs font-medium transition-all ${direction === 'future' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Futur
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-0 pl-0 -ml-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={direction === 'future' ? '#8b5cf6' : '#3b82f6'} stopOpacity={0.1} />
                                        <stop offset="95%" stopColor={direction === 'future' ? '#8b5cf6' : '#3b82f6'} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30} // Prevent overlap on long ranges
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    tickFormatter={(val) => `€${val}`}
                                    tickLine={false}
                                    axisLine={false}
                                    width={50}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`€${value.toLocaleString()}`, 'Solde']}
                                    labelStyle={{ color: '#64748b', fontSize: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="balance"
                                    stroke={direction === 'future' ? '#8b5cf6' : '#3b82f6'}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorBalance)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
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
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
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
            <div className="pb-12">
                <Card className="overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-2">Détail</th>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Montant</th>
                                    <th className="px-4 py-2">État</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {timelineDisplay.map((t, i) => {
                                    let catName = t.category;
                                    const cat = data.categories.find(c => c.name === catName);

                                    return (
                                        <tr key={`${t.id}-${i}`} className={`hover:bg-slate-50/50 transition-colors ${t.isFuture ? 'bg-amber-50/30' : ''}`}>
                                            <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-3">
                                                <div className="shrink-0">
                                                    <CategoryIcon iconName={cat?.icon} color={cat?.color || '#cbd5e1'} />
                                                </div>
                                                <div className="min-w-0"> {/* Allow text truncation if needed */}
                                                    <div className="text-slate-900 font-semibold truncate">{t.description}</div>
                                                    <div className="text-xs text-slate-400 font-normal">{t.category}</div>
                                                </div>
                                                {t.origin === 'recurring' && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded ml-2 hidden sm:inline-block">Récurrent</span>}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs md:text-sm">
                                                {format(new Date(t.date), 'd MMM', { locale: fr })}
                                            </td>
                                            <td className={`px-4 py-3 font-bold whitespace-nowrap text-sm md:text-base ${t.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}>
                                                {t.type === 'expense' && '-'}€{Number(t.amount).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${t.status === 'En attente' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Mobile Floating Action Button (FAB) */}
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
