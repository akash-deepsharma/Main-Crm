"use client";
import React, { useState, useRef, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { format, startOfMonth, endOfMonth } from "date-fns";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = Array.from({ length: 20 }, (_, i) => 2015 + i);

const MonthRangePicker = ({ fromMonth, toMonth, setFromMonth, setToMonth }) => {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [range, setRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: "selection"
    }
  ]);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMonthSelect = (monthIndex, type) => {
    const start = startOfMonth(new Date(selectedYear, monthIndex, 1));
    const end = endOfMonth(new Date(selectedYear, monthIndex, 1));

    if (type === "from") {
      setFromMonth(`${months[monthIndex]} ${selectedYear}`);
      setRange([{ ...range[0], startDate: start }]);
    } else {
      setToMonth(`${months[monthIndex]} ${selectedYear}`);
      setRange([{ ...range[0], endDate: end }]);
    }
  };

  const appliedValue =
    fromMonth && toMonth
      ? `${fromMonth} → ${toMonth}`
      : "Select Month From – To";

  return (
    <div className="position-relative" ref={pickerRef}>
      {/* Input Box */}
      <div
        className="form-control bg-white py-2 px-3 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {appliedValue}
      </div>

      {/* POPUP */}
      {open && (
        <div
          className="position-absolute bg-white shadow-lg p-3 rounded"
          style={{ top: "48px", zIndex: 99999, width: "400px" }}
        >
          {/* YEAR SELECT */}
          <div className="mb-3 d-flex gap-2">
            <strong>Select Year:</strong>
            <select
              className="form-select form-select-sm"
              style={{ width: "120px" }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* FROM MONTH SECTION */}
          <h6 className="fw-bold">From Month</h6>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {months.map((m, index) => (
              <div
                key={m}
                onClick={() => handleMonthSelect(index, "from")}
                className={`px-2 py-1 rounded border cursor-pointer ${
                  fromMonth === `${m} ${selectedYear}`
                    ? "bg-primary text-white"
                    : "bg-light"
                }`}
              >
                {m}
              </div>
            ))}
          </div>

          {/* TO MONTH SECTION */}
          <h6 className="fw-bold">To Month</h6>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {months.map((m, index) => (
              <div
                key={m}
                onClick={() => handleMonthSelect(index, "to")}
                className={`px-2 py-1 rounded border cursor-pointer ${
                  toMonth === `${m} ${selectedYear}`
                    ? "bg-success text-white"
                    : "bg-light"
                }`}
              >
                {m}
              </div>
            ))}
          </div>

          {/* CUSTOM DATE RANGE PICKER */}
          <div className="mb-2">
            <DateRangePicker
              onChange={(item) => setRange([item.selection])}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={range}
              direction="horizontal"
              showMonthAndYearPickers={false}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex justify-content-between align-items-center pt-2 border-top">
            <span>
              {`${format(range[0].startDate, "MMM dd, yyyy")} → ${format(
                range[0].endDate,
                "MMM dd, yyyy"
              )}`}
            </span>

            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-sm btn-primary"
                onClick={() => setOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthRangePicker;
