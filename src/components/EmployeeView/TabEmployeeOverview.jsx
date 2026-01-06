'use client'
import React, { useState } from 'react'
import { FiBarChart2, FiCalendar, FiCheckCircle, FiClock, FiLink2 } from 'react-icons/fi'
import ImageGroup from '@/components/shared/ImageGroup'
import dynamic from 'next/dynamic'
import { FaEye } from 'react-icons/fa'

export const imageList = [
    {
        id: 1,
        user_name: "Janette Dalton",
        user_img: "/images/avatar/2.png"
    },
    {
        id: 2,
        user_name: "Mikal Bon",
        user_img: "/images/avatar/3.png"
    },
    {
        id: 3,
        user_name: "Socrates Itumay",
        user_img: "/images/avatar/4.png"
    },
    {
        id: 4,
        user_name: "Jakson Jak",
        user_img: "/images/avatar/6.png"
    },
    {
        id: 5,
        user_name: "Socrates Itumay",
        user_img: "/images/avatar/5.png"
    },
]
const TabProjectOverview = ( data) => {
    const [show, setShow] = useState(false);
           const [fileUrl, setFileUrl] = useState("");
        
           const handleViewDocument = (url) => {
               setFileUrl(url);
               setShow(true);
           };

const employeeData = data?.data;
    return (
        <>
        <div className="tab-pane fade active show" id="overviewTab">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-body task-header d-md-flex align-items-center justify-content-between">
                            <div className="me-4">
                                <h4 className="mb-0 fw-bold d-flex">
                                    <span className="text-truncate-1-line">{employeeData?.name}  || {employeeData?.company?.company_name}
                                         <span className="badge bg-soft-primary text-primary mx-3">Replaceable</span>
                                         </span>
                                </h4>
                            </div>
                            <div className="mt-4 mt-md-0">
                                <div className="d-flex gap-2">
                                    <a href="#" className="btn btn-icon" data-toggle="tooltip" data-title="Make as Complete">
                                        <FiCheckCircle size={16} />
                                    </a>
                                    <a href="#" className="btn btn-icon" data-toggle="tooltip" data-title="Timesheets">
                                        <FiCalendar size={16} />
                                    </a>
                                    <a href="#" className="btn btn-icon" data-toggle="tooltip" data-title="Statistics">
                                        <FiBarChart2 size={16} />
                                    </a>
                                    <a href="#" className="btn btn-success" data-toggle="tooltip" data-title="Timesheets">
                                        <FiClock size={16} className='me-2' />
                                        <span>Start Timer</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Employee Name</label>
                                    <p>{employeeData?.name}</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label"> Client Contract No</label>
                                    <p>{employeeData?.client?.contract_no}</p>
                                </div>
                               <div className="col-md-4 mb-2">
                                    <label className="form-label">Client</label>
                                    <p>{employeeData?.client?.customer_name}</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Consignee</label>
                                    <p>{employeeData?.consignee?.consignee_name}</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Designation </label>
                                    <p>{employeeData?.designation}</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Date Of Join </label>
                                    <p>01 Aug, 2025</p>
                                </div>
                                 <div className="col-md-4 mb-2">
                                    <label className="form-label">Date Of Birth </label>
                                    <p>{employeeData?.dateOfBirth}</p>
                                </div>
                                 <div className="col-md-4 mb-2">
                                    <label className="form-label">Gender </label>
                                    <p>{employeeData?.gender}</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Religion </label>
                                    <p>{employeeData?.religion}</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Marital status </label>
                                    <p>{employeeData?.maritalStatus}</p>
                                </div>
                                 <div className="col-md-4 mb-2">
                                    <label className="form-label">Spouse Name </label>
                                    <p>{employeeData?.religion}</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">No. Of Children </label>
                                    <p>{employeeData?.noOfChildren}</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Aadhar No </label>
                                    <p>{employeeData?.aadhar_no} <FaEye  onClick={() => handleViewDocument(`https://green-owl-255815.hostingersite.com/${employeeData?.aadhar_no_file}`)} style={{ cursor: "pointer", color: "blue" }} /></p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Pan Card No </label>
                                    <p>{employeeData?.pan_card} <FaEye  onClick={() => handleViewDocument(`https://green-owl-255815.hostingersite.com/${employeeData?.pan_card_file}`)} style={{ cursor: "pointer", color: "blue" }} /></p>
                                </div>
                                 <div className="col-md-4 mb-2">
                                    <label className="form-label">IP No </label>
                                    <p>{employeeData?.ipn_no}  <FaEye  onClick={() => handleViewDocument(`https://green-owl-255815.hostingersite.com/${employeeData?.ipn_file}`)("/images/gallery/pan-card.jpg")} style={{ cursor: "pointer", color: "blue" }} /></p>
                                </div>
                                 <div className="col-md-4 mb-2">
                                    <label className="form-label">UAN </label>
                                    <p>{employeeData?.uan_no}  <FaEye  onClick={() => handleViewDocument(`https://green-owl-255815.hostingersite.com/${employeeData?.uan_file}`)} style={{ cursor: "pointer", color: "blue" }} /></p>
                                </div>
                                 <div className="col-md-4 mb-2">
                                    <label className="form-label">Rent Agreement/ Electricity bill </label>
                                    <p>{employeeData?.rent_agreement}  <FaEye  onClick={() => handleViewDocument(`https://green-owl-255815.hostingersite.com/${employeeData?.rent_agreement_file}`)} style={{ cursor: "pointer", color: "blue" }} /></p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Police Verification </label>
                                    <p>{employeeData?.policeVerification}  <FaEye  onClick={() => handleViewDocument(`https://green-owl-255815.hostingersite.com/${employeeData?.policeVerification_file}`)} style={{ cursor: "pointer", color: "blue" }} /></p>
                                </div>
                                 
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4">
                    <div className="row">
                        <ContactCard
                            icon="feather-log-in"
                            color="primary"
                            title="Phone"
                            value={employeeData?.mobile_no}
                            col= "6"
                        />
                         <ContactCard
                            icon="feather-clipboard"
                            color="warning"
                            title="Email"
                            value={employeeData?.email}
                            col= "6"
                        />
                         <ContactCard
                            icon="feather-check"
                            color="success"
                            title="Address"
                            value={employeeData?.address}
                            col= "12"
                        />
                    </div>
                    <div className="row">
                        
                        <div className="col-xl-12 col-md-6">
                            <div className="card stretch stretch-full">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="fw-semibold">25 / 25 Days Left</div>
                                        <i className="text-success" ><FiCalendar size={16} /></i>
                                    </div>
                                    <div className="progress mt-2 ht-3">
                                        <div className="progress-bar bg-success" role="progressbar" style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        {/* ==== CUSTOM MODAL ==== */}
            {show && (
                <div style={backdropStyle} onClick={() => setShow(false)}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={headerStyle}>
                            <h4>Document Preview</h4>
                            <button style={closeBtn} onClick={() => setShow(false)}>✖</button>
                        </div>


                        <div style={contentWrapper}>
                            {fileUrl.toLowerCase().endsWith(".pdf") ? (
                                <embed
                                    src={fileUrl}
                                    type="application/pdf"
                                    style={pdfStyle}
                                />
                            ) : (
                                <img src={fileUrl} style={imgStyle} />
                            )}
                        </div>
                    </div>
                </div>
            )}
            </>

    )
}   

export default TabProjectOverview


const ContactCard = ({ city,state,country,title, color, value,col }) => {
    return (
        <div className={`col-xxl-${col} col-xl-12 col-sm-4`}>
            <div className="card stretch stretch-full">
                <div className="card-body">
                    <p><span className={`fw-bold fs-4 text-${color}`}>{title}</span></p>
                    <div><span className="fw-bold text-dark mb-0"></span> {value}</div>
                </div>
            </div>
        </div>
    );
};


/* =============== INLINE STYLES FOR MODAL =============== */
const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
};

const modalStyle = {
    width: "50%",
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)"
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    borderBottom: "1px solid #ddd",
    background: "#f7f7f7"
};

const closeBtn = {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer"
};
const contentWrapper = {
    width: "100%",
    height: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background: "#000"
};

const imgStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "6px"
};

const pdfStyle = {
    width: "100%",
    height: "100%",
    border: "none"
};
