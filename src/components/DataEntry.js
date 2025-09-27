import React, { useState, useRef } from 'react';

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
  const fileInputRef = useRef(null);

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
    
    // Validation
    if (!formData.institutionName || !formData.criteria || !formData.academicYear || !formData.description) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    // Prepare data with files
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
              <div className="file-upload" onClick={triggerFileInput}>
                <input
                  type="file"
                  ref={fileInputRef}
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

export default DataEntry;