import React, { useEffect, useRef, useState } from "react";
import SelectDropdown from "@/components/shared/SelectDropdown";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const TabProjectDetails = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedConsignee, setSelectedConsignee] = useState(null);

  const [openPicker, setOpenPicker] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const pickerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setOpenPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Clients = [
    { value: "Select Client", label: "Select Client", color: "#3454d1" },
    { value: "Client One", label: "Client One", color: "#3454d1" },
    { value: "Client Two", label: "Client Two", color: "#41b2c4" },
    { value: "Client Three", label: "Client Three", color: "#ea4d4d" },
    { value: "Client Four", label: "Client Four", color: "#ffa21d" },
    { value: "Client Five", label: "Client Five", color: "#17c666" },
  ];

  const Compliance = [
    { value: "Select Compliance", label: "Select Compliance", color: "#3454d1" },
    { value: "Bonus", label: "Bonus", color: "#3454d1" },
    { value: "Areer", label: "Areer", color: "#41b2c4" },
    { value: "ESIC", label: "ESIC", color: "#ea4d4d" },
    { value: "EPFO", label: "EPFO", color: "#ffa21d" },
  ];

  return (
    <section className="step-body mt-4 body current stepChange h-100">
      <form id="project-details">
        <fieldset>

          <div className="row mb-5 pb-5">

            {/* Select Client */}
            <div className="col-lg-3 mb-4">
              <label className="fw-semibold text-dark">
                Select Client <span className="text-danger">*</span>
              </label>

              <SelectDropdown
                options={Clients}
                selectedOption={selectedClient}
                defaultSelect="Select Client"
                onSelectOption={setSelectedClient}
              />
            </div>

            {/* Select Compliance */}
            <div className="col-lg-3 mb-4">
              <label className="fw-semibold text-dark">
                Select Compliance <span className="text-danger">*</span>
              </label>

              <SelectDropdown
                options={Compliance}
                selectedOption={selectedConsignee}
                defaultSelect="Select Compliance"
                onSelectOption={setSelectedConsignee}
              />
            </div>

            {/* Date Range Picker */}
            <div className="col-lg-3 mb-4" style={{ position: "relative", zIndex: 9999 }}>
              <label className="fw-semibold text-dark">
                Select Month From – To <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                ref={inputRef}
                readOnly
                className="form-control"
                value={`${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`}
                onClick={() => setOpenPicker(true)}
              />

              {openPicker && (
                <div
                  ref={pickerRef}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#fff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    borderRadius: "10px",
                    zIndex: 10000,
                  }}
                >
                  <DateRange
                    editableDateInputs={true}
                    moveRangeOnFirstSelection={false}
                    ranges={range}
                    onChange={(item) => setRange([item.selection])}
                  />
                  <button
                    className="btn btn-primary w-100 mt-2"
                    onClick={() => setOpenPicker(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

          </div>

        </fieldset>
      </form>
    </section>
  );
};

export default TabProjectDetails;
