import React, { useState } from "react";
import Dropdown from "@/components/shared/Dropdown";
import { strogeOptions } from "../storage/StorageContent";
import { FiMinus } from "react-icons/fi";

// List of document types
const documentOptions = [" Attendance Document "];

const TabAttachement = () => {
  const [selectedDocs, setSelectedDocs] = useState([]); // { type, file, icon }

  return (
    <section className="step-body body stepChange mt-4">
      <div>
        <div className="mb-5">
          <h2 className="fs-16 fw-bold">Confermation sheet</h2>
          <p className="text-muted">
            If you need more info, please check details below.
          </p>
        </div>
        <div className="row">
          <div
            className="col-lg-3 mb-4"
            style={{ position: "relative", zIndex: 9999 }}
          >
            <label className="fw-semibold text-dark">Client Name</label>

            <input
              type="text"
              readOnly
              className="form-control"
              value="xyz client"
            />
          </div>

          <div
            className="col-lg-3 mb-4"
            style={{ position: "relative", zIndex: 9999 }}
          >
            <label className="fw-semibold text-dark">Compliance Name</label>

            <input
              type="text"
              readOnly
              className="form-control"
              value="Bonus"
            />
          </div>

          <div
            className="col-lg-3 mb-4"
            style={{ position: "relative", zIndex: 9999 }}
          >
            <label className="fw-semibold text-dark">Date From To</label>

            <input
              type="text"
              readOnly
              className="form-control"
              value="1 Aug 2024 - 31 Aug 2025"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TabAttachement;
