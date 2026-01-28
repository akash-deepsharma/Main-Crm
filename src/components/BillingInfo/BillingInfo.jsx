'use client'
import React, { useState, useEffect } from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { currencyOptionsData } from '@/utils/fackData/currencyOptionsData'
import { FiCamera, FiInfo, FiDownload, FiEye, FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import { BsCreditCardFill, BsPaypal, BsReceipt } from 'react-icons/bs'
import { FaCcAmex, FaCcDinersClub, FaCcDiscover, FaCcJcb, FaCcMastercard, FaCcVisa, FaHistory } from 'react-icons/fa'
import DatePicker from 'react-datepicker'
import useDatePicker from '@/hooks/useDatePicker'
import useImageUpload from '@/hooks/useImageUpload'
import topTost from '@/utils/topTost'
import Dropdown from '@/components/shared/Dropdown'

const BillingInfo = () => {
    const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker();
    const { handleImageUpload, uploadedImage } = useImageUpload()
    const [selectedOption, setSelectedOption] = useState(null)
    const [activeTab, setActiveTab] = useState('transactions') // 'info' or 'transactions'
    
    // Billing Information State
    const [billingInfo, setBillingInfo] = useState({
        companyName: '',
        companyPhone: '',
        companyEmail: '',
        companyAddress: '',
        companyPan: '',
        companyTan: '',
        companyGst: '',
        bankName: '',
        bankBranch: '',
        bankIFSC: '',
        bankAccount: '',
        aboutCompany: '',
        billingCycle: 'monthly',
        paymentMethod: 'credit-card',
        currency: 'USD',
        vatNumber: '',
        taxId: '',
        invoicePrefix: 'INV',
        nextInvoiceNumber: 1001,
        autoGenerateInvoices: false,
        sendReminders: true,
        reminderDays: 7
    });

    // Transaction History State
    const [transactions, setTransactions] = useState([
        {
            id: 'TRX-2023-001',
            date: '2023-10-15',
            description: 'Premium Subscription Plan - 1 Year',
            amount: 999.00,
            status: 'completed',
            paymentMethod: 'credit-card',
            invoiceNumber: 'INV-2023-001',
            package: 'Premium',
            duration: '1 Year',
            features: ['Unlimited Users', 'Advanced Analytics', 'Priority Support']
        },
        {
            id: 'TRX-2023-002',
            date: '2023-09-15',
            description: 'Business Plan Renewal - Monthly',
            amount: 299.00,
            status: 'completed',
            paymentMethod: 'paypal',
            invoiceNumber: 'INV-2023-002',
            package: 'Business',
            duration: 'Monthly',
            features: ['Up to 50 Users', 'Basic Analytics', 'Email Support']
        },
        {
            id: 'TRX-2023-003',
            date: '2023-08-15',
            description: 'Basic Plan Upgrade',
            amount: 499.00,
            status: 'pending',
            paymentMethod: 'bank-transfer',
            invoiceNumber: 'INV-2023-003',
            package: 'Basic',
            duration: 'Quarterly',
            features: ['Up to 10 Users', 'Basic Reports', 'Community Support']
        },
        {
            id: 'TRX-2023-004',
            date: '2023-07-15',
            description: 'Enterprise Custom Package',
            amount: 2499.00,
            status: 'completed',
            paymentMethod: 'credit-card',
            invoiceNumber: 'INV-2023-004',
            package: 'Enterprise',
            duration: 'Custom',
            features: ['Unlimited Users', 'Custom Features', 'Dedicated Support', 'White-label']
        },
        {
            id: 'TRX-2023-005',
            date: '2023-06-15',
            description: 'Add-on: Additional Storage (2TB)',
            amount: 199.00,
            status: 'failed',
            paymentMethod: 'credit-card',
            invoiceNumber: 'INV-2023-005',
            package: 'Add-on',
            duration: '1 Month',
            features: ['2TB Storage', 'Data Backup']
        }
    ]);

    const paymentMethods = [
        { value: 'credit-card', label: 'Credit Card', icon: <BsCreditCardFill /> },
        { value: 'paypal', label: 'PayPal', icon: <BsPaypal /> },
        { value: 'bank-transfer', label: 'Bank Transfer' },
        { value: 'cash', label: 'Cash' }
    ];

    const billingCycles = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'yearly', label: 'Yearly' }
    ];

    const currencies = [
        { value: 'USD', label: 'USD - US Dollar' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'GBP', label: 'GBP - British Pound' },
        { value: 'INR', label: 'INR - Indian Rupee' }
    ];

    const packages = [
        { value: 'basic', label: 'Basic Plan', price: '$49/month' },
        { value: 'business', label: 'Business Plan', price: '$199/month' },
        { value: 'premium', label: 'Premium Plan', price: '$499/month' },
        { value: 'enterprise', label: 'Enterprise', price: 'Custom' }
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' }
    ];

    const [filters, setFilters] = useState({
        status: 'all',
        dateFrom: '',
        dateTo: '',
        search: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBillingInfo(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setBillingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Billing Info:', billingInfo);
        topTost('Billing information saved successfully!', 'success');
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="badge bg-success"><FiCheck className="me-1" /> Completed</span>;
            case 'pending':
                return <span className="badge bg-warning">Pending</span>;
            case 'failed':
                return <span className="badge bg-danger"><FiX className="me-1" /> Failed</span>;
            default:
                return <span className="badge bg-secondary">{status}</span>;
        }
    };

    const getPackageColor = (pkg) => {
        switch (pkg.toLowerCase()) {
            case 'premium':
                return 'border-start border-4 border-primary';
            case 'business':
                return 'border-start border-4 border-success';
            case 'enterprise':
                return 'border-start border-4 border-warning';
            case 'basic':
                return 'border-start border-4 border-info';
            default:
                return 'border-start border-4 border-secondary';
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (filters.status !== 'all' && transaction.status !== filters.status) return false;
        if (filters.dateFrom && new Date(transaction.date) < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && new Date(transaction.date) > new Date(filters.dateTo)) return false;
        if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

    const downloadInvoice = (invoiceNumber) => {
        topTost(`Downloading invoice: ${invoiceNumber}`, 'info');
        // Add actual download logic here
    };

    const viewTransactionDetails = (transaction) => {
        // Implement modal or detailed view
        console.log('View transaction:', transaction);
        topTost(`Viewing details for ${transaction.id}`, 'info');
    };

    const totalSpent = transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <>
            <div className="col-xl-10">
                {/* Tabs Navigation */}
                <div className="card mb-4">
                    <div className="card-body p-3">
                        <ul className="nav nav-tabs" role="tablist">
                            
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('transactions')}
                                >
                                    <FaHistory className="me-2" />
                                    Transaction History
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

               

                {/* Transaction History Tab */}
                {activeTab === 'transactions' && (
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-0">Transaction History</h5>
                                    <p className="text-muted mb-0">View and manage your billing transactions</p>
                                </div>
                                <div className="text-end">
                                    <div className="d-flex align-items-center">
                                        <span className="me-3">Total Spent:</span>
                                        <h4 className="text-primary mb-0">${totalSpent.toFixed(2)}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {/* Filters */}
                            <div className="row mb-4">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-control"
                                            name="status"
                                            value={filters.status}
                                            onChange={handleFilterChange}
                                        >
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="form-label">From Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="dateFrom"
                                            value={filters.dateFrom}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="form-label">To Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="dateTo"
                                            value={filters.dateTo}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="form-label">Search</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search transactions..."
                                            name="search"
                                            value={filters.search}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Cards */}
                            <div className="row">
                                {filteredTransactions.map((transaction) => (
                                    <div key={transaction.id} className="col-md-6 mb-4">
                                        <div className={`card ${getPackageColor(transaction.package)}`}>
                                            <div className="card-header bg-light">
                                                <div className="w-100 d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="mb-1">{transaction.package} Package</h6>
                                                        <small className="text-muted">Transaction ID: {transaction.id}</small>
                                                    </div>
                                                    <div>
                                                        {getStatusBadge(transaction.status)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row mb-3">
                                                    <div className="col-6">
                                                        <small className="text-muted d-block">Date</small>
                                                        <strong>{new Date(transaction.date).toLocaleDateString()}</strong>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted d-block">Amount</small>
                                                        <h5 className="text-primary mb-0">${transaction.amount.toFixed(2)}</h5>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <small className="text-muted d-block">Description</small>
                                                    <p className="mb-0">{transaction.description}</p>
                                                </div>

                                                <div className="mb-3">
                                                    <small className="text-muted d-block">Package Details</small>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <span className="badge bg-light text-dark me-2">{transaction.duration}</span>
                                                            <span className="badge bg-light text-dark">Invoice: {transaction.invoiceNumber}</span>
                                                        </div>
                                                        <div>
                                                            <span className="badge bg-info">
                                                                {transaction.paymentMethod === 'credit-card' && <BsCreditCardFill className="me-1" />}
                                                                {transaction.paymentMethod === 'paypal' && <BsPaypal className="me-1" />}
                                                                {transaction.paymentMethod}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {transaction.features && transaction.features.length > 0 && (
                                                    <div className="mb-3">
                                                        <small className="text-muted d-block mb-1">Package Features:</small>
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {transaction.features.map((feature, idx) => (
                                                                <span key={idx} className="badge bg-light text-dark">
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <div>
                                                        <small className="text-muted">Last updated: {new Date(transaction.date).toLocaleDateString()}</small>
                                                    </div>
                                                    <div className="btn-group">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => viewTransactionDetails(transaction)}
                                                        >
                                                            <FiEye className="me-1" /> View
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => downloadInvoice(transaction.invoiceNumber)}
                                                        >
                                                            <FiDownload className="me-1" /> Invoice
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Stats */}
                            {filteredTransactions.length > 0 && (
                                <div className="row mt-4">
                                    <div className="col-12">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <div className="row text-center">
                                                    <div className="col-md-3 mb-3 mb-md-0">
                                                        <h4 className="text-primary">{filteredTransactions.length}</h4>
                                                        <small className="text-muted">Total Transactions</small>
                                                    </div>
                                                    <div className="col-md-3 mb-3 mb-md-0">
                                                        <h4 className="text-success">
                                                            {filteredTransactions.filter(t => t.status === 'completed').length}
                                                        </h4>
                                                        <small className="text-muted">Completed</small>
                                                    </div>
                                                    <div className="col-md-3 mb-3 mb-md-0">
                                                        <h4 className="text-warning">
                                                            {filteredTransactions.filter(t => t.status === 'pending').length}
                                                        </h4>
                                                        <small className="text-muted">Pending</small>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <h4 className="text-danger">
                                                            {filteredTransactions.filter(t => t.status === 'failed').length}
                                                        </h4>
                                                        <small className="text-muted">Failed</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* No Results */}
                            {filteredTransactions.length === 0 && (
                                <div className="text-center py-5">
                                    <div className="display-4 text-muted mb-3">
                                        <BsReceipt />
                                    </div>
                                    <h4 className="mb-3">No transactions found</h4>
                                    <p className="text-muted">Try adjusting your filters to find what you're looking for.</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setFilters({
                                            status: 'all',
                                            dateFrom: '',
                                            dateTo: '',
                                            search: ''
                                        })}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default BillingInfo