import React from "react";
import './CoverLetter.css'

export default function CoverLetter(profileData) {
  console.log("profileData asdasd", profileData);
  
  // Parse the profileData if it's a string
  let parsedData = {};
  try {
    // Check if profileData has a profileData property that is a string
    if (profileData?.profileData && typeof profileData.profileData === 'string') {
      parsedData = JSON.parse(profileData.profileData);
    } 
    // Check if profileData itself is a string
    else if (typeof profileData === 'string') {
      parsedData = JSON.parse(profileData);
    } 
    // Check if profileData is already an object with the data
    else if (profileData && typeof profileData === 'object') {
      parsedData = profileData;
    }
  } catch (error) {
    console.error("Error parsing profileData:", error);
  }

  console.log("parsedData", parsedData);

  // Extract address components with fallbacks
  const address = parsedData?.address ;
  const city = parsedData?.city ;
  const state = parsedData?.state;
  const zipCode = parsedData?.zip_code ;
  
  // Format the full address
  const fullAddress = `${address}, ${city}, ${state} - ${zipCode}`;
  const companyName = parsedData?.companyName ;
  const companyPhone = parsedData?.companyPhone ;
  const companyEmail = parsedData?.companyEmail;

  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "40px auto",
        padding: "40px",
        color: "#000",
        lineHeight: "1.6",
        border: "1px solid #ddd",
        backgroundColor:"#fff"
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h2 style={{ margin: "0", letterSpacing: "1px" }}>
          {companyName}
        </h2>
      </div>

      <hr style={{ border: "2px solid #f2a07b", marginBottom: "12px" }} />

      <p style={{ textAlign: "center", fontSize: "14px", margin: "4px 0" }}>
        {fullAddress}
      </p>
      <p style={{ textAlign: "center", fontSize: "14px", margin: "4px 0" }}>
        Cont. No. : {companyPhone}; (011)-49429762,  &nbsp; &nbsp;
        Email-ID: {companyEmail}
      </p>

      {/* Date - using month and year from props */}
      <p style={{ textAlign: "right", marginTop: "30px", fontWeight: "bold" }}>
        Date: {profileData?.month || "February"} {profileData?.year || "2025"}
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
      <p style={{ textAlign: "justify", fontSize: "16px" }}>
        This is with the reference of contract no. GEMC-511687770326743 and
        we would like to inform you that the supporting documents are not
        along with the first month's bill i.e. invoicing no.
        AMSPL/23-24/347 it will going with the second month's bill.
        We have also done the salary of all employees. If there is any
        query regarding this then do not hesitate to reach out of us or
        you can contact us on our official mail id & landline in the
        office time.
      </p>

      {/* Footer */}
      <p style={{ marginTop: "40px" }}>Thanking you.</p>

      <p style={{ marginTop: "40px", fontWeight: "bold" }}>
        {companyName}
      </p>

      <p style={{ marginTop: "30px", fontWeight: "bold" }}>
        Authorized Signatory
      </p>
    </div>
  );
}