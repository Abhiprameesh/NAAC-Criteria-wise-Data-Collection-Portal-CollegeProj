import React, { useState } from 'react';
import './App.css';

// Import components
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Modal from './components/Modal';

// Import hooks
import { useLocalStorage } from './hooks/useLocalStorage';

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [naacData, setNaacData] = useLocalStorage('naacData', []);
  const [settings, setSettings] = useLocalStorage('naacSettings', {});
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const addEntry = (newEntry) => {
    const entryWithId = {
      ...newEntry,
      id: Date.now(),
      dateAdded: new Date().toLocaleDateString(),
    };
    setNaacData([...naacData, entryWithId]);
  };

  const deleteEntry = (id) => {
    setNaacData(naacData.filter(entry => entry.id !== id));
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setNaacData([]);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard naacData={naacData} openModal={openModal} setActiveTab={setActiveTab} />;
      case 'data-entry':
        return <DataEntry onAddEntry={addEntry} settings={settings} />;
      case 'reports':
        return <Reports naacData={naacData} deleteEntry={deleteEntry} openModal={openModal} />;
      case 'settings':
        return <Settings settings={settings} setSettings={setSettings} clearAllData={clearAllData} naacData={naacData} />;
      default:
        return <Dashboard naacData={naacData} openModal={openModal} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-container">
        {renderActiveTab()}
      </main>
      <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
    </div>
  );
}

export default App;