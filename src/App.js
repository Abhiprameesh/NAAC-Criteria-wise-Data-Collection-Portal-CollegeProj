import React, { useState } from 'react';
import './App.css';

// Simple inline components for testing
const Header = ({ activeTab, setActiveTab }) => (
  <header className="header">
    <div className="header-content">
      <div className="logo">
        <div className="logo-icon">N</div>
        <h1>NAAC Data Collection Portal</h1>
      </div>
      <nav className="nav-tabs">
        <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} 
                onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`tab-btn ${activeTab === 'data-entry' ? 'active' : ''}`} 
                onClick={() => setActiveTab('data-entry')}>Data Entry</button>
      </nav>
    </div>
  </header>
);

const Dashboard = () => (
  <div className="tab-content">
    <h2>Dashboard</h2>
    <div className="dashboard-grid">
      <div className="stat-card">
        <div className="stat-number">0</div>
        <div className="stat-label">Total Entries</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">0/7</div>
        <div className="stat-label">Completed Criteria</div>
      </div>
    </div>
    <p>Welcome to the NAAC Data Collection Portal!</p>
  </div>
);

const DataEntry = () => (
  <div className="tab-content">
    <div className="form-container">
      <h2>Data Entry Form</h2>
      <form>
        <div className="form-group">
          <label>Institution Name</label>
          <input type="text" placeholder="Enter institution name" />
        </div>
        <div className="form-group">
          <button type="button" className="btn btn-primary">Save Data</button>
        </div>
      </form>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-container">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'data-entry' && <DataEntry />}
      </main>
    </div>
  );
}

export default App;