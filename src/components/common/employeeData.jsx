import React from 'react';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { FiUsers, FiFileText, FiUserCheck, FiDollarSign, FiPlus, FiUserMinus } from 'react-icons/fi';

const EmployeeData = () => {
    // Data array for easy mapping and updates
    const stats = [
        { label: 'Total Employees', value: 15, icon: FiUsers, bgColor: 'bg-primary-light', iconColor: 'text-primary', bsIconClass: 'text-primary' },
        { label: 'Active Employees', value: 12, icon: FiUserCheck, bgColor: 'bg-success-light', iconColor: 'text-success', bsIconClass: 'text-success' },
        { label: 'On Leave', value: 3, icon: FiUserMinus, bgColor: 'bg-purple-light', iconColor: 'text-danger', bsIconClass: 'text-danger' },
        { label: 'Avg. Monthly Wage', value: '₹55.8L', icon: FaIndianRupeeSign, bgColor: 'bg-warning-light', iconColor: 'text-warning', bsIconClass: 'text-warning' },
    ];

    return (
        <div className="container-fluid py-4 px-4">
            <div className='card border-0 shadow-sm p-3 mb-1'>
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-dark">Employee Management</h1>
                    <p className="text-secondary mb-0">Manage employee records and deployments</p>
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

export default EmployeeData;