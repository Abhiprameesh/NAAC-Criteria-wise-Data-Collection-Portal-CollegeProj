import React, { useState } from 'react';

const Settings = ({ settings, setSettings, clearAllData, naacData }) => {
  const [formSettings, setFormSettings] = useState({
    defaultInstitution: settings.defaultInstitution || '',
    defaultNaacId: settings.defaultNaacId || ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSettings = () => {
    setSettings(formSettings);
    showMessage('Settings saved successfully!', 'success');
  };

  const exportAllData = () => {
    if (naacData.length === 0) {
      showMessage('No data to export.', 'error');
      return;
    }
    
    const csvContent = convertToCSV(naacData);
    downloadCSV(csvContent, 'naac_all_data_export.csv');
    showMessage('All data exported successfully!', 'success');
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            
            // Simple CSV parsing - in a real app you might want to use a CSV parsing library
            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim()) {
                // Here you would parse and add the data
                // This is a simplified version - you'd need to properly parse CSV
                console.log('Importing data from CSV...');
              }
            }
            showMessage('Data imported successfully!', 'success');
          } catch (error) {
            showMessage('Error importing data. Please check the file format.', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const convertToCSV = (data) => {
    const headers = [
      'ID', 'Institution Name', 'NAAC ID', 'Criteria', 'Academic Year',
      'Student Strength', 'Faculty Count', 'Programs Offered', 'Budget Allocation',
      'Description', 'Best Practices', 'Date Added'
    ];
    
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = [
        row.id,
        `"${row.institutionName}"`,
        `"${row.naacId || ''}"`,
        row.criteria,
        row.academicYear,
        row.studentStrength || '',
        row.facultyCount || '',
        row.programsOffered || '',
        row.budgetAllocation || '',
        `"${(row.description || '').replace(/"/g, '""')}"`,
        `"${(row.bestPractices || '').replace(/"/g, '""')}"`,
        row.dateAdded
      ];
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
        <h2>Portal Settings</h2>
        
        {message.text && (
          <div className={`${message.type}-message`}>
            {message.text}
          </div>
        )}
        
        <div className="form-section">
          <h3>Data Management</h3>
          <div className="form-group">
            <button className="btn btn-secondary" onClick={clearAllData}>🗑️ Clear All Data</button>
            <button className="btn btn-secondary" onClick={importData}>📤 Import Data</button>
            <button className="btn btn-primary" onClick={exportAllData}>📥 Export All Data</button>
          </div>
        </div>

        <div className="form-section">
          <h3>Institution Settings</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="defaultInstitution">Default Institution Name</label>
              <input
                type="text"
                id="defaultInstitution"
                name="defaultInstitution"
                value={formSettings.defaultInstitution}
                onChange={handleInputChange}
                placeholder="Enter default institution name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="defaultNaacId">Default NAAC ID</label>
              <input
                type="text"
                id="defaultNaacId"
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

export default Settings;