import React, { useState } from 'react';
import './App.css';

// Custom hook for localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Header Component
const Header = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'data-entry', label: 'Data Entry' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">N</div>
          <h1>NAAC Data Collection Portal</h1>
        </div>
        <nav className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>×</button>
        {content}
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ naacData, openModal, setActiveTab }) => {
  const calculateCriteriaProgress = () => {
    const progress = {};
    for (let i = 1; i <= 7; i++) {
      const entriesForCriteria = naacData.filter(d => d.criteria == i);
      progress[i] = Math.min(entriesForCriteria.length * 25, 100);
    }
    return progress;
  };

  const criteriaProgress = calculateCriteriaProgress();
  const totalEntries = naacData.length;
  const completedCriteria = Object.values(criteriaProgress).filter(p => p > 0).length;
  const overallProgress = Math.round(Object.values(criteriaProgress).reduce((a, b) => a + b, 0) / 7);
  const lastUpdated = naacData.length > 0 ? 
    new Date(Math.max(...naacData.map(d => new Date(d.dateAdded)))).toLocaleDateString() : 'Never';

  const criteriaData = [
    {
      id: 1,
      title: "Curricular Aspects",
      description: "Curriculum planning, implementation, and enrichment",
      class: "criteria-1"
    },
    {
      id: 2,
      title: "Teaching-Learning & Evaluation",
      description: "Student enrollment, teaching-learning processes, and evaluation",
      class: "criteria-2"
    },
    {
      id: 3,
      title: "Research, Innovations & Extension",
      description: "Research promotion, resource mobilization, and extension activities",
      class: "criteria-3"
    },
    {
      id: 4,
      title: "Infrastructure & Learning Resources",
      description: "Physical facilities, library, and ICT infrastructure",
      class: "criteria-4"
    },
    {
      id: 5,
      title: "Student Support & Progression",
      description: "Student support services and progression tracking",
      class: "criteria-5"
    },
    {
      id: 6,
      title: "Governance, Leadership & Management",
      description: "Institutional governance, leadership quality, and management",
      class: "criteria-6"
    },
    {
      id: 7,
      title: "Institutional Values & Best Practices",
      description: "Environmental consciousness, values, and best practices",
      class: "criteria-7"
    }
  ];

  const openCriteriaModal = (criteriaNumber) => {
    const criteriaDetails = {
      1: {
        title: "Curricular Aspects",
        description: "This criteria focuses on curriculum planning and implementation, including program design, syllabus development, and academic flexibility.",
        keyIndicators: [
          "Curriculum Planning and Implementation",
          "Academic Flexibility",
          "Curriculum Enrichment",
          "Feedback System"
        ]
      },
      2: {
        title: "Teaching-Learning and Evaluation",
        description: "Covers student enrollment, teaching-learning process, teacher profile, and evaluation processes.",
        keyIndicators: [
          "Student Enrollment and Profile",
          "Catering to Student Diversity",
          "Teaching-Learning Process",
          "Teacher Profile and Quality"
        ]
      },
      3: {
        title: "Research, Innovations and Extension",
        description: "Focuses on promoting research culture, resource mobilization, research facilities, and extension activities.",
        keyIndicators: [
          "Resource Mobilization for Research",
          "Innovation Ecosystem",
          "Research Publications",
          "Extension Activities"
        ]
      },
      4: {
        title: "Infrastructure and Learning Resources",
        description: "Deals with physical and academic support facilities including library, ICT, and campus infrastructure.",
        keyIndicators: [
          "Physical Facilities",
          "Library as Learning Resource",
          "IT Infrastructure",
          "Maintenance of Campus Infrastructure"
        ]
      },
      5: {
        title: "Student Support and Progression",
        description: "Covers student support services, guidance, soft skills development, and progression tracking.",
        keyIndicators: [
          "Student Support",
          "Student Progression",
          "Student Participation",
          "Alumni Engagement"
        ]
      },
      6: {
        title: "Governance, Leadership and Management",
        description: "Focuses on institutional governance, leadership quality, faculty empowerment, and financial management.",
        keyIndicators: [
          "Institutional Vision and Leadership",
          "Strategy Development",
          "Faculty Empowerment Strategies",
          "Financial Management"
        ]
      },
      7: {
        title: "Institutional Values and Best Practices",
        description: "Emphasizes environmental consciousness, institutional values, and best practices implementation.",
        keyIndicators: [
          "Institutional Values",
          "Best Practices",
          "Institutional Distinctiveness",
          "Environmental Consciousness"
        ]
      }
    };

    const criteria = criteriaDetails[criteriaNumber];
    const entriesCount = naacData.filter(d => d.criteria == criteriaNumber).length;
    
    const modalContent = (
      <div>
        <h2>Criteria {criteriaNumber}: {criteria.title}</h2>
        <p style={{marginBottom: '1.5rem', color: '#4a5568', lineHeight: '1.6'}}>{criteria.description}</p>
        
        <h3 style={{color: '#2d3748', marginBottom: '1rem'}}>Key Indicators:</h3>
        <ul style={{marginBottom: '1.5rem', paddingLeft: '1.5rem'}}>
          {criteria.keyIndicators.map((indicator, index) => (
            <li key={index} style={{marginBottom: '0.5rem'}}>{indicator}</li>
          ))}
        </ul>
        
        <div style={{background: '#f7fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
          <strong>Current Status:</strong> {entriesCount} entries recorded
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setActiveTab('data-entry');
          }}
        >
          📝 Add Data for This Criteria
        </button>
      </div>
    );
    
    openModal(modalContent);
  };

  return (
    <div className="tab-content">
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-number">{totalEntries}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completedCriteria}/7</div>
          <div className="stat-label">Completed Criteria</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{overallProgress}%</div>
          <div className="stat-label">Overall Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{lastUpdated}</div>
          <div className="stat-label">Last Updated</div>
        </div>
      </div>

      <div className="criteria-grid">
        {criteriaData.map(criteria => (
          <div 
            key={criteria.id}
            className="criteria-card" 
            onClick={() => openCriteriaModal(criteria.id)}
          >
            <div className="criteria-header">
              <div className={`criteria-icon ${criteria.class}`}>{criteria.id}</div>
              <div className="criteria-title">{criteria.title}</div>
            </div>
            <div className="criteria-desc">{criteria.description}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${criteriaProgress[criteria.id] || 0}%`}}
              ></div>
            </div>
            <div className="progress-text">{criteriaProgress[criteria.id] || 0}% Complete</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Data Entry Component
const DataEntry = ({ onAddEntry, settings }) => {
  const [formData, setFormData] = useState({
    institutionName: settings.defaultInstitution || '',
    naacId: settings.defaultNaacId || '',
    criteria: '',
    academicYear: '',
    studentStrength: '',
    facultyCount: '',
    programsOffered: '',
    budgetAllocation: '',
    description: '',
    bestPractices: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.institutionName || !formData.criteria || !formData.academicYear || !formData.description) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    const entryData = {
      ...formData,
      files: selectedFiles.map(file => file.name)
    };

    onAddEntry(entryData);
    showMessage('Data saved successfully!', 'success');
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      institutionName: settings.defaultInstitution || '',
      naacId: settings.defaultNaacId || '',
      criteria: '',
      academicYear: '',
      studentStrength: '',
      facultyCount: '',
      programsOffered: '',
      budgetAllocation: '',
      description: '',
      bestPractices: ''
    });
    setSelectedFiles([]);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  return (
    <div className="tab-content">
      <div className="form-container">
        <h2>NAAC Data Entry Form</h2>
        
        {message.text && (
          <div className={`${message.type}-message`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Institution Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="institutionName">Institution Name *</label>
                <input
                  type="text"
                  id="institutionName"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="naacId">NAAC ID</label>
                <input
                  type="text"
                  id="naacId"
                  name="naacId"
                  value={formData.naacId}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="criteria">Select Criteria *</label>
                <select
                  id="criteria"
                  name="criteria"
                  value={formData.criteria}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a criteria</option>
                  <option value="1">Criteria 1: Curricular Aspects</option>
                  <option value="2">Criteria 2: Teaching-Learning & Evaluation</option>
                  <option value="3">Criteria 3: Research, Innovations & Extension</option>
                  <option value="4">Criteria 4: Infrastructure & Learning Resources</option>
                  <option value="5">Criteria 5: Student Support & Progression</option>
                  <option value="6">Criteria 6: Governance, Leadership & Management</option>
                  <option value="7">Criteria 7: Institutional Values & Best Practices</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="academicYear">Academic Year *</label>
                <select
                  id="academicYear"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select year</option>
                  <option value="2023-24">2023-24</option>
                  <option value="2022-23">2022-23</option>
                  <option value="2021-22">2021-22</option>
                  <option value="2020-21">2020-21</option>
                  <option value="2019-20">2019-20</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Quantitative Data</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentStrength">Total Student Strength</label>
                <input
                  type="number"
                  id="studentStrength"
                  name="studentStrength"
                  value={formData.studentStrength}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="facultyCount">Total Faculty Count</label>
                <input
                  type="number"
                  id="facultyCount"
                  name="facultyCount"
                  value={formData.facultyCount}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="programsOffered">Programs Offered</label>
                <input
                  type="number"
                  id="programsOffered"
                  name="programsOffered"
                  value={formData.programsOffered}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="budgetAllocation">Budget Allocation (in Lakhs)</label>
                <input
                  type="number"
                  id="budgetAllocation"
                  name="budgetAllocation"
                  value={formData.budgetAllocation}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Qualitative Information</h3>
            <div className="form-group">
              <label htmlFor="description">Detailed Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed information about the selected criteria..."
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="bestPractices">Best Practices</label>
              <textarea
                id="bestPractices"
                name="bestPractices"
                value={formData.bestPractices}
                onChange={handleInputChange}
                placeholder="Describe any best practices implemented..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Supporting Documents</h3>
            <div className="form-group">
              <label>Upload Documents</label>
              <div className="file-upload" onClick={() => document.getElementById('fileInput').click()}>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xlsx,.jpg,.png"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <div>📎 Click to upload files or drag and drop</div>
                <small>Supported formats: PDF, DOC, DOCX, XLSX, JPG, PNG</small>
              </div>
              {selectedFiles.length > 0 && (
                <div className="file-list">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary">💾 Save Data</button>
            <button type="button" className="btn btn-secondary" onClick={clearForm}>🔄 Clear Form</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reports Component
const Reports = ({ naacData, deleteEntry, openModal }) => {
  const [filters, setFilters] = useState({ criteria: '', year: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredData = naacData.filter(item => {
    return (!filters.criteria || item.criteria === filters.criteria) &&
           (!filters.year || item.academicYear === filters.year);
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
      showMessage('Entry deleted successfully!', 'success');
    }
  };

  const viewEntry = (entry) => {
    const modalContent = (
      <div>
        <h2>Entry Details</h2>
        <div style={{background: '#f7fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem'}}>
          <p><strong>Institution:</strong> {entry.institutionName}</p>
          <p><strong>NAAC ID:</strong> {entry.naacId || 'N/A'}</p>
          <p><strong>Criteria:</strong> {entry.criteria}</p>
          <p><strong>Academic Year:</strong> {entry.academicYear}</p>
          <p><strong>Description:</strong> {entry.description}</p>
        </div>
      </div>
    );
    openModal(modalContent);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  return (
    <div className="tab-content">
      <div className="form-container">
        <h2>NAAC Data Reports</h2>
        
        {message.text && (
          <div className={`${message.type}-message`}>{message.text}</div>
        )}
        
        <div className="form-row">
          <div className="form-group">
            <label>Filter by Criteria</label>
            <select name="criteria" value={filters.criteria} onChange={handleFilterChange}>
              <option value="">All Criteria</option>
              <option value="1">Criteria 1: Curricular Aspects</option>
              <option value="2">Criteria 2: Teaching-Learning & Evaluation</option>
              <option value="3">Criteria 3: Research, Innovations & Extension</option>
              <option value="4">Criteria 4: Infrastructure & Learning Resources</option>
              <option value="5">Criteria 5: Student Support & Progression</option>
              <option value="6">Criteria 6: Governance, Leadership & Management</option>
              <option value="7">Criteria 7: Institutional Values & Best Practices</option>
            </select>
          </div>
          <div className="form-group">
            <label>Filter by Year</label>
            <select name="year" value={filters.year} onChange={handleFilterChange}>
              <option value="">All Years</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
              <option value="2021-22">2021-22</option>
              <option value="2020-21">2020-21</option>
              <option value="2019-20">2019-20</option>
            </select>
          </div>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Institution</th>
              <th>Criteria</th>
              <th>Academic Year</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '2rem', color: '#718096'}}>
                  {naacData.length === 0 ? 'No data available. Please add some entries first.' : 'No data matches the selected filters.'}
                </td>
              </tr>
            ) : (
              filteredData.map(data => (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>{data.institutionName}</td>
                  <td>Criteria {data.criteria}</td>
                  <td>{data.academicYear}</td>
                  <td>{data.dateAdded}</td>
                  <td>
                    <button className="btn btn-secondary" style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginRight: '0.25rem'}} onClick={() => viewEntry(data)}>👁️ View</button>
                    <button className="btn btn-secondary" style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}} onClick={() => handleDelete(data.id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Settings Component
const Settings = ({ settings, setSettings, clearAllData }) => {
  const [formSettings, setFormSettings] = useState({
    defaultInstitution: settings.defaultInstitution || '',
    defaultNaacId: settings.defaultNaacId || ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormSettings(prev => ({ ...prev, [name]: value }));
  };

  const saveSettings = () => {
    setSettings(formSettings);
    showMessage('Settings saved successfully!', 'success');
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  return (
    <div className="tab-content">
      <div className="form-container">
        <h2>Portal Settings</h2>
        
        {message.text && (
          <div className={`${message.type}-message`}>{message.text}</div>
        )}
        
        <div className="form-section">
          <h3>Data Management</h3>
          <div className="form-group">
            <button className="btn btn-secondary" onClick={clearAllData}>🗑️ Clear All Data</button>
          </div>
        </div>

        <div className="form-section">
          <h3>Institution Settings</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Default Institution Name</label>
              <input
                type="text"
                name="defaultInstitution"
                value={formSettings.defaultInstitution}
                onChange={handleInputChange}
                placeholder="Enter default institution name"
              />
            </div>
            <div className="form-group">
              <label>Default NAAC ID</label>
              <input
                type="text"
                name="defaultNaacId"
                value={formSettings.defaultNaacId}
                onChange={handleInputChange}
                placeholder="Enter default NAAC ID"
              />
            </div>
          </div>
          <div className="form-group">
            <button className="btn btn-primary" onClick={saveSettings}>💾 Save Settings</button>
          </div>
        </div>

        <div className="form-section">
          <h3>About</h3>
          <p style={{color: '#718096', lineHeight: '1.6'}}>
            NAAC Criteria-wise Data Collection Portal v1.0<br/>
            Developed for institutional data collection and NAAC accreditation preparation.<br/>
            This portal helps institutions organize and manage data across all seven NAAC criteria.
          </p>
        </div>
      </div>
    </div>
  );
};

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
        return <Settings settings={settings} setSettings={setSettings} clearAllData={clearAllData} />;
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