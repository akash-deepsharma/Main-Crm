'use client'
import React from 'react'
import { FiBarChart2, FiCalendar, FiCheckCircle, FiClock, FiLink2 } from 'react-icons/fi'
import ImageGroup from '@/components/shared/ImageGroup'
import dynamic from 'next/dynamic'

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
const TabProjectOverview = (data) => {
    const overviewData = data.data.data
    console.log( "data form overview", overviewData)
    return (
        <div className="tab-pane fade active show" id="overviewTab">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-body task-header d-md-flex align-items-center justify-content-between">
                            <div className="me-4">
                                <h4 className="mb-4 fw-bold d-flex">
                                    <span className="text-truncate-1-line">
                                        {/* Client Name : {`${overviewData?.customer_name}` } || */}
                                         {/* Customer Name : */}
                                          {`${overviewData?.customer_name}` }  <span className="badge bg-soft-primary text-primary mx-3">In Prograss</span></span>
                                </h4>
                                <div className="d-flex align-items-center">
                                    {/* <span className="vr mx-3 text-muted" /> */}
                                    <div className="img-group lh-0 ms-2 justify-content-start">
                                        <ImageGroup data={imageList} avatarSize='avatar-md' />
                                        <span className="d-none d-sm-flex">
                                            <span className="fs-12 text-muted ms-3 text-truncate-1-line">24+ employes</span>
                                        </span>
                                    </div>
                                </div>
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
                                <div className="col-md-6 mb-4">
                                    <label className="form-label">Project</label>
                                    <p>{`${overviewData?.service_title}`}</p>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label className="form-label">Client ID - </label>
                                    <p>{`${overviewData?.id}`}</p>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label className="form-label">Contract No</label>
                                    <p>{`${overviewData?.contract_no}`}</p>
                                </div>
                               <div className="col-md-6 mb-4">
                                    <label className="form-label">Contract Added on</label>
                                    <p>{`${overviewData?.created_at}`}</p>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label className="form-label">Contract Generated Date</label>
                                    <p>{`${overviewData?.onboard_date}`}</p>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label className="form-label">Contract Start Date </label>
                                    <p>{`${overviewData?.service_start_date}`}</p>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label className="form-label">Contract End Date </label>
                                    <p>{`${overviewData?.service_end_date}`}</p>
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
                            value={overviewData?.contact_no}
                            col= "6"
                        />
                         <ContactCard
                            icon="feather-clipboard"
                            color="warning"
                            title="Email"
                            value={overviewData?.email}
                            col= "6"
                        />
                         <ContactCard
                            icon="feather-check"
                            color="success"
                            title="Address"
                            value={overviewData?.address}
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

    )
}   

export default TabProjectOverview


const ContactCard = ({ icon,title, color, value,col }) => {
    return (
        <div className={`col-xxl-${col} col-xl-12 col-sm-4`}>
            <div className="card stretch stretch-full">
                <div className="card-body">
                    {/* <div className={`avatar-text bg-soft-${color} text-${color} border-0 mb-3`}>
                        {React.cloneElement(getIcon(icon), { size: "16" })}
                    </div> */}
                    <p><span className={`fw-bold fs-20 text-${color}`}>{title}</span></p>
                    <div><span className="fw-bold text-dark mb-0"></span> {value}</div>
                </div>
            </div>
        </div>
    );
};
