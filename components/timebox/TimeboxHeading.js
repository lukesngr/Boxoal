import ReactDatePicker from "react-datepicker"
export default function TimeboxHeading(props) {
    return <h1 className="viewHeading">This Week
            <ReactDatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    placeholderText="Select a date"
            /> 
                {!props.expanded && <FontAwesomeIcon className="sideBarExpandBtn ml-1" icon={faCog} onClick={() => props.setExpanded(true)}></FontAwesomeIcon>}
            </h1>
}