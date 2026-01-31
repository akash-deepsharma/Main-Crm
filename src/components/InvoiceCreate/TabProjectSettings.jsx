'use client'
import React from 'react'

const TabProjectSettings = ({
  clientType,
  initialClient,
  attachmentData,
  apiStatus,
  apiError,
  isUploading
}) => {

  return (
    <section className="step-body mt-0 body current stepChange">
      <form id="project-settings">
        <fieldset>
          {/* Display loading state */}
          {isUploading && (
            <div className="alert alert-info mb-4">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              Creating invoice, please wait...
            </div>
          )}

          {/* Display error state from API */}
          {apiStatus === 'error' && (
            <div className="alert alert-danger mb-4">
              <strong>Error:</strong> {apiError || 'Failed to create invoice'}
            </div>
          )}

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

          {/* Instructions */}
          <div className="alert alert-warning">
            <h6 className="fw-bold mb-2">Ready to create invoice?</h6>
            <p className="mb-0">Click "Create Invoice" button below to generate the invoice with the above details.</p>
          </div>
        </fieldset>
      </form>
    </section>
  )
}

export default TabProjectSettings