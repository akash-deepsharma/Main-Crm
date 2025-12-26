
'use client'
import React, { useState } from 'react'
import { FaEye } from 'react-icons/fa'

const TabEmployeeAddress = () => {
     const [show, setShow] = useState(false);
    const [fileUrl, setFileUrl] = useState("");

    const handleViewDocument = (url) => {
        setFileUrl(url);
        setShow(true);
    };
    return (
        <>
        <div className="tab-pane fade active show" id="overviewTab">
            <div className="row">
                <div className="col-xl-6">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <h3 className='mb-4'>Present Address </h3>
                            <div className="row">
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Address </label>
                                    <p>Gali No. 9 Durgapuram </p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">City </label>
                                    <p>Bluandshahr</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">State  </label>
                                    <p>Uttar Pradesh</p>
                                </div>
                               <div className="col-md-4 mb-2">
                                    <label className="form-label">Country </label>
                                    <p>India</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Zip Code </label>
                                    <p>203001</p>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <h3 className='mb-4'>Permanent  Address </h3>
                            <div className="row">
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Address </label>
                                    <p>Gali No. 9 Durgapuram </p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">City </label>
                                    <p>Bluandshahr</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">State  </label>
                                    <p>Uttar Pradesh</p>
                                </div>
                               <div className="col-md-4 mb-2">
                                    <label className="form-label">Country </label>
                                    <p>India</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Zip Code </label>
                                    <p>203001</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-12">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <h3 className='mb-4'>Eduactional Details</h3>
                            <div className="row">
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Qualification </label>
                                    <p>10th </p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Qualification Year </label>
                                    <p>2020</p>
                                </div>
                                 <div className="col-md-4 mb-2">
                                        <label className="form-label">Marksheet</label>
                                        <p 
                                            onClick={() => handleViewDocument("/images/gallery/10th.webp")}
                                            style={{ cursor: "pointer", color: "blue" }}
                                        >
                                            view <FaEye />
                                        </p>
                                    </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Qualification </label>
                                    <p>12th </p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Qualification Year </label>
                                    <p>2022</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Marksheet  </label>
                                    <p 
                                            onClick={() => handleViewDocument("/images/gallery/12th.jpg")}
                                            style={{ cursor: "pointer", color: "blue" }}
                                        >
                                            view <FaEye />
                                        </p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Highest Qualification </label>
                                    <p>Pg </p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Qualification Year </label>
                                    <p>2025</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Marksheet  </label>
                                    <p 
                                            onClick={() => handleViewDocument("/images/gallery/pg.pdf")}
                                            style={{ cursor: "pointer", color: "blue" }}
                                        >
                                            view <FaEye />
                                        </p>
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

export default TabEmployeeAddress

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