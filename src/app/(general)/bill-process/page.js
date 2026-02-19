'use client'
import React, { useState } from "react";
import { 
  FaFileInvoice, FaEnvelope, FaCheckSquare, FaMoneyBillWave,
  FaDownload, FaEye, FaShare, FaPrint, FaWhatsapp, 
  FaEnvelope as FaEmail, FaSpinner, FaCheck, FaFilePdf, 
  FaFileExcel, FaFileWord, FaTimes, FaTrash, FaFilter,
  FaCalendar, FaUser, FaSearch, FaChevronDown
} from "react-icons/fa";
import { MdBarChart } from "react-icons/md";
import { BsDownload, BsThreeDotsVertical, BsGrid, BsList } from "react-icons/bs";
import { FiDownload, FiPrinter, FiShare2, FiMail, FiCheckCircle, FiX } from "react-icons/fi";

const billingItems = [
  {
    id: 1,
    title: "Covering Letter",
    desc: "Formal letter for submitting billing documents",
    icon: <FaFileInvoice size={28} className="text-primary" />,
    type: "document",
    format: "pdf",
    category: "letter"
  },
  {
    id: 2,
    title: "Bill",
    desc: "Client invoice with detailed charges and GST",
    icon: <MdBarChart size={28} className="text-success" />,
    type: "invoice",
    format: "pdf",
    category: "bill"
  },
  {
    id: 3,
    title: "Attendance",
    desc: "Monthly employee attendance report",
    icon: <FaEnvelope size={28} className="text-warning" />,
    type: "report",
    format: "excel",
    category: "attendance"
  },
  {
    id: 4,
    title: "Employee Wages Sheet",
    desc: "Detailed employee salary and wage breakdown",
    icon: <FaCheckSquare size={28} className="text-success" />,
    type: "sheet",
    format: "excel",
    category: "wages"
  },
  {
    id: 5,
    title: "Employer Wages Sheet",
    desc: "Employer contribution and wage summary",
    icon: <FaMoneyBillWave size={28} className="text-danger" />,
    type: "sheet",
    format: "excel",
    category: "wages"
  },
  {
    id: 6,
    title: "EPF",
    desc: "Provident fund contribution and ECR report",
    icon: <FaFileInvoice size={28} className="text-primary" />,
    type: "report",
    format: "pdf",
    category: "epf"
  },
  {
    id: 7,
    title: "ESIC",
    desc: "Employee State Insurance contribution details",
    icon: <FaEnvelope size={28} className="text-warning" />,
    type: "report",
    format: "pdf",
    category: "esic"
  },
  {
    id: 8,
    title: "Wages Sheet",
    desc: "Combined wages sheet for employees",
    icon: <FaMoneyBillWave size={28} className="text-danger" />,
    type: "sheet",
    format: "excel",
    category: "wages"
  },
  {
    id: 9,
    title: "Payment Proof",
    desc: "Proof of payment transactions",
    icon: <FaCheckSquare size={28} className="text-success" />,
    type: "proof",
    format: "pdf",
    category: "payment"
  },
  {
    id: 10,
    title: "GST",
    desc: "GST summary and tax filing details",
    icon: <MdBarChart size={28} className="text-success" />,
    type: "tax",
    format: "pdf",
    category: "gst"
  }
];

// Filter categories based on image
const filterCategories = [
  "All",
  "Covering Letter",
  "Bill",
  "EPF",
  "ESIC",
  "Wages Sheet",
  "Payment Proof",
  "GST"
];

const Page = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [generating, setGenerating] = useState({});
  const [generatedDocs, setGeneratedDocs] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Sample clients data
  const clients = [
    { id: 1, name: "Client A" },
    { id: 2, name: "Client B" },
    { id: 3, name: "Client C" },
    { id: 4, name: "Client D" },
  ];

  // Months
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Years
  const years = [2023, 2024, 2025, 2026];

  // Filter items based on selected category
  const filteredItems = billingItems.filter(item => {
    if (selectedCategory === "All") return true;
    
    const categoryMap = {
      "Covering Letter": "letter",
      "Bill": "bill",
      "EPF": "epf",
      "ESIC": "esic",
      "Wages Sheet": "wages",
      "Payment Proof": "payment",
      "GST": "gst"
    };
    
    return item.category === categoryMap[selectedCategory];
  });

  // Generate document
  const handleGenerate = (itemId) => {
    setGenerating(prev => ({ ...prev, [itemId]: true }));
    
    setTimeout(() => {
      setGenerating(prev => ({ ...prev, [itemId]: false }));
      setGeneratedDocs(prev => ({ 
        ...prev, 
        [itemId]: {
          id: itemId,
          generatedAt: new Date().toISOString(),
          fileName: `${billingItems.find(i => i.id === itemId)?.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
          size: Math.floor(Math.random() * 500) + 100 + " KB"
        }
      }));
    }, 2000);
  };

  // Generate all documents
  const handleGenerateAll = () => {
    const allIds = filteredItems.map(item => item.id);
    const generatingState = {};
    allIds.forEach(id => { generatingState[id] = true; });
    setGenerating(generatingState);
    
    setTimeout(() => {
      const newGeneratedDocs = {};
      allIds.forEach(id => {
        newGeneratedDocs[id] = {
          id,
          generatedAt: new Date().toISOString(),
          fileName: `${billingItems.find(i => i.id === id)?.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
          size: Math.floor(Math.random() * 500) + 100 + " KB"
        };
      });
      
      setGeneratedDocs(prev => ({ ...prev, ...newGeneratedDocs }));
      setGenerating({});
    }, 5000);
  };

  return (
    <div className='main-content'>
      <div className='row'>
        <div className="col-12">
          <div className="card">
            
            {/* Bill Process Header */}
            <div className="card-header bg-white border-0 pt-4">
              <h4 className="fw-bold mb-0">Bill Process</h4>
            </div>

            {/* Filters Section - As shown in image */}
            <div className="px-4 pb-3">
              <div className="row g-3 align-items-end">
                {/* Select Client */}
                <div className="col-lg-3">
                  <label className="form-label fw-semibold mb-1">Select Client</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaUser className="text-muted" size={14} />
                    </span>
                    <select 
                      className="form-control border-start-0 ps-0"
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                    >
                      <option value="">Select Client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Select Month */}
                <div className="col-lg-2">
                  <label className="form-label fw-semibold mb-1">Select Month</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaCalendar className="text-muted" size={14} />
                    </span>
                    <select 
                      className="form-control border-start-0 ps-0"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="">Month</option>
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Year */}
                <div className="col-lg-2">
                  <label className="form-label fw-semibold mb-1">Year</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaCalendar className="text-muted" size={14} />
                    </span>
                    <select 
                      className="form-control border-start-0 ps-0"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="">Year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search */}
                <div className="col-lg-3">
                  <label className="form-label fw-semibold mb-1">Search</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaSearch className="text-muted" size={14} />
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-start-0 ps-0"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Generate All Button */}
                <div className="col-lg-2">
                  <button 
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleGenerateAll}
                    disabled={Object.values(generating).some(v => v)}
                  >
                    {Object.values(generating).some(v => v) ? (
                      <>
                        <FaSpinner className="spinner" size={14} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <BsDownload size={16} />
                        Generate All
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Filter Categories - As shown in image */}
              <div className="d-flex flex-wrap align-items-center gap-2 mt-4">
                {filterCategories.map((category, index) => (
                  <button
                    key={index}
                    className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-light'} rounded-pill px-3 py-1`}
                    onClick={() => setSelectedCategory(category)}
                    style={{ fontSize: '14px' }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Documents Count and View Toggle */}
            <div className="px-4 py-3 d-flex justify-content-between align-items-center border-top">
              <div>
                <span className="fw-semibold">{filteredItems.length} Documents</span>
                <span className="text-muted ms-2">({Object.keys(generatedDocs).length} generated)</span>
              </div>
              <div className="btn-group">
                <button 
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <BsGrid size={14} />
                </button>
                <button 
                  className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => setViewMode('list')}
                >
                  <BsList size={14} />
                </button>
              </div>
            </div>

            {/* Cards Grid - As shown in image */}
            <div className="card-body pt-0">
              {viewMode === 'grid' ? (
                <div className="row g-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="col-lg-4 col-md-6">
                      <div className="card shadow-sm border-0 h-100">
                        <div className="card-body d-flex flex-column">
                          
                          {/* Icon + Title */}
                          <div className="d-flex align-items-start gap-3 mb-3">
                            <div className="p-2 bg-light rounded-3">
                              {item.icon}
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">{item.title}</h6>
                              <p className="text-muted small mb-0">{item.desc}</p>
                            </div>
                          </div>

                          {/* Button */}
                          <div className="mt-auto">
                            <button 
                              className="btn btn-light w-100 border d-flex align-items-center justify-content-center gap-2"
                              onClick={() => handleGenerate(item.id)}
                              disabled={generating[item.id]}
                            >
                              {generating[item.id] ? (
                                <>
                                  <FaSpinner className="spinner" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <BsDownload />
                                  Generate
                                </>
                              )}
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View
                <div className="list-group">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-2 bg-light rounded-3">
                          {item.icon}
                        </div>
                        <div>
                          <h6 className="fw-semibold mb-1">{item.title}</h6>
                          <p className="text-muted small mb-0">{item.desc}</p>
                        </div>
                      </div>
                      <button 
                        className="btn btn-light border d-flex align-items-center gap-2"
                        onClick={() => handleGenerate(item.id)}
                        disabled={generating[item.id]}
                      >
                        {generating[item.id] ? (
                          <>
                            <FaSpinner className="spinner" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <BsDownload />
                            Generate
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {filteredItems.length === 0 && (
                <div className="text-center py-5">
                  <p className="text-muted">No documents found for this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        .input-group-text {
          background-color: #f8f9fa;
        }
        .form-control:focus, .btn:focus {
          box-shadow: none;
        }
        .rounded-pill {
          border-radius: 50px !important;
        }
      `}</style>
    </div>
  );
};

export default Page;