
'use client'
import React from 'react'

const TabProjectConsignee = (data) => {
    const consigneeData = data.data
    console.log("consigneeData", consigneeData)
    return (
        <div className="tab-pane fade active show" id="overviewTab">
            <div className="row">
                {consigneeData?.map((item, index) => (
                <div className="col-xl-6" key={index}>
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <h3 className='mb-4'>Consignee {index + 1}</h3>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Consignee Name</label>
                                    <p>{item.consignee_name}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Designation  - </label>
                                    <p>{item.consigness_designation}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Contact </label>
                                    <p>{item.consignee_contact_no}</p>
                                </div>
                               <div className="col-md-6 mb-2">
                                    <label className="form-label">Email </label>
                                    <p>{item.consignee_email}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">GSTIN </label>
                                    <p>{item.consignee_gstin}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Service Designations </label>
                                    <p>
                                        {item.designations?.length > 0
                                        ? item.designations.map(d => d.name).join(', ')
                                        : '—'}
                                    </p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Address  </label>
                                    <p>{item.consignee_addess}</p>
                                </div>
                                 {/* <div className="col-md-6 mb-4">
                                    <label className="form-label">Logged Hours</label>
                                    <p>00:00:00</p>
                                </div> */}
                            </div>
                            <h5 className='mb-4'>Dealing Hand Details</h5>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Dealing Hand Name</label>
                                    <p>{item.dealing_hand_name}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Designation  - </label>
                                    <p>{item.dealing_designation}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Contact </label>
                                    <p>{item.dealing_contact}</p>
                                </div>
                               <div className="col-md-6 mb-2">
                                    <label className="form-label">Email </label>
                                    <p>{item.dealing_email}</p>
                                </div>
                                
                               
                            </div>
                        </div>
                    </div>
                </div>

                 ))
                }
                 {/* <div className="col-xl-6">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <h3 className='mb-4'>Consignee 2</h3>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Consignee Name</label>
                                    <p>raj</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Designation  - </label>
                                    <p>cmo</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Contact </label>
                                    <p>98765432</p>
                                </div>
                               <div className="col-md-6 mb-2">
                                    <label className="form-label">Email </label>
                                    <p>moweqetalu@mailinator.com</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">GSTIN </label>
                                    <p>27ABCDE1234F2Z5</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Service Description </label>
                                    <p>developer , designer</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Address  </label>
                                    <p>B-12, Gardenia Apartments Sector 14, Near City Library Gurgaon, Haryana 122001 INDIA</p>
                                </div>
                                
                            </div>
                             <h5 className='mb-4'>Dealing Hand Details</h5>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Dealing Hand Name</label>
                                    <p>raj</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Designation  - </label>
                                    <p>cmo</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Contact </label>
                                    <p>98765432</p>
                                </div>
                               <div className="col-md-6 mb-2">
                                    <label className="form-label">Email </label>
                                    <p>moweqetalu@mailinator.com</p>
                                </div>
                                
                               
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>

    )
}

export default TabProjectConsignee
