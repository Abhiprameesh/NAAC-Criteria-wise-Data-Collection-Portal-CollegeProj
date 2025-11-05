import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Modal from './components/Modal';
import { getEntries, createEntry, deleteEntryById, clearAllEntries, getSettings as getSettingsApi, updateSettings as updateSettingsApi } from './api';

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [naacData, setNaacData] = useState([]);
  const [settings, setSettingsState] = useState({});
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [entries, s] = await Promise.all([getEntries(), getSettingsApi()]);
        setNaacData(entries || []);
        setSettingsState(s || {});
      } catch (e) {
        console.error('Failed to load initial data', e);
      }
    }
    load();
  }, []);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const addEntry = async (newEntry) => {
    try {
      const saved = await createEntry(newEntry);
      setNaacData([saved, ...naacData]);
    } catch (e) {
      console.error('Failed to create entry', e);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await deleteEntryById(id);
      setNaacData(naacData.filter(entry => entry.id !== id));
    } catch (e) {
      console.error('Failed to delete entry', e);
    }
  };

  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        await clearAllEntries();
        setNaacData([]);
      } catch (e) {
        console.error('Failed to clear entries', e);
      }
    }
  };

  const setSettings = async (payload) => {
    try {
      const updated = await updateSettingsApi(payload);
      setSettingsState(updated || {});
    } catch (e) {
      console.error('Failed to update settings', e);
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