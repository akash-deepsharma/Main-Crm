import React from "react";
import './CoverLetter.css'

export default function CoverLetter() {
  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "40px auto",
        padding: "40px",
        // fontFamily: "Times New Roman, serif",
        color: "#000",
        lineHeight: "1.6",
        border: "1px solid #ddd",
        backgroundColor:"#fff"
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h2 style={{ margin: "0", letterSpacing: "1px" }}>
          ALPHA MANPOWER SERVICES PRIVATE LIMITED
        </h2>
      </div>

      <hr style={{ border: "2px solid #f2a07b", marginBottom: "12px" }} />

      <p style={{ textAlign: "center", fontSize: "14px", margin: "4px 0" }}>
        1/56D, Lalita Park, Laxmi Nagar, New Delhi (110092)
      </p>
      <p style={{ textAlign: "center", fontSize: "14px", margin: "4px 0" }}>
        Cont. No. : (+91)7210906377; (011)-49429762,  &nbsp; &nbsp;
        Email-ID: alphaprivatelimited1@gmail.com
      </p>

      {/* Date */}
      <p style={{ textAlign: "right", marginTop: "30px", fontWeight: "bold" }}>
        Dates: 05.04.2023
      </p>

      {/* To Section */}
      <p style={{ marginTop: "30px" }}>
        <strong>To,</strong>
        <br />
        National Centre for Medium
        <br />
        Range and Weather Forecasting
        <br />
        A-50, sector - 62, Noida, UP, pin 201309
      </p>

      {/* Title */}
      <h3
        style={{
          textAlign: "center",
          textDecoration: "underline",
          margin: "40px 0 20px",
          letterSpacing: "1px",
        }}
      >
        UNDERTAKING
      </h3>

      {/* Body */}
      <p style={{ textAlign: "justify",fontSize:"16px" }}>
        This is with the reference of contract no. GEMC-511687770326743 and
        we would like to inform you that the supporting documents are not
        along with the first month’s bill i.e. invoicing no.
        AMSPL/23-24/347 it will going with the second month’s bill.
        We have also done the salary of all employees. If there is any
        query regarding this then do not hesitate to reach out of us or
        you can contact us on our official mail id & landline in the
        office time.
      </p>

      {/* Footer */}
      <p style={{ marginTop: "40px" }}>Thanking you.</p>

      <p style={{ marginTop: "40px", fontWeight: "bold" }}>
        Alpha Manpower Services Private Limited
      </p>

      <p style={{ marginTop: "30px", fontWeight: "bold" }}>
        Authorized Signatory
      </p>
    </div>
  );
}
