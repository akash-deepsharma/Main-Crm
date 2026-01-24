'use client'
import React, { useEffect } from 'react'
import AttandanceEmployeeUpdateTable from '../ClientAttendanceList/AttandanceEmployeeUpdateTable ';

const TabProjectSettings = ({
  clientType,
  initialClient,
  attachmentData
}) => {


   useEffect(() => {
    console.log('🔍 TabProjectSettings - Props received:')
    console.log('📅 attachmentData:', attachmentData)
    console.log('📅 Month:', attachmentData?.month)
    console.log('📅 Year:', attachmentData?.year)
    console.log('📅 Due Date:', attachmentData?.dueDate)
    console.log('👥 Client Type:', clientType)
    console.log('👤 Client:', initialClient)
  }, [attachmentData, clientType, initialClient])

  return (
    <section className="step-body mt-0 body current stepChange">
      <form id="project-settings">
        <fieldset>
          {/* Display Month/Year Information */}
          {attachmentData && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Invoice Period & Due Date</h5>
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-primary">Selected Month</label>
                      <div className="form-control bg-light">
                        {attachmentData.month || "Not selected"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-primary">Selected Year</label>
                      <div className="form-control bg-light">
                        {attachmentData.year || "Not selected"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-primary">Due Date</label>
                      <div className="form-control bg-light">
                        {attachmentData.dueDate ? new Date(attachmentData.dueDate).toLocaleDateString() : "Not selected"}
                      </div>
                    </div>
                  </div>
                  
                
                </div>
              </div>
            </div>
          )}

          {/* Display Client Information */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Client Information</h5>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">Client Type</label>
                    <div className="form-control bg-light">
                      {clientType === "GeM" ? "Gem Client" : 
                       clientType === "corporate" ? "Corporate Client" : 
                       "Not selected"}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">Selected Client</label>
                    <div className="form-control bg-light">
                      {initialClient ? initialClient.label || "Client selected" : "No client selected"}
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* Pass all data to child component */}
          {/* <AttandanceEmployeeUpdateTable
            clientType={clientType}
            initialClient={initialClient}
            initialConsignee={initialConsignee || null}
            month={attachmentData?.month || ""}
            year={attachmentData?.year || ""}
            dueDate={attachmentData?.dueDate || ""}
          /> */}

        </fieldset>
      </form>
    </section>
  )
}

export default TabProjectSettings