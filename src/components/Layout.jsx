import { LayoutDashboard, Receipt, CalendarClock, Settings, Banknote } from 'lucide-react';

export const Layout = ({ children, currentPage, setCurrentPage, onOpenSettings }) => {

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' },
        { id: 'salaries', icon: Banknote, label: 'Salaires' },
        { id: 'transactions', icon: Receipt, label: 'Historial' },
        { id: 'recurring', icon: CalendarClock, label: 'Fijos' },
    ];

    return (
        <div className="flex flex-col min-h-screen pb-24 md:pb-0 md:flex-row bg-slate-50">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-50 bg-white border-r border-slate-200 p-6 min-h-screen top-0 left-0 z-20">
                <div className="mb-12 flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        $
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                        Mi Dinero
                    </h1>
                </div>

                <nav className="flex-1 flex flex-col gap-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${currentPage === item.id
                                ? 'bg-slate-100 text-slate-900'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            <item.icon size={20} className={currentPage === item.id ? 'stroke-[2.5px]' : ''} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="border-t border-slate-100 pt-4 mt-auto">
                    <button
                        onClick={onOpenSettings}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 w-full font-medium transition-all"
                    >
                        <Settings size={20} />
                        <span>Configuración</span>
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
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all w-20 ${currentPage === item.id
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-slate-400'
                            }`}
                    >
                        <item.icon size={24} strokeWidth={currentPage === item.id ? 2.5 : 2} />
                        <span className="text-[10px] font-semibold">{item.label}</span>
                    </button>
                ))}
                <button
                    onClick={onOpenSettings}
                    className="flex flex-col items-center gap-1 p-3 rounded-2xl text-slate-400 w-20"
                >
                    <Settings size={24} />
                    <span className="text-[10px] font-semibold">Ajustes</span>
                </button>
            </nav>
        </div>
    )
}
