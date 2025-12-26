import React from "react";

const TabAddressDetails = () => {

  return (
    <section className="step-body mt-4 body current stepChange">
      <form id="project-target">
        <fieldset>
          <div className="row">
          <div className="mb-3">
            <h2 className="fs-16 fw-bold">Present Address</h2>
            <p className="text-muted">Complete Present Address details goes here</p>
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Address</label>
            <input
              type="text"
              className="form-control"
              value=''
            />
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">City</label>
            <input
              type="text"
              className="form-control"
              value=''
            />
          </div>
          
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">State</label>
            <input
              type="text"
              className="form-control"
              value=''
            />
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Country</label>
            <input
              type="text"
              className="form-control"
              value=''
            />
          </div>
          </div>

        </fieldset>
        <fieldset className="mt-5">
          <div className="row">
          <div className="mb-3">
            <h2 className="fs-16 fw-bold">Permanent Address</h2>
            <p className="text-muted">Complete Permanent details goes here</p>
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Address</label>
            <input
              type="text"
              className="form-control"
              value=''
            />
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">City</label>
            <input
              type="text"
              className="form-control"
              value=''
            />
          </div>
          
          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">State</label>
            <input
              type="text"
              className="form-control"
              value=''
            />
          </div>

          <div className="col-lg-3 mb-4">
            <label className="fw-semibold text-dark">Country</label>
            <input
              type="text"
              className="form-control"
              value=''
            />
          </div>
          </div>

        </fieldset>
      </form>
    </section>
  );
};

export default TabAddressDetails;
