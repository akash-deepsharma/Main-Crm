import React, { useState } from 'react'
import AttandanceEmployeeTable from '../ClientAttendanceList/AttandanceEmployeeTable';
import AttandanceEmployeeUpdateTable from '../ClientAttendanceList/AttandanceEmployeeUpdateTable ';


const TabProjectSettings = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    return (
        <section className="step-body mt-0 body current stepChange">
            <form id="project-settings">
                <fieldset>
                    <AttandanceEmployeeUpdateTable/>
                </fieldset>
            </form>
        </section>

    )
}

export default TabProjectSettings

