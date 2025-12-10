import React, { useState, useEffect } from 'react';

const Reports = ({ naacData, deleteEntry, openModal }) => {
  const [filters, setFilters] = useState({
    criteria: '',
    year: ''
  });
  const [filteredData, setFilteredData] = useState(naacData);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    applyFilters();
  }, [naacData, filters]);

  const applyFilters = () => {
    let filtered = naacData;

    if (filters.criteria) {
      filtered = filtered.filter(d => d.criteria === filters.criteria);
    }

    if (filters.year) {
      filtered = filtered.filter(d => d.academicYear === filters.year);
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
          <p><strong>Student Strength:</strong> {entry.studentStrength || 'N/A'}</p>
          <p><strong>Faculty Count:</strong> {entry.facultyCount || 'N/A'}</p>
          <p><strong>Programs Offered:</strong> {entry.programsOffered || 'N/A'}</p>
          <p><strong>Budget Allocation:</strong> {entry.budgetAllocation ? '₹' + entry.budgetAllocation + ' Lakhs' : 'N/A'}</p>
        </div>
        <div style={{marginBottom: '1rem'}}>
          <h4>Description:</h4>
          <p style={{background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}}>{entry.description}</p>
        </div>
        {entry.bestPractices && (
          <div style={{marginBottom: '1rem'}}>
            <h4>Best Practices:</h4>
            <p style={{background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}}>{entry.bestPractices}</p>
          </div>
        )}
        
      </div>
    );
    
    openModal(modalContent);
  };

  const exportData = () => {
    if (filteredData.length === 0) {
      showMessage('No data to export with current filters.', 'error');
      return;
    }
    
    const csvContent = convertToCSV(filteredData);
    downloadCSV(csvContent, 'naac_data_export.csv');
    showMessage('Data exported successfully!', 'success');
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
        <h2>NAAC Data Reports</h2>
        
        {message.text && (
          <div className={`${message.type}-message`}>
            {message.text}
          </div>
        )}
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="criteria">Filter by Criteria</label>
            <select
              id="criteria"
              name="criteria"
              value={filters.criteria}
              onChange={handleFilterChange}
            >
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
            <label htmlFor="year">Filter by Year</label>
            <select
              id="year"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
            >
              <option value="">All Years</option>
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
              <option value="2021-22">2021-22</option>
              <option value="2020-21">2020-21</option>
              <option value="2019-20">2019-20</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <button className="btn btn-primary" onClick={exportData}>📥 Export Data</button>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Institution</th>
              <th>Criteria</th>
              <th>Academic Year</th>
              <th>Student Strength</th>
              <th>Faculty Count</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" style={{textAlign: 'center', padding: '2rem', color: '#718096'}}>
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
                  <td>{data.studentStrength || 'N/A'}</td>
                  <td>{data.facultyCount || 'N/A'}</td>
                  <td>{data.dateAdded}</td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginRight: '0.25rem'}}
                      onClick={() => viewEntry(data)}
                    >
                      👁️ View
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}}
                      onClick={() => handleDelete(data.id)}
                    >
                      🗑️ Delete
                    </button>
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

export default Reports;