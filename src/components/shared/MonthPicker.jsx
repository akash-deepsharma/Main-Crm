'use client'
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MonthPicker = ({ selectedMonth, onChange, toggleDateRange }) => {
  return (
    <div className={`${toggleDateRange ? "show" : ""}`}>
      <DatePicker
        selected={selectedMonth}
        onChange={onChange}
        dateFormat="MMM yyyy"
        showMonthYearPicker
        className="form-control"
      />
    </div>
  );
};

export default MonthPicker;
