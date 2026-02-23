'use client'
import React, { useState, useEffect } from "react";
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

const API_BASE = 'https://green-owl-255815.hostingersite.com/api';

const billingItems = [
  {
    id: 1,
    title: "Covering Letter",
    desc: "Formal letter for submitting billing documents",
    icon: <FaFileInvoice size={28} className="text-primary" />,
    type: "document",
    format: "pdf",
    category: "letter",
    document_key: "covering_letter"
  },
  {
    id: 2,
    title: "Bill",
    desc: "Client invoice with detailed charges and GST",
    icon: <MdBarChart size={28} className="text-success" />,
    type: "invoice",
    format: "pdf",
    category: "bill",
    document_key: "bill"
  },
  {
    id: 3,
    title: "Attendance",
    desc: "Monthly employee attendance report",
    icon: <FaEnvelope size={28} className="text-warning" />,
    type: "report",
    format: "excel",
    category: "attendance",
    document_key: "attendance"
  },
  {
    id: 4,
    title: "Employee Wages Sheet",
    desc: "Detailed employee salary and wage breakdown",
    icon: <FaCheckSquare size={28} className="text-success" />,
    type: "sheet",
    format: "excel",
    category: "wages",
    document_key: "employee_wages_sheet"
  },
  {
    id: 5,
    title: "Employer Wages Sheet",
    desc: "Employer contribution and wage summary",
    icon: <FaMoneyBillWave size={28} className="text-danger" />,
    type: "sheet",
    format: "excel",
    category: "wages",
    document_key: "employer_wages_sheet"
  },
  {
    id: 6,
    title: "EPF",
    desc: "Provident fund contribution and ECR report",
    icon: <FaFileInvoice size={28} className="text-primary" />,
    type: "report",
    format: "pdf",
    category: "epf",
    document_key: "epf"
  },
  {
    id: 7,
    title: "ESIC",
    desc: "Employee State Insurance contribution details",
    icon: <FaEnvelope size={28} className="text-warning" />,
    type: "report",
    format: "pdf",
    category: "esic",
    document_key: "esic"
  },
  {
    id: 8,
    title: "Wages Sheet",
    desc: "Combined wages sheet for employees",
    icon: <FaMoneyBillWave size={28} className="text-danger" />,
    type: "sheet",
    format: "excel",
    category: "wages",
    document_key: "wages_sheet"
  },
  {
    id: 9,
    title: "Payment Proof",
    desc: "Proof of payment transactions",
    icon: <FaCheckSquare size={28} className="text-success" />,
    type: "proof",
    format: "pdf",
    category: "payment",
    document_key: "payment_proof"
  },
  {
    id: 10,
    title: "GST",
    desc: "GST summary and tax filing details",
    icon: <MdBarChart size={28} className="text-success" />,
    type: "tax",
    format: "pdf",
    category: "gst",
    document_key: "gst"
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
  const [selectedClientType, setSelectedClientType] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [generating, setGenerating] = useState({});
  const [generatedDocs, setGeneratedDocs] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const [generationSuccess, setGenerationSuccess] = useState(null);

  const client_type = [
    { id: 1, name: "GeM" },
    { id: 2, name: "Corporate" },
  ];

  // Months
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Check if all required fields are selected
  const isFormValid = selectedClientType && selectedClient && selectedMonth && selectedYear;

  // Fetch clients when client type changes
  useEffect(() => {
    const fetchClients = async () => {
      if (!selectedClientType) {
        setClients([]);
        setSelectedClient("");
        return;
      }

      try {
        setLoadingClients(true);
        setFetchError(null);
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("selected_company");
        
        if (!token) {
          setFetchError("No authentication token found");
          setClients([]);
          return;
        }

        if (!companyId) {
          setFetchError("No company selected");
          setClients([]);
          return;
        }

        const apiUrl = new URL(`${API_BASE}/client/empl/view`);
        apiUrl.searchParams.append("client_type", selectedClientType);
        apiUrl.searchParams.append("company_id", companyId);

        console.log("Fetching clients from:", apiUrl.toString());

        const res = await fetch(apiUrl.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          mode: "cors",
          credentials: "same-origin",
        });

        console.log("Response status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error Response:", errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log("API Response:", result);

        if (result?.status && Array.isArray(result.data)) {
          const options = result.data.map((c) => ({
            value: c.id,
            label: c.contract_no && c.customer_name || `Client ${c.id}`,
            customer_name: c.customer_name,
            contract_no: c.contract_no,
            ...c,
          }));
          setClients(options);
        } else {
          console.warn("Unexpected API response structure:", result);
          setClients([]);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        setFetchError(`Failed to load clients: ${error.message}`);
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, [selectedClientType]);

  // Fetch client details when client is selected
  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!selectedClient) {
        setClientDetails(null);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("selected_company");
        
        if (!token || !companyId) return;

        const apiUrl = new URL(`${API_BASE}/client/details/${selectedClient}`);
        apiUrl.searchParams.append("company_id", companyId);

        console.log("Fetching client details from:", apiUrl.toString());

        const res = await fetch(apiUrl.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log("Client Details Response:", result);

        if (result?.status && result.data) {
          setClientDetails(result.data);
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      }
    };

    fetchClientDetails();
  }, [selectedClient]);

  // Filter items based on selected category and search term
  const filteredItems = billingItems.filter(item => {
    // Category filter
    if (selectedCategory !== "All") {
      const categoryMap = {
        "Covering Letter": "letter",
        "Bill": "bill",
        "EPF": "epf",
        "ESIC": "esic",
        "Wages Sheet": "wages",
        "Payment Proof": "payment",
        "GST": "gst"
      };
      if (item.category !== categoryMap[selectedCategory]) return false;
    }
    
    // Search filter
    if (searchTerm) {
      return item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.desc.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  // Call generate document API
  const callGenerateAPI = async (documentKeys) => {
    try {
      setGenerationError(null);
      setGenerationSuccess(null);
      
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("selected_company");
      
      if (!token || !companyId) {
        throw new Error("Authentication token or company ID not found");
      }

      // Find the selected client details
      const selectedClientData = clients.find(c => c.value === parseInt(selectedClient));
      
      const requestBody = {
        client_type: selectedClientType,
        client_id: parseInt(selectedClient),
        client_name: selectedClientData?.customer_name || "",
        month: selectedMonth,
        year: parseInt(selectedYear),
        documents: documentKeys
      };

      console.log("Calling generate document API with body:", requestBody);
// https://green-owl-255815.hostingersite.com/api/bill-process
      const response = await fetch(`${API_BASE}/bill-process`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Generate API Error Response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Generate API Response:", result);

      if (result?.success) {
        setGenerationSuccess("Documents generated successfully!");
        return result;
      } else {
        throw new Error(result?.message || "Failed to generate documents");
      }
    } catch (error) {
      console.error("Error generating documents:", error);
      setGenerationError(error.message);
      throw error;
    }
  };

  // Generate single document
  const handleGenerate = async (itemId) => {
    if (!isFormValid) {
      alert("Please select client type, client, month, and year first");
      return;
    }

    const item = billingItems.find(i => i.id === itemId);
    if (!item) return;

    setGenerating(prev => ({ ...prev, [itemId]: true }));
    
    try {
      // Call API with single document key
      const result = await callGenerateAPI([item.document_key]);
      
      // Update generated docs state on success
      setGeneratedDocs(prev => ({ 
        ...prev, 
        [itemId]: {
          id: itemId,
          generatedAt: new Date().toISOString(),
          fileName: `${item.title.replace(/\s+/g, '_')}_${Date.now()}.${item.format}`,
          size: result.file_size || Math.floor(Math.random() * 500) + 100 + " KB",
          downloadUrl: result.download_url,
          clientDetails: clientDetails
        }
      }));
    } catch (error) {
      // Error is already handled in callGenerateAPI
      console.error("Generation failed:", error);
    } finally {
      setGenerating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Generate all documents
  const handleGenerateAll = async () => {
    if (!isFormValid) {
      alert("Please select client type, client, month, and year first");
      return;
    }

    const allIds = filteredItems.map(item => item.id);
    const allDocumentKeys = filteredItems.map(item => item.document_key);
    
    const generatingState = {};
    allIds.forEach(id => { generatingState[id] = true; });
    setGenerating(generatingState);
    
    try {
      // Call API with all document keys
      const result = await callGenerateAPI(allDocumentKeys);
      
      // Update generated docs state on success
      const newGeneratedDocs = {};
      allIds.forEach((id, index) => {
        const item = billingItems.find(i => i.id === id);
        newGeneratedDocs[id] = {
          id,
          generatedAt: new Date().toISOString(),
          fileName: `${item.title.replace(/\s+/g, '_')}_${Date.now()}.${item.format}`,
          size: result.file_sizes?.[index] || Math.floor(Math.random() * 500) + 100 + " KB",
          downloadUrl: result.download_urls?.[index],
          clientDetails: clientDetails
        };
      });
      
      setGeneratedDocs(prev => ({ ...prev, ...newGeneratedDocs }));
    } catch (error) {
      console.error("Bulk generation failed:", error);
    } finally {
      setGenerating({});
    }
  };

  return (
    <div className='main-content'>
      <div className='row'>
        <div className="col-12">
          <div className="card">
            
            {/* Bill Process Header */}
            <div className="card-header bg-white border-0 pt-4 d-flex justify-content-between align-items-center">
              <h4 className="fw-bold mb-0">Bill Process</h4>
              {/* Search */}
              <div className="col-lg-3">
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
            </div>

            {/* Filters Section */}
            <div className="px-4 pb-3">
              <div className="row g-3 align-items-end">
                {/* Select Client Type */}
                <div className="col-lg-2">
                  <label className="form-label fw-semibold mb-1">Select Client Type</label>
                  <select 
                    className="form-control"
                    value={selectedClientType}
                    onChange={(e) => {
                      setSelectedClientType(e.target.value);
                      setSelectedClient(""); // Reset client when type changes
                      setClientDetails(null);
                    }}
                  >
                    <option value="" className=" ps-2">Select Client Type</option>
                    {client_type.map(client_type => (
                      <option key={client_type.id} value={client_type.name} className=" ps-2">{client_type.name}</option>
                    ))}
                  </select>
                </div>

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
                      disabled={!selectedClientType || loadingClients}
                    >
                      <option value="">
                        {loadingClients ? "Loading clients..." : "Select Client"}
                      </option>
                      {clients.map(client => (
                        <option key={client.value} value={client.value}>
                          {client.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {fetchError && (
                    <small className="text-danger mt-1 d-block">{fetchError}</small>
                  )}
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

                {/* Generate All Button */}
                <div className="col-lg-2">
                  <button 
                    className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${
                      isFormValid ? 'btn-primary' : 'btn-secondary'
                    }`}
                    onClick={handleGenerateAll}
                    disabled={!isFormValid || Object.values(generating).some(v => v)}
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

              {/* Success/Error Messages */}
              {generationError && (
                <div className="alert alert-danger mt-3 py-2" role="alert">
                  <FaTimes className="me-2" />
                  {generationError}
                </div>
              )}
              
              {generationSuccess && (
                <div className="alert alert-success mt-3 py-2" role="alert">
                  <FaCheck className="me-2" />
                  {generationSuccess}
                </div>
              )}

              {/* Client Details Display (if selected) */}
              {clientDetails && (
                <div className="mt-3 p-3 bg-light rounded">
                  <h6 className="fw-semibold mb-2">Client Details:</h6>
                  <pre className="mb-0 small">
                    {JSON.stringify(clientDetails, null, 2)}
                  </pre>
                </div>
              )}

              {/* Filter Categories */}
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

            {/* Cards Grid */}
            <div className="card-body pt-0">
              {!isFormValid ? (
                <div className="text-center py-5">
                  <p className="text-muted">
                    Please select client type, client, month, and year to generate documents
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
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
                              <small className="text-muted">Key: {item.document_key}</small>
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

                          {/* Generated info */}
                          {generatedDocs[item.id] && (
                            <div className="mt-2 small text-success">
                              <FaCheck className="me-1" />
                              Generated
                              {generatedDocs[item.id].downloadUrl && (
                                <a 
                                  href={generatedDocs[item.id].downloadUrl} 
                                  className="ms-2 text-primary"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaDownload size={12} />
                                </a>
                              )}
                            </div>
                          )}
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
                          <small className="text-muted">Key: {item.document_key}</small>
                          {generatedDocs[item.id] && (
                            <span className="small text-success d-block">
                              <FaCheck className="me-1" />
                              Generated
                              {generatedDocs[item.id].downloadUrl && (
                                <a 
                                  href={generatedDocs[item.id].downloadUrl} 
                                  className="ms-2 text-primary"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaDownload size={12} />
                                </a>
                              )}
                            </span>
                          )}
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

              {filteredItems.length === 0 && isFormValid && (
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
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default Page;