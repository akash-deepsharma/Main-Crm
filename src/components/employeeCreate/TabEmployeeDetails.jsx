import React, { useEffect, useState } from "react";
import TabEmployeeType from "./TabEmployeeType";
import SelectDropdown from "@/components/shared/SelectDropdown";
import {
  ConsigneeOptions,
  ClientOptions,
  DesignationOptions,
  GenderOptions,
  ShiftOptions,
  ReplacedOptions,
  ReligionOptions,
  MaritalOptions,
} from "@/utils/options";
import DatePicker from "react-datepicker";
import useDatePicker from "@/hooks/useDatePicker";
import useJoditConfig from "@/hooks/useJoditConfig";
import JoditEditor from "jodit-react";

const TabEmployeeDetails = () => {
  // Alag-alag states for each dropdown

  const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [mobileNo, setMobileNo] = useState("");
const [totalExperience, setTotalExperience] = useState("");
const [noOfChildren, setNoOfChildren] = useState("");
const [profileImage, setProfileImage] = useState(null);

  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedConsignee, setSelectedConsignee] = useState(null);
  const [ConsigneeOptions, setConsigneeOptions] = useState([]);
// const [selectedConsignee, setSelectedConsignee] = useState(null);
const [DesignationOptions, setDesignationOptions] = useState([]);
// const [selectedDesignation, setSelectedDesignation] = useState(null);

  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedReplaced, setSelectedReplaced] = useState(null);
  const [selectedReligion, setSelectedReligion] = useState(null);
  const [selectedMarital, setSelectedMarital] = useState(null);
    const [clientOptions, setClientOptions] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const { startDate, setStartDate, renderFooter } = useDatePicker();
  const config = useJoditConfig();
  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://green-owl-255815.hostingersite.com/api/client/employee/view",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();

        // Format the data for dropdown
        if (result.status && Array.isArray(result.data)) {
          const formatted = result.data.map((item) => ({
            value: item.id,
            buyer_name:item.buyer_name,
            label: item.contract_no,
          }));
          console.log('this is my data', formatted);
          setContractOptions(formatted);
        } else {
          console.error("API data is not an array:", result);
        }
      } catch (error) {
        console.error("Contract API Error:", error);
      }
    };

    fetchContracts();
  }, []);





 const handleContractChange = (option) => {
  // console.log("Buyer Name:", option.value);

  // Contract set
  setSelectedContract(option);

  // Client auto select (OBJECT format)
  if (option?.buyer_name) {
    setSelectedClient({
      label: option.buyer_name,
      value: option.buyer_id ?? option.buyer_name,
    });
  } else {
    setSelectedClient(null);
  }


  // API call

  fetchConsigneebyclient(option.value);
};

const handleConsigneeChange = (option) => {

  console.log('this is consignee',option);
  if (!option) return;

  // setSelectedConsignee(option);

  fethconsigneedesignation(option.value);

};

const fethconsigneedesignation = async (consigneeID) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://green-owl-255815.hostingersite.com/api/client/consignee/designation/${consigneeID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await res.json();

    console.log("Designation API data:", result);

    if (result.status && Array.isArray(result.data)) {
      const formatted = result.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      // ✅ OPTIONS me daalo
      setDesignationOptions(formatted);

      // ✅ selected reset
      setSelectedDesignation(null);
    }
  } catch (error) {
    console.error("Designation API Error:", error);
  }
};

const handleDesignationChange = (option) => {
  console.log("Selected Designation:", option);
  setSelectedDesignation(option);
};


  // ===================== FETCH CLIENT BY CONTRACT =====================
 const fetchConsigneebyclient = async (clientId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://green-owl-255815.hostingersite.com/api/client/consignee/${clientId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await res.json();

    console.log("Consignee API data:", result);

    if (result.status && Array.isArray(result.data)) {
      const formatted = result.data.map((item) => ({
        value: item.id,
        label: item.consignee_name,
      }));

      // ✅ OPTIONS set karo
      setConsigneeOptions(formatted);

      // ✅ Selected reset
      setSelectedConsignee(null);
    }
  } catch (error) {
    console.error("Consignee API Error:", error);
  }
};


const handleImageChange = (e) => {
  setProfileImage(e.target.files[0]);
};


const handleSubmitEmployee = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const formData = new FormData();

  // 🔹 Required fields (Laravel validation)
  formData.append("name", name);
  formData.append("email", email);
  formData.append("mobile_no", mobileNo);
  formData.append("company_id", 16); // 🔴 dynamic karo
  formData.append("client_id", selectedClient?.value);
  formData.append("consignee_id", selectedConsignee?.value || "");
  formData.append("designation", selectedDesignation?.value);

  // 🔹 Optional fields
  formData.append("gender", selectedGender?.value || "");
  formData.append("religion", selectedReligion?.value || "");
  formData.append("maritalStatus", selectedMarital?.value || "");
  formData.append("noOfChildren", noOfChildren);
  formData.append("dateOfBirth", startDate);
  formData.append("type", "GeM");

  // 🔹 Editor
  formData.append("about_employee", value);

  // 🔹 Image
  if (profileImage) {
    formData.append("profile_image", profileImage);
  }

  console.log('aarha hu main');
  try {
    const res = await fetch(
      "https://green-owl-255815.hostingersite.com/api/employee/store",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await res.json();

    if (!res.ok) {
      console.error("Validation Error:", result);
      alert("Validation error, console check karo");
      return;
    }

    console.log("Employee Created:", result);
    alert("Employee created successfully");

  } catch (error) {
    console.error("Employee Submit Error:", error);
  }
};

  //  useImperativeHandle(ref, () => ({
  //     submit: handleSaveAndNext,
  //   }))
  return (
    <section className="step-body mt-4 body current stepChange">
<form id="project-details">
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Employee details</h2>
            <p className="text-muted">Employee details gose here.</p>
          </div>

          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">
                Select Client Contract <span className="text-danger">*</span>
              </label>
              <SelectDropdown
                options={contractOptions}
                selectedOption={selectedContract}
                defaultSelect="SContract"
                onSelectOption={handleContractChange}
              />
            </div>

            

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Select Client</label>
              <SelectDropdown
                options={ClientOptions}
                selectedOption={selectedClient}
                defaultSelect="SClient"
                onSelectOption={(option) => setSelectedClient(option)}
              />
            </div>

          <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
  <label className="form-label">Select Consignee</label>
  <SelectDropdown
    options={ConsigneeOptions}
    selectedOption={selectedConsignee}
    defaultSelect="SConsignee"
    onSelectOption={handleConsigneeChange}
  />
</div>

<div className="col-xl-3 col-lg-4 col-md-6 mb-4">
  <label className="form-label">Select Designation</label>
  <SelectDropdown
    options={DesignationOptions}
    selectedOption={selectedDesignation}
    defaultSelect="SD"
    onSelectOption={handleDesignationChange}
  />
</div>


            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Name</label>
             <input
  className="form-control"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Email</label>
<input
  className="form-control"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Mobile No</label>
             <input
  className="form-control"
  value={mobileNo}
  onChange={(e) => setMobileNo(e.target.value)}
/>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Total Experience</label>
              <input className="form-control" />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Gender</label>
              <SelectDropdown
                options={GenderOptions}
                selectedOption={selectedGender}
                defaultSelect="SG"
                onSelectOption={(option) => setSelectedGender(option)}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Date of Birth</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="form-control"
                calendarContainer={({ children }) => (
                  <div className="bg-white react-datepicker">{children}</div>
                )}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Shift</label>
              <SelectDropdown
                options={ShiftOptions}
                selectedOption={selectedShift}
                defaultSelect="SShift"
                onSelectOption={(option) => setSelectedShift(option)}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Replaced Employee</label>
              <SelectDropdown
                options={ReplacedOptions}
                selectedOption={selectedReplaced}
                defaultSelect="SReplaced"
                onSelectOption={(option) => setSelectedReplaced(option)}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Religion</label>
              <SelectDropdown
                options={ReligionOptions}
                selectedOption={selectedReligion}
                defaultSelect="SReligion"
                onSelectOption={(option) => setSelectedReligion(option)}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label className="form-label">Marital Status</label>
              <SelectDropdown
                options={MaritalOptions}
                selectedOption={selectedMarital}
                defaultSelect="SMarital"
                onSelectOption={(option) => setSelectedMarital(option)}
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label htmlFor="ratePerHour" className="form-label">
                Number of Children (Optional)
              </label>
              <input
                type="text"
                className="form-control"
                id="ratePerHour"
                name="ratePerHour"
                required
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label htmlFor="ratePerHour" className="form-label">
                IP No <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="ratePerHour"
                name="ratePerHour"
                required
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label htmlFor="ratePerHour" className="form-label">
                UAN <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="ratePerHour"
                name="ratePerHour"
                required
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label htmlFor="ratePerHour" className="form-label">
                Aadhar no <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="ratePerHour"
                name="ratePerHour"
                required
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label htmlFor="ratePerHour" className="form-label">
                Pan Card no <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="ratePerHour"
                name="ratePerHour"
                required
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label htmlFor="ratePerHour" className="form-label">
                Rent Agreement/ Electricity bill Proof{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="ratePerHour"
                name="ratePerHour"
                required
              />
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <label htmlFor="ratePerHour" className="form-label">
                Reference <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="ratePerHour"
                name="ratePerHour"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                About Employee <span className="text-danger">*</span>
              </label>
              <JoditEditor
                value={value}
                config={config}
                onChange={(htmlString) => setValue(htmlString)}
              />
            </div>
          </div>
        </fieldset>

        
      </form>
    </section>
  );
};

export default TabEmployeeDetails;  