import React from 'react';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { FiUsers, FiFileText, FiUserCheck } from 'react-icons/fi';

const ClientData = () => {
    // Data array for easy mapping and updates
    const stats = [
        { label: 'Total Clients', value: 5, icon: FiUsers, bgColor: 'bg-primary-light', iconColor: 'text-primary', bsIconClass: 'text-primary' },
        { label: 'Active Contracts', value: 12, icon: FiFileText, bgColor: 'bg-success-light', iconColor: 'text-success', bsIconClass: 'text-success' },
        { label: 'Deployed Staff', value: 347, icon: FiUserCheck, bgColor: 'bg-purple-light', iconColor: 'text-purple', bsIconClass: 'text-purple' },
        { label: 'Monthly Revenue', value: '₹55.8L', icon: FaIndianRupeeSign, bgColor: 'bg-warning-light', iconColor: 'text-warning', bsIconClass: 'text-warning' },
    ];

    return (
        <div className="container-fluid py-4 px-4">
            <div className='card border-0 shadow-sm p-3 mb-1'>

            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-dark">Client & Contract Management</h1>
                    <p className="text-secondary mb-0">Manage clients, contracts, and deployments</p>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="row g-4">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={index} className="col-12 col-sm-6 col-lg-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <p className="text-secondary small fw-medium mb-1">{stat.label}</p>
                                            <h2 className="h3 fw-bold text-dark mb-0">{stat.value}</h2>
                                        </div>
                                        <div className={`p-3 bg-light rounded-3 ${stat.bsIconClass}`}>
                                            <IconComponent size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            </div>
        </div>
    );
};

export default ClientData;