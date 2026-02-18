"use client";

import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import { FiMinus } from "react-icons/fi";
import { useRouter } from 'next/navigation';

const documentOptions = [
    "ESIC Challan",
    "EPF / ESR",
    "Payed Challan",
    "Esi Contribution",
    "Esic Payed Recipt",
    "Gst Challen",
    "Other",
];

const API_BASE = 'https://green-owl-255815.hostingersite.com/api';

const TabAttachement = forwardRef(({ error, setError, employeeId, clientType }, ref) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedDocType, setSelectedDocType] = useState(""); // Add state for document type select

    // Fetch clients whenever clientType changes
    useEffect(() => {
        if (clientType) {
            console.log("clientType changed to:", clientType);
           
            setSelectedDocs([]);
            setSelectedClient(null);
            setClients([]);
            
            fetchClients();
        }
    }, [clientType]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setSelectedDocs([]);
            setSelectedClient(null);
        };
    }, []);

    // Fetch clients from API
    const fetchClients = async () => {
        try {
            setLoadingClients(true);
            const token = localStorage.getItem("token");
            const companyId = localStorage.getItem("selected_company");
            
            if (!token) {
                console.error("No token found in localStorage");
                setClients([]);
                return;
            }

            if (!companyId) {
                console.error("No company ID found in localStorage");
                setClients([]);
                return;
            }

            // Construct URL with proper encoding
            const apiUrl = new URL(`${API_BASE}/client/empl/view`);
            apiUrl.searchParams.append("client_type", clientType);
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
                    label: c.contract_no || c.customer_name || `Client ${c.id}`,
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
            setClients([]);
            alert(`Failed to load clients: ${error.message}. Please check your connection and try again.`);
        } finally {
            setLoadingClients(false);
        }
    };

    const availableOptions = documentOptions.filter(
        (doc) => !selectedDocs.find((d) => d.type === doc)
    );

    const handleSelectDoc = (docType, file) => {
        if (!docType || !file) return;

        const icon = getIconByFile(file);
        setSelectedDocs([...selectedDocs, { type: docType, file, icon }]);
        setSelectedDocType(""); // Reset the document type select
        if (setError) setError(false);
    };

    const handleRemoveDoc = (type) => {
        setSelectedDocs(selectedDocs.filter((d) => d.type !== type));
    };

    const handleSaveAttachments = async () => {
        const token = localStorage.getItem("token");
        
        if (!selectedClient) {
            alert("Please select a client first");
            if (setError) setError(true);
            return false;
        }

        if (selectedDocs.length === 0) {
            alert("Please upload at least one document");
            if (setError) setError(true);
            return false;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("client_id", selectedClient.id);
            formData.append("client_name", selectedClient.customer_name);
            formData.append("client_type", clientType);

            selectedDocs.forEach((doc, index) => {
                formData.append(`documents[${index}][type]`, doc.type);
                formData.append(`documents[${index}][file]`, doc.file);
            });

            console.log("formData entries:", Array.from(formData.entries()));

            const response = await fetch(`${API_BASE}/client/akash`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (result?.status === true || result?.status === 'true') {
                console.log("Documents saved successfully", result);
                setSelectedDocs([]);
                setSelectedClient(null);
                if (setError) setError(false);
                return true;
            } else {
                if (result?.errors) {
                    const errorMessages = Object.values(result.errors).flat().join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(result?.message || "Document upload failed");
            }
        } catch (err) {
            console.error("Error uploading documents:", err);
            alert(err.message);
            if (setError) setError(true);
            return false;
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        submit: handleSaveAttachments,
    }));

    const handleFileChange = (e) => {
        const docType = selectedDocType; // Use state instead of DOM lookup
        const file = e.target.files[0];

        if (!docType) {
            alert("Please select a document type first");
            e.target.value = null;
            return;
        }

        if (!file) return;

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert("File size exceeds 5MB limit");
            e.target.value = null;
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG, and PDF files are allowed");
            e.target.value = null;
            return;
        }

        if (selectedDocs.find(d => d.type === docType)) {
            alert(`"${docType}" has already been added. Please select a different document type.`);
            e.target.value = null;
            return;
        }

        handleSelectDoc(docType, file);
        e.target.value = null;
    };

    const handleSelectChange = (e) => {
        setSelectedDocType(e.target.value);
    };

    const handleClientChange = (e) => {
        const selectedValue = e.target.value;
        
        // If there are selected documents, confirm before switching
        if (selectedDocs.length > 0 && selectedValue) {
            const confirmSwitch = window.confirm(
                "Changing client will clear all uploaded documents. Are you sure you want to continue?"
            );
            
            if (!confirmSwitch) {
                // Reset the select to previous value
                e.target.value = selectedClient?.id || "";
                return;
            }
        }
        
        if (!selectedValue) {
            setSelectedClient(null);
            setSelectedDocs([]);
            return;
        }
        
        const selectedClientData = clients.find(c => c.value === parseInt(selectedValue));
        setSelectedClient({
            id: selectedValue,
            customer_name: selectedClientData?.customer_name,
            ...selectedClientData
        });
        setSelectedDocs([]);
        console.log("Selected client:", selectedClientData);
    };

    return (
        <section className="step-body body stepChange mt-4">
            <div>
                <div className="mb-5">
                    <h2 className="fs-16 fw-bold">Attachment Files</h2>
                    <p className="text-muted">
                        Employee documents and attachments
                    </p>
                </div>

                <div className="mb-4">
                    <label className="form-label">Select Client & Upload Documents</label>

                    <div className="row">
                        <div className="col-lg-12 mb-3">
                            <select 
                                className="form-select" 
                                id="clientSelect"
                                style={{ cursor: "pointer" }}
                                onChange={handleClientChange}
                                disabled={loadingClients}
                                value={selectedClient?.id || ""} // Controlled component - only value, no defaultValue
                            >
                                <option value="" disabled>
                                    {loadingClients ? "Loading clients..." : "Select client"}
                                </option>
                                {clients.map((client) => (
                                    <option key={client.value} value={client.value}>
                                        {client.customer_name} {client.contract_no ? `(${client.contract_no})` : ''}
                                    </option>
                                ))}
                            </select>
                            {loadingClients && (
                                <div className="mt-2">
                                    <small className="text-muted">
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        Loading clients...
                                    </small>
                                </div>
                            )}
                            {selectedClient && (
                                <div className="mt-2 text-success">
                                    <small>
                                        <strong>Selected Client:</strong> {selectedClient.customer_name} (ID: {selectedClient.id})
                                    </small>
                                </div>
                            )}
                        </div>
                        
                        <div className="col-lg-6 mb-3">
                            <select 
                                className="form-select" 
                                id="documentSelect"
                                style={{ cursor: "pointer" }}
                                onChange={handleSelectChange}
                                disabled={!selectedClient}
                                value={selectedDocType} // Controlled component - only value, no defaultValue
                            >
                                <option value="" disabled>
                                    {selectedClient ? "Select Document Type" : "Please select a client first"}
                                </option>
                                {availableOptions.map((doc, idx) => (
                                    <option key={idx} value={doc}>
                                        {doc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <input
                                type="file"
                                className="form-control"
                                name="uploadDocument"
                                id="choose-file"
                                style={{ cursor: "pointer" }}
                                onChange={handleFileChange}
                                disabled={!selectedClient}
                            />
                            <small className="text-muted">
                                Allowed: JPG, PNG, PDF | Max: 5MB
                            </small>
                        </div>
                    </div>

                    <div className="alert alert-info mt-3">
                        <small>
                            <strong>Note:</strong> Each document type can only be uploaded once. Please select a client before uploading documents. Changing client will clear all uploaded documents.
                        </small>
                    </div>
                </div>

                {selectedDocs.length > 0 ? (
                    <>
                        <h4 className="fs-14 fw-bold mb-3">Documents Ready for Upload ({selectedDocs.length})</h4>
                        <div className="row">
                            {selectedDocs.map((doc, index) => (
                                <AttachmentCard
                                    key={index}
                                    title={doc.type}
                                    file={doc.file}
                                    iconSrc={doc.icon}
                                    onRemove={() => handleRemoveDoc(doc.type)}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="alert alert-warning">
                        No documents uploaded yet. Please select a client, then select document type and upload file.
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger mt-3">
                        <FiMinus className="me-2" /> Please select a client and upload required documents
                    </div>
                )}

                {loading && (
                    <div className="mt-4">
                        <div className="d-flex align-items-center mb-2">
                            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-info mb-0">Uploading documents... Please wait.</p>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                            <div 
                                className="progress-bar progress-bar-striped progress-bar-animated" 
                                style={{ width: '100%' }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
});

TabAttachement.displayName = "TabAttachement";

const getIconByFile = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    const iconMap = {
        'pdf': "/images/file-icons/pdf.png",
        'png': "/images/file-icons/png.png",
        'jpg': "/images/file-icons/jpg.png",
        'jpeg': "/images/file-icons/jpg.png",
        'doc': "/images/file-icons/doc.png",
        'docx': "/images/file-icons/doc.png",
        'txt': "/images/file-icons/doc.png"
    };
    return iconMap[ext] || "/images/file-icons/file.png";
};

const AttachmentCard = ({ title, file, iconSrc, onRemove }) => {
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card border hover-shadow h-100">
                <div className="card-body p-3 position-relative d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                        <div className="flex-shrink-0">
                            <img 
                                src={iconSrc} 
                                className="img-fluid wd-60 ht-60 rounded" 
                                alt={title}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/file-icons/file.png";
                                }}
                            />
                        </div>
                        <div className="flex-grow-1 ms-3">
                            <h6 className="fs-13 mb-1 fw-semibold text-truncate" title={title}>
                                {title}
                            </h6>
                            <small className="text-muted d-block">
                                Size: {formatFileSize(file.size)}
                            </small>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <small className="text-truncate d-block mb-2" title={file.name}>
                            <i className="bi bi-file-earmark me-1"></i>
                            {file.name}
                        </small>
                        <button
                            type="button"
                            className="btn btn-sm btn-danger w-100"
                            onClick={onRemove}
                        >
                            <FiMinus className="me-1" /> Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabAttachement;