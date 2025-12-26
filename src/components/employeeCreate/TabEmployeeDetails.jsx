import React, { useEffect, useState } from "react";
import SelectDropdown from "@/components/shared/SelectDropdown";
import {
  ConsigneeOptions,
  ContractOptions,
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
  const [selectedOption, setSelectedOption] = useState(null);
  const { startDate,setStartDate, renderFooter } =
    useDatePicker();

  const config = useJoditConfig();
  const [value, setValue] = useState("");

  useEffect(() => {
    setStartDate(new Date());
    setValue(`
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores beatae inventore reiciendis ipsum natus, porro recusandae sunt accusantium reprehenderit aliquid commodi est veniam sit molestiae, nesciunt cupiditate. Laborum, culpa maxime.
            `);
  }, []);

  return (
    <section className="step-body mt-4 body current stepChange">
      <form id="project-details">
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Employee details</h2>
            <p className="text-muted">Employee details gose here.</p>
          </div>
          <fieldset>
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-md-6  mb-4">
                <label htmlFor="employeeName" className="form-label">
                  Select Client Contract <span className="text-danger">*</span>
                </label>
                <SelectDropdown
                  options={ContractOptions}
                  selectedOption={selectedOption}
                  defaultSelect="SContract"
                  onSelectOption={(option) => setSelectedOption(option)}
                />
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <label htmlFor="ratePerHour" className="form-label">
                  Select Client <span className="text-danger">*</span>
                </label>
                <SelectDropdown
                  options={ClientOptions}
                  selectedOption={selectedOption}
                  defaultSelect="SClient"
                  onSelectOption={(option) => setSelectedOption(option)}
                />
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <label htmlFor="ratePerHour" className="form-label">
                  Select Consignee <span className="text-danger">*</span>
                </label>
                <SelectDropdown
                  options={ConsigneeOptions}
                  selectedOption={selectedOption}
                  defaultSelect="SConsignee"
                  onSelectOption={(option) => setSelectedOption(option)}
                />
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <label htmlFor="ratePerHour" className="form-label">
                  Select Designation <span className="text-danger">*</span>
                </label>
                <SelectDropdown
                  options={DesignationOptions}
                  selectedOption={selectedOption}
                  defaultSelect="SD"
                  onSelectOption={(option) => setSelectedOption(option)}
                />
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <label htmlFor="ratePerHour" className="form-label">
                  Name <span className="text-danger">*</span>
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
                  Email <span className="text-danger">*</span>
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
                  Mobile No <span className="text-danger">*</span>
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
                <label htmlFor="projectName" className="form-label">
                  Total Year of Experience{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="projectName"
                  name="projectName"
                  required
                />
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <label htmlFor="ratePerHour" className="form-label">
                  Gender <span className="text-danger"></span>
                </label>
                <SelectDropdown
                  options={GenderOptions}
                  selectedOption={selectedOption}
                  defaultSelect="SG"
                  onSelectOption={(option) => setSelectedOption(option)}
                />
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <label htmlFor="ratePerHour" className="form-label">
                  {" "}
                  Date of Birth <span className="text-danger">*</span>
                </label>
                {/* <input type="date" className="form-control" id="ratePerHour" name="ratePerHour" required /> */}
                <div className="input-group date ">
                  <DatePicker
                    placeholderText="Pick Onboard Date"
                    selected={startDate}
                    showPopperArrow={false}
                    onChange={(date) => setStartDate(date)}
                    className="form-control"
                    popperPlacement="bottom-start"
                    calendarContainer={({ children }) => (
                      <div className="bg-white react-datepicker">
                        {children}
                        {renderFooter("start")}
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <label htmlFor="ratePerHour" className="form-label">
                  Select Shift <span className="text-danger"></span>
                </label>
                <SelectDropdown
                  options={ShiftOptions}
                  selectedOption={selectedOption}
                  defaultSelect="SShift"
                  onSelectOption={(option) => setSelectedOption(option)}
                />
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <label htmlFor="ratePerHour" className="form-label">
                  Replaced employee <span className="text-danger">*</span>
                </label>
                <SelectDropdown
                  options={ReplacedOptions}
                  selectedOption={selectedOption}
                  defaultSelect="SReplaced"
                  onSelectOption={(option) => setSelectedOption(option)}
                />
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <label htmlFor="ratePerHour" className="form-label">
                  Select Religion <span className="text-danger">*</span>
                </label>
                <SelectDropdown
                  options={ReligionOptions}
                  selectedOption={selectedOption}
                  defaultSelect="SReligion"
                  onSelectOption={(option) => setSelectedOption(option)}
                />
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <label htmlFor="ratePerHour" className="form-label">
                  Marital status <span className="text-danger">*</span>
                </label>
                <SelectDropdown
                  options={MaritalOptions}
                  selectedOption={selectedOption}
                  defaultSelect="SMarital"
                  onSelectOption={(option) => setSelectedOption(option)}
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
              <div className="mb-4 ">
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
        </fieldset>
      </form>
    </section>
  );
};

export default TabEmployeeDetails;
