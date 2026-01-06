

'use client'
import React from 'react'

const TabFinancialSheet = (data) => {
    const financialData = data?.data
    console.log("financialData", financialData)
    return (
        <div className="tab-pane fade active show" id="overviewTab">
            <div className="row">
                <div className="col-xl-6">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <h3 className='mb-4'>Financial Approval</h3>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">IFD Concurrence</label>
                                    <p>{financialData?.ifd_concurrence}</p>
                                </div>
                             <div className="col-md-6 mb-2">
                                    <label className="form-label">Designation of Administrative Approval </label>
                                    <p>{financialData?.designation_admin_approval}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Designation of Financial Approval </label>
                                    <p>{financialData?.designation_financial_approval}</p>
                                </div>
                               
                            </div>
                          
                            
                        </div>
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                              <h3 className='mb-4'>Paying Authority</h3>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Role</label>
                                    <p>{financialData?.role}</p>
                                </div>
                             <div className="col-md-6 mb-2">
                                    <label className="form-label">Payment Mode </label>
                                    <p>{financialData?.payment_mode}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Designation </label>
                                    <p>{financialData?.designation}</p>
                                </div>
                               <div className="col-md-6 mb-2">
                                    <label className="form-label">Email ID </label>
                                    <p>{financialData?.email}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">GSTIN </label>
                                    <p>{financialData?.gstin}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Address  </label>
                                    <p>{financialData?.address}</p>
                                </div>
                            </div>
                          
                            
                        </div>
                    </div>
                </div>
               
            </div>
        </div>

    )
}

export default TabFinancialSheet
