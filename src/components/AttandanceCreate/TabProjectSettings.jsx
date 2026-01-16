'use client'
import React from 'react'
import AttandanceEmployeeUpdateTable from '../ClientAttendanceList/AttandanceEmployeeUpdateTable ';

const TabProjectSettings = ({
  clientType,
  initialClient,
  initialConsignee,
  attachmentData // New prop from parent
}) => {

  console.log('select client:', initialClient);
  console.log('Attachment data received:', attachmentData);

  return (
    <section className="step-body mt-0 body current stepChange">
      <form id="project-settings">
        <fieldset>
          {/* Display Month/Year Information */}
          {attachmentData && (attachmentData.month || attachmentData.year) && (
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-primary">Selected Month</label>
                      <div className="form-control bg-light">
                        {attachmentData.month || "Not selected"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-primary">Selected Year</label>
                      <div className="form-control bg-light">
                        {attachmentData.year || "Not selected"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Display File Info if uploaded */}
                  {attachmentData.fileName && (
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label fw-bold text-primary">Uploaded File</label>
                        <div className="form-control bg-light d-flex justify-content-between align-items-center">
                          <span>{attachmentData.fileName}</span>
                          <span className="badge bg-success">
                            {attachmentData.isUploaded === false ? "Not Uploaded" : "Uploaded"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pass month/year to child component */}
          <AttandanceEmployeeUpdateTable
            clientType={clientType}
            initialClient={initialClient}
            initialConsignee={initialConsignee || null}
            month={attachmentData?.month || ""}
            year={attachmentData?.year || ""}
          />

        </fieldset>
      </form>
    </section>
  )
}

export default TabProjectSettings