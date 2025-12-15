import { LayoutDashboard, Receipt, CalendarClock, Settings, Banknote, Target, List, Repeat, Plus } from 'lucide-react';

export const Layout = ({ children, currentPage, onNavigate, onOpenSettings, onOpenTransaction }) => {

    return (
        <div className="flex flex-col min-h-screen pb-24 md:pb-0 md:flex-row bg-slate-50">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-40 bg-white border-r border-slate-200 py-6 pb-0 px-3 min-h-screen top-0 left-0 z-20">
                <div className="mb-12 flex items-center gap-3 px-2">
                    <div className="w-12 h-12 bg-blue-600 text-2xl rounded-lg flex items-center justify-center text-white font-bold">
                        $
                    </div>
                </div>

                <nav className="flex-1 flex flex-col gap-2">
                    {[
                        { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
                        { id: 'salaries', icon: Banknote, label: 'Salaires' },
                        { id: 'transactions', icon: List, label: 'Historique' },
                        { id: 'recurring', icon: Repeat, label: 'Récurrent' },
                        { id: 'modules', icon: Target, label: 'Limites' }, // New Limits Item
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${currentPage === item.id
                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="border-t border-slate-100  mt-auto">
                    <button
                        onClick={onOpenSettings}
                        className="flex text-center items-center justify-center gap-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 w-full font-medium transition-all"
                    >
                        <Settings size={24} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="mx-auto p-6 md:p-8 animate-fade-in">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 pb-safe flex justify-around z-40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all w-20 ${currentPage === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
                >
                    <LayoutDashboard size={24} />
                    <span className="text-[10px] font-semibold">Accueil</span>
                </button>
                <button
                    onClick={() => onNavigate('transactions')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all w-20 ${currentPage === 'transactions' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
                >
                    <List size={24} />
                    <span className="text-[10px] font-semibold">Historique</span>
                </button>
                <button
                    onClick={() => onOpenTransaction()}
                    className="flex flex-col items-center justify-center -mt-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg shadow-blue-200"
                >
                    <Plus size={28} />
                </button>
                <button
                    onClick={() => onNavigate('modules')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all w-20 ${currentPage === 'modules' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
                >
                    <Target size={24} />
                    <span className="text-[10px] font-semibold">Limites</span>
                </button>
                <button
                    onClick={onOpenSettings}
                    className="flex flex-col items-center gap-1 p-3 rounded-2xl text-slate-400 w-20"
                >
                    <Settings size={28} />
                    <span className="text-[10px] font-semibold">Réglages</span>
                </button>
            </nav>
        </div>
    )
}
