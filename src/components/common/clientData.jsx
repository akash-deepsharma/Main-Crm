
'use client'
import { da } from 'date-fns/locale';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { FiUsers, FiFileText, FiUserCheck } from 'react-icons/fi';

const ClientData = () => {
    const [stats, setStats] = useState([
        { label: 'Total Clients', value: 0, icon: FiUsers, bsIconClass: 'text-primary' },
        { label: 'Active Contracts', value: 0, icon: FiFileText, bsIconClass: 'text-success' },
        { label: 'Deployed Staff', value: 0, icon: FiUserCheck, bsIconClass: 'text-purple' },
        { label: 'Monthly Revenue', value: '₹0', icon: FaIndianRupeeSign, bsIconClass: 'text-warning' },
    ]);
            const searchParams = useSearchParams();
            const type = searchParams.get("type");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const storedCompanyRaw = localStorage.getItem("selected_company");
                console.log(localStorage.getItem("selected_company"));
                const token = localStorage.getItem("token");

                if (!storedCompanyRaw || !token) {
                    console.log("Company or token missing");
                    return;
                }

                const storedCompany = JSON.parse(storedCompanyRaw);
                const companyId =  storedCompany;

                if (!companyId) {
                    console.log("Company ID undefined");
                    return;
                }

                const response = await fetch(
                `https://green-owl-255815.hostingersite.com/api/client-data?company_id=${companyId}&client_type=${type}`,
                {
                    method: "GET",
                    headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    },
                }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                console.log("client data", data);

                setStats([
                    { label: 'Total Clients', value: data.total_clients || 0, icon: FiUsers, bsIconClass: 'text-primary' },
                    { label: 'Active Contracts', value: data.active_clients || 0, icon: FiFileText, bsIconClass: 'text-success' },
                    { label: 'Deployed Staff', value: data.total_deployed_staff || 0, icon: FiUserCheck, bsIconClass: 'text-purple' },
                    { label: 'Monthly Revenue', value: `₹${data.total_salary || 0}`, icon: FaIndianRupeeSign, bsIconClass: 'text-warning'},
                ]);

            } catch (error) {
                console.error("Error fetching client data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, []);

    return (
        <div className="container-fluid py-4 px-4">
            <div className='card border-0 shadow-sm p-3 mb-1'>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h3 mb-1 text-dark">Client & Contract Management</h1>
                        <p className="text-secondary mb-0">Manage clients, contracts, and deployments</p>
                    </div>
                </div>

                {loading ? (
                    <p>Loading data...</p>
                ) : (
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
                )}

            </div>
        </div>
    );
};

export default ClientData;
