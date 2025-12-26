import React, { useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const TabFamilyBank = ({ error }) => {
  const [isMarried, setIsMarried] = useState(false);

  return (
    <section className="step-body mt-4 body current stepChange">
      <form id="project-budgets">
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Family Details</h2>
            <p className="text-muted">Family details go here</p>
          </div>

          <div className="row">
            {/* Married Checkbox */}
            <div className="custom-control custom-checkbox mb-3">
              <input
                type="checkbox"
                className="custom-control-input"
                id="isMarried"
                checked={isMarried}
                onChange={(e) => setIsMarried(e.target.checked)}
              />
              <label className="custom-control-label c-pointer" htmlFor="isMarried">
                If Married, check this
              </label>
            </div>

            {/* Married Fields */}
            {isMarried && (
              <>
                <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
                  <label className="form-label">Spouse Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
                  <label className="form-label">Spouse Contact <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Child Name </label>
              <input type="text" className="form-control" />
            </div>
              </>
            )}

            {/* Common Parent Fields */}
            <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Father Name <span className="text-danger">*</span></label>
              <input type="text" className="form-control" required />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Father Contact <span className="text-danger">*</span></label>
              <input type="text" className="form-control" required />
            </div>
            

            {/* Family Photo (always shown) */}
            <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Family Photo <span className="text-danger">*</span></label>
              <input type="file" className="form-control" required />
            </div>
          </div>

          {/* ERROR LABEL */}
          {error && (
            <label className="error">
              <FiAlertTriangle /> This field is required.
            </label>
          )}
        </fieldset>

        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Bank Details</h2>
            <p className="text-muted">Bank details go here</p>
          </div>

          <div className="row">

            {/* Common Parent Fields */}
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Bank name <span className="text-danger">*</span></label>
              <input type="text" className="form-control" required />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Branch Branch <span className="text-danger">*</span></label>
              <input type="text" className="form-control" required />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">IFSC <span className="text-danger">*</span></label>
              <input type="text" className="form-control" required />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Account no. <span className="text-danger">*</span></label>
              <input type="text" className="form-control" required />
            </div>
          </div>

          {/* ERROR LABEL */}
          {error && (
            <label className="error">
              <FiAlertTriangle /> This field is required.
            </label>
          )}
        </fieldset>
      </form>
    </section>
  );
};

export default TabFamilyBank;
