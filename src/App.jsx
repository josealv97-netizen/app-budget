import { useState } from 'react'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Salaries } from './pages/Salaries'
import { Recurring } from './pages/Recurring'
import { Modules } from './pages/Modules'
import { DataProvider } from './context/store'
import { Modal } from './components/Modal'
import { SettingsForm } from './components/forms/SettingsForm'
import { TransactionForm } from './components/forms/TransactionForm'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [activeModal, setActiveModal] = useState(null); // 'settings', 'transaction', null
  const [editingTransaction, setEditingTransaction] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onOpenTransaction={(t) => {
        // Allow objects with ID (edit) or objects with description (duplicate/template)
        const isTransaction = t && (t.id || t.description) && !t.nativeEvent;
        setEditingTransaction(isTransaction ? t : null);
        setActiveModal('transaction');
      }} />;
      // case 'transactions': return <Transactions />; // Updated below in Layout
      case 'recurring': return <Recurring />;
      case 'salaries': return <Salaries />;
      case 'modules': return <Modules />;
      default: return <Dashboard onOpenTransaction={(t) => {
        const isTransaction = t && (t.id || t.description) && !t.nativeEvent;
        setEditingTransaction(isTransaction ? t : null);
        setActiveModal('transaction');
      }} />;
    }
  }

  return (
    <DataProvider>
      <Layout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenSettings={() => setActiveModal('settings')}
      >
        {currentPage === 'transactions' ? (
          <Transactions onEdit={(t) => { setEditingTransaction(t); setActiveModal('transaction'); }} />
        ) : renderPage()}
      </Layout>

      {/* Global Modals */}
      <Modal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        title="Configuración"
      >
        <SettingsForm onClose={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'transaction'}
        onClose={() => setActiveModal(null)}
        title={editingTransaction ? "Editar Movimiento" : "Nuevo Movimiento"}
      >
        <TransactionForm onClose={() => setActiveModal(null)} initialData={editingTransaction} />
      </Modal>

    </DataProvider>
  )
}

export default App
