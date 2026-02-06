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


// 'use client'
// import React from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const MonthPicker = ({ 
//   selectedMonth, 
//   setSelectedMonth,onChange, 
//   toggleDateRange 
// }) => {
//   return (
//     <div className={`${toggleDateRange ? "show" : ""}`}>
//       <DatePicker
//         selected={selectedMonth}
//         // onChange={setSelectedMonth,onChange}
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
  setSelectedMonth,
  onChange, 
  toggleDateRange 
}) => {
  
 
  const handleDateChange = (date) => {
    console.log("Date changed to:", date);
    
  
    if (setSelectedMonth && typeof setSelectedMonth === 'function') {
      setSelectedMonth(date);
    }
    
 
    if (onChange && typeof onChange === 'function') {
      onChange(date);
    }
  };

  return (
    <div className={`${toggleDateRange ? "show" : ""}`}>
      <DatePicker
        selected={selectedMonth}
        onChange={handleDateChange} 
        dateFormat="MMM yyyy"
        showMonthYearPicker
        className="form-control"
      />
    </div>
  );
};

export default MonthPicker;