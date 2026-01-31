import Link from 'next/link'
import React from 'react'

const TabCompleted = ({ apiResponse, apiStatus, apiError }) => {
  return (
    <section className="step-body mt-4 text-center">
      {apiStatus === 'success' ? (
        <>
          <img src="/images/general/completed-steps.png" alt="Invoice Created" className="img-fluid wd-300 mb-4" />
          <h4 className="fw-bold text-success">Invoice Created Successfully!</h4>
          <p className="text-muted mt-2">Your invoice has been created successfully.</p>
          
          <div className="d-flex justify-content-center gap-1 mt-5">
            <a href="/invoice/create" className="btn btn-light">Create Another Invoice</a>
            <Link href="/invoice/list" className="btn btn-primary">View Invoices</Link>
          </div>
        </>
      ) : apiStatus === 'error' ? (
        <>
          <img src="/images/general/error-steps.png" alt="Error" className="img-fluid wd-300 mb-4" />
          <h4 className="fw-bold text-danger">Invoice Creation Failed</h4>
          <p className="text-muted mt-2">{apiError || 'There was an error creating the invoice.'}</p>
          
          {apiResponse && (
            <div className="card mt-4 mx-auto" style={{ maxWidth: '600px' }}>
              <div className="card-body text-start">
                <h6 className="card-title fw-bold mb-3">Error Details:</h6>
                <pre className="bg-light p-3 rounded" style={{ fontSize: '12px' }}>
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          <div className="d-flex justify-content-center gap-1 mt-5">
            <button className="btn btn-light" onClick={() => window.location.reload()}>Try Again</button>
            <Link href="/invoice/create" className="btn btn-primary">Back to Create</Link>
          </div>
        </>
      ) : (
        <>
          {/* This fallback section will only show if apiStatus is neither 'success' nor 'error' */}
          <img src="/images/general/completed-steps.png" alt="Invoice Created" className="img-fluid wd-300 mb-4" />
          <h4 className="fw-bold">Invoice Created!</h4>
          <p className="text-muted mt-2">Your invoice has been created.</p>
          
          <div className="d-flex justify-content-center gap-1 mt-5">
            <a href="/invoice/create" className="btn btn-light">Create Another Invoice</a>
            <Link href="/invoice/list" className="btn btn-primary">View Invoices</Link>
          </div>
        </>
      )}
    </section>
  )
}

export default TabCompleted