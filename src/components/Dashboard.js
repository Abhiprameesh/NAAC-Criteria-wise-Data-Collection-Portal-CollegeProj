import React from 'react';

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

export default Dashboard;