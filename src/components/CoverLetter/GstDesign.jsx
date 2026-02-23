import React from "react";
import './CoverLetter.css'

export default function GstDesign() {
  // Sample invoice data
  const invoiceData = {
    invoiceNo: "INV-2024-001",
    invoiceDate: "19 February 2025",
    dueDate: "05 March 2025",
    placeOfSupply: "Delhi (07)",
    
    // Company Details (Seller)
    company: {
      name: "Alpha Manpower Services Private Limited",
      address: "1/56D, Lalita Park, Laxmi Nagar",
      city: "East Delhi",
      state: "Delhi",
      pincode: "110092",
      phone: "+91 7210906377",
      email: "alphaprivatelimited1@gmail.com",
      gstin: "07AABCU9603R1ZM",
      pan: "AABCU9603R",
      cin: "U74999DL2018PTC123456"
    },

    // Client Details (Buyer)
    client: {
      name: "National Centre for Medium Range Weather Forecasting",
      address: "A-50, Sector - 62",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201309",
      gstin: "09ABCDE1234F1Z5",
      stateCode: "09"
    },

    // Invoice Items
    items: [
      {
        description: "Manpower Services - Security Personnel (8 hours shift)",
        sacCode: "9985",
        quantity: 5,
        unitPrice: 15000,
        amount: 75000
      },
      {
        description: "Manpower Services - Housekeeping Staff (8 hours shift)",
        sacCode: "9985",
        quantity: 3,
        unitPrice: 12000,
        amount: 36000
      },
      {
        description: "Supervisory Services",
        sacCode: "9983",
        quantity: 1,
        unitPrice: 25000,
        amount: 25000
      }
    ],

    // Additional Charges
    additionalCharges: [
      {
        description: "Uniform & Safety Equipment",
        amount: 5000
      },
      {
        description: "Transportation Allowance",
        amount: 3000
      }
    ],

    // Tax Details
    tax: {
      cgst: 9, // percentage
      sgst: 9, // percentage
      igst: 0  // percentage (0 for intra-state)
    },

    // Bank Details
    bank: {
      name: "Punjab National Bank",
      branch: "Railway Road",
      accountNo: "134567654123456",
      ifsc: "PUNB000012",
      accountType: "Current Account"
    }
  };

  // Calculate totals
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  const additionalTotal = invoiceData.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
  const taxableValue = subtotal + additionalTotal;
  
  // Calculate GST
  const cgstAmount = (taxableValue * invoiceData.tax.cgst) / 100;
  const sgstAmount = (taxableValue * invoiceData.tax.sgst) / 100;
  const igstAmount = (taxableValue * invoiceData.tax.igst) / 100;
  const totalGst = cgstAmount + sgstAmount + igstAmount;
  
  // Grand Total
  const grandTotal = taxableValue + totalGst;
  
  // Amount in words
  const numberToWords = (num) => {
    // This is a simplified version - you might want to use a library for production
    return "Rupees " + num.toFixed(2) + " Only";
  };

  return (
    <div style={{
      maxWidth: "900px",
      margin: "30px auto",
      padding: "30px",
      background: "#fff",
      boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #f2a07b", paddingBottom: "20px" }}>
        <h1 style={{ margin: "0", color: "#333", fontSize: "28px" }}>{invoiceData.company.name}</h1>
        <p style={{ margin: "5px 0", color: "#666" }}>{invoiceData.company.address}, {invoiceData.company.city}, {invoiceData.company.state} - {invoiceData.company.pincode}</p>
        <p style={{ margin: "5px 0", color: "#666" }}>Phone: {invoiceData.company.phone} | Email: {invoiceData.company.email}</p>
        <p style={{ margin: "5px 0", color: "#666" }}>GSTIN: {invoiceData.company.gstin} | PAN: {invoiceData.company.pan}</p>
        <p style={{ margin: "5px 0", color: "#666" }}>CIN: {invoiceData.company.cin}</p>
      </div>

      {/* Invoice Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h2 style={{ margin: "0", color: "#444", fontSize: "24px", borderBottom: "3px solid #f2a07b", paddingBottom: "5px" }}>
          TAX INVOICE
        </h2>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "3px 0" }}><strong>Invoice No:</strong> {invoiceData.invoiceNo}</p>
          <p style={{ margin: "3px 0" }}><strong>Invoice Date:</strong> {invoiceData.invoiceDate}</p>
          <p style={{ margin: "3px 0" }}><strong>Due Date:</strong> {invoiceData.dueDate}</p>
        </div>
      </div>

      {/* Party Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
        {/* Seller Details */}
        <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "5px" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#555", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Seller Details</h3>
          <p style={{ margin: "5px 0" }}><strong>{invoiceData.company.name}</strong></p>
          <p style={{ margin: "5px 0" }}>{invoiceData.company.address}</p>
          <p style={{ margin: "5px 0" }}>{invoiceData.company.city}, {invoiceData.company.state} - {invoiceData.company.pincode}</p>
          <p style={{ margin: "5px 0" }}>GSTIN: {invoiceData.company.gstin}</p>
          <p style={{ margin: "5px 0" }}>State: {invoiceData.company.state} (Code: 07)</p>
        </div>

        {/* Buyer Details */}
        <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "5px" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#555", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Buyer Details</h3>
          <p style={{ margin: "5px 0" }}><strong>{invoiceData.client.name}</strong></p>
          <p style={{ margin: "5px 0" }}>{invoiceData.client.address}</p>
          <p style={{ margin: "5px 0" }}>{invoiceData.client.city}, {invoiceData.client.state} - {invoiceData.client.pincode}</p>
          <p style={{ margin: "5px 0" }}>GSTIN: {invoiceData.client.gstin}</p>
          <p style={{ margin: "5px 0" }}>State: {invoiceData.client.state} (Code: {invoiceData.client.stateCode})</p>
          <p style={{ margin: "5px 0" }}>Place of Supply: {invoiceData.placeOfSupply}</p>
        </div>
      </div>

      {/* Items Table */}
      <div style={{ marginBottom: "30px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f2a07b", color: "#fff" }}>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>S.No.</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Description of Services</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>SAC Code</th>
              <th style={{ padding: "12px", textAlign: "right", border: "1px solid #ddd" }}>Quantity</th>
              <th style={{ padding: "12px", textAlign: "right", border: "1px solid #ddd" }}>Unit Price (₹)</th>
              <th style={{ padding: "12px", textAlign: "right", border: "1px solid #ddd" }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.description}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.sacCode}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "right" }}>{item.quantity}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "right" }}>₹{item.unitPrice.toLocaleString()}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "right" }}>₹{item.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Charges */}
      {invoiceData.additionalCharges.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#555" }}>Additional Charges</h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {invoiceData.additionalCharges.map((charge, index) => (
                <tr key={index}>
                  <td style={{ padding: "8px", border: "1px solid #ddd", width: "70%" }}>{charge.description}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right", width: "30%" }}>₹{charge.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary and Tax Calculation */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
        {/* Amount in Words */}
        <div style={{ padding: "15px", background: "#f8f9fa", borderRadius: "5px" }}>
          <p style={{ margin: "0", fontStyle: "italic" }}>
            <strong>Amount in Words:</strong> {numberToWords(grandTotal)}
          </p>
        </div>

        {/* Tax Calculation Table */}
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}><strong>Subtotal</strong></td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>₹{subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}><strong>Additional Charges</strong></td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>₹{additionalTotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}><strong>Taxable Value</strong></td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>₹{taxableValue.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>CGST @ {invoiceData.tax.cgst}%</td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>₹{cgstAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>SGST @ {invoiceData.tax.sgst}%</td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>₹{sgstAmount.toLocaleString()}</td>
              </tr>
              <tr style={{ background: "#f2a07b", color: "#fff" }}>
                <td style={{ padding: "12px", border: "1px solid #ddd", fontWeight: "bold" }}>Grand Total</td>
                <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold" }}>₹{grandTotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "20px" }}>
        <div>
          <h4 style={{ margin: "0 0 10px 0", color: "#555" }}>Bank Details</h4>
          <p style={{ margin: "5px 0" }}><strong>Bank Name:</strong> {invoiceData.bank.name}</p>
          <p style={{ margin: "5px 0" }}><strong>Branch:</strong> {invoiceData.bank.branch}</p>
          <p style={{ margin: "5px 0" }}><strong>Account No:</strong> {invoiceData.bank.accountNo}</p>
          <p style={{ margin: "5px 0" }}><strong>IFSC Code:</strong> {invoiceData.bank.ifsc}</p>
          <p style={{ margin: "5px 0" }}><strong>Account Type:</strong> {invoiceData.bank.accountType}</p>
        </div>

        {/* Terms and Conditions */}
        <div>
          <h4 style={{ margin: "0 0 10px 0", color: "#555" }}>Terms & Conditions</h4>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>Payment is due within 15 days of invoice date</li>
            <li>Interest @ 18% p.a. on overdue payments</li>
            <li>This is a computer generated invoice, signature not required</li>
            <li>Subject to Delhi jurisdiction</li>
          </ul>
        </div>
      </div>

      {/* Declaration */}
      <div style={{ marginTop: "30px", padding: "15px", borderTop: "1px solid #ddd" }}>
        <p style={{ margin: "0", fontSize: "12px", color: "#666", textAlign: "center" }}>
          <strong>Declaration:</strong> We declare that this invoice shows the actual price of the services rendered and that all particulars are true and correct.
        </p>
        <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#666", textAlign: "center" }}>
          * This is a system generated invoice, does not require physical signature
        </p>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <p style={{ margin: "0" }}>For {invoiceData.company.name}</p>
        <div style={{ marginTop: "50px" }}>
          <p style={{ margin: "0" }}>(Authorized Signatory)</p>
        </div>
      </div>
    </div>
  );
}