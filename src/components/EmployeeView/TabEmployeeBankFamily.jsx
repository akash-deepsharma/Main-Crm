
'use client'
import React, { useState } from 'react'
import { FaEye } from 'react-icons/fa'

const TabEmployeeBankFamily = (data) => {
    const [show, setShow] = useState(false);
       const [fileUrl, setFileUrl] = useState("");
    
       const handleViewDocument = (url) => {
           setFileUrl(url);
           setShow(true);
       };

       const employeeData = data?.data;
console.log( "emploeyeedd test data", )
    return (
        <>
        <div className="tab-pane fade active show" id="overviewTab">
            <div className="row">
                <div className="col-xl-6">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <h3 className='mb-4'>Family Details</h3>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Father Name</label>
                                    <p>{employeeData?.Fathername}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Father Contact </label>
                                    <p>{employeeData?.FatherContact}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Spouse Name </label>
                                    <p>{employeeData?.SpouseName}</p>
                                </div>
                               <div className="col-md-6 mb-2">
                                    <label className="form-label">Spouse Contact </label>
                                    <p>{employeeData?.SpouseContact}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Child Name </label>
                                    <p>{employeeData?.ChildName}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Family Photo </label>
                                    <p  onClick={() => handleViewDocument(`https://green-owl-255815.hostingersite.com/${employeeData?.familyPhoto}`)} style={{ cursor: "pointer", color: "blue" }}> view <FaEye /> </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="col-xl-6">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <h3 className='mb-4'>Bank Details</h3>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Bank name</label>
                                    <p>{employeeData?.bankName}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Branch Branch </label>
                                    <p>{employeeData?.branchLocation}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">IFSC Code </label>
                                    <p>{employeeData?.ifsc}</p>
                                </div>
                               <div className="col-md-6 mb-2">
                                    <label className="form-label">Account no. </label>
                                    <p>{employeeData?.accountNo}</p>
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

export default TabEmployeeBankFamily
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