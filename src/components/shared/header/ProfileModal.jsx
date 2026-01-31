import Image from 'next/image'
import React, { Fragment } from 'react'
import { FiActivity, FiBell, FiChevronRight, FiDollarSign, FiLogOut, FiSettings, FiUser } from "react-icons/fi"

const activePosition = ["Active", "Always", "Bussy", "Inactive", "Disabled", "Cutomization"]
const subscriptionsList = ["Plan", "Billings", "Referrals", "Payments", "Statements", "Subscriptions"]
const ProfileModal = () => {
    return (
        <div className="dropdown nxl-h-item">
            <a href="#" data-bs-toggle="dropdown" role="button" data-bs-auto-close="outside">
                <Image width={40} height={40} src="/images/avatar/1.png" alt="user-image" className="img-fluid user-avtar me-0" />
            </a>
            <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown">
                <div className="dropdown-header">
                    <div className="d-flex align-items-center">
                        <Image width={40} height={40} src="/images/avatar/1.png" alt="user-image" className="img-fluid user-avtar" />
                        <div>
                            <h6 className="text-dark mb-0">Alexandra Della <span className="badge bg-soft-success text-success ms-1">PRO</span></h6>
                            <span className="fs-12 fw-medium text-muted">alex.della@outlook.com</span>
                        </div>
                    </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown">
                    <a href="/subscription" className="dropdown-item" >
                        <span className="hstack">
                            <i className=" me-2"><FiDollarSign /></i>
                            <span>Subscriptions</span>
                        </span>
                    </a>
                </div>
                <div className="dropdown-divider"></div>
                <a href="/profile" className="dropdown-item">
                    <i ><FiUser /></i>
                    <span>Profile Details</span>
                </a>
                <a href="/billing-information" className="dropdown-item">
                    <i ><FiDollarSign /></i>
                    <span>Billing Details</span>
                </a>
                <a href="/company" className="dropdown-item">
                    <i ><FiDollarSign /></i>
                    <span>Company</span>
                </a>
                <a href="#" className="dropdown-item">
                    <i><FiBell /></i>
                    <span>Notifications</span>
                </a>
                <div className="dropdown-divider"></div>
                <a href="/authentication/login/creative" className="dropdown-item">
                    <i> <FiLogOut /></i>
                    <span>Logout</span>
                </a>
            </div>
        </div>
    )
}

export default ProfileModal

const getColor = (item) => {
    switch (item) {
        case "Always":
            return "always_clr"
        case "Bussy":
            return "bussy_clr"
        case "Inactive":
            return "inactive_clr"
        case "Disabled":
            return "disabled_clr"
        case "Cutomization":
            return "cutomization_clr"
        default:
            return "active-clr";
    }
}