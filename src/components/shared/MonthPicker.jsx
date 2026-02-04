// 'use client'
// import React from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const MonthPicker = ({ selectedMonth, onChange, toggleDateRange }) => {
//   return (
//     <div className={`${toggleDateRange ? "show" : ""}`}>
//       <DatePicker
//         selected={selectedMonth}
//         onChange={onChange}
//         dateFormat="MMM yyyy"
//         showMonthYearPicker
//         className="form-control"
//       />
//     </div>
//   );
// };

// export default MonthPicker;


'use client'
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MonthPicker = ({ 
  selectedMonth, 
  setSelectedMonth,  // ✅ इसे onChange की जगह setSelectedMonth लें
  toggleDateRange 
}) => {
  return (
    <div className={`${toggleDateRange ? "show" : ""}`}>
      <DatePicker
        selected={selectedMonth}
        onChange={setSelectedMonth}  // ✅ onChange को setSelectedMonth से map करें
        dateFormat="MMM yyyy"
        showMonthYearPicker
        className="form-control"
      />
    </div>
  );
};

export default MonthPicker;