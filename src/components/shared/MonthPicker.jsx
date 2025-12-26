'use client'
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MonthPicker = ({ selectedMonth, setSelectedMonth, toggleDateRange }) => {
  return (
    <div className={` ${toggleDateRange ? "show" : ""}`}>
      <DatePicker
        selected={selectedMonth}
        onChange={(date) => setSelectedMonth(date)}
        dateFormat="MMM yyyy"
        showMonthYearPicker
        className="form-control"
      />
    </div>
  );
};

export default MonthPicker;