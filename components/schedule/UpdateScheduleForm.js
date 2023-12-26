import { useContext, useState } from "react";
import { SessionContext, RefetchContext } from "@/pages/myschedules";
import axios from "axios";
import { queryClient } from './../../pages/_app';
import {toast} from "react-toastify";


export default function UpdateScheduleForm(props) {
    const [name, setName] = useState(props.schedule.name);
    const [boxSizeNumber, setBoxSizeNumber] = useState(props.schedule.boxSizeNumber);
    const [boxSizeUnit, setBoxSizeUnit] = useState(props.schedule.boxSizeUnit);
    const [endDate, setEndDate] = useState(props.schedule.endDate);
    const [endDateNeeded, setEndDateNeeded] = useState(props.schedule.endDate === undefined ? ('none') : ('initial'));
    const [wakeupTime, setWakeupTime] = useState(props.schedule.wakeupTime);

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('/api/updateSchedule', {
            name,
            boxSizeNumber: parseInt(boxSizeNumber),
            boxSizeUnit,
            endDate,
            wakeupTime,
            id: props.schedule.id, 
        }).then(() => {
            queryClient.refetchQueries();
            toast.success("Updated schedule!", {
                position: toast.POSITION.TOP_RIGHT,
            });
            
        }).catch(function(error) {
            toast.error("Error occurred please try again or contact developer");
        });
    }

    function deleteSchedule() {

        

        axios.post('/api/deleteSchedule', {
            id: props.schedule.id, 
        }).then(() => {
            const closeButton = document.querySelector(`#updateScheduleModal .close`);
            if (closeButton) {
                closeButton.click();
            }
            
            queryClient.refetchQueries();
            toast.success("Deleted schedule!", {
                position: toast.POSITION.TOP_RIGHT,
            });
            
        }).catch(function(error) {
            toast.error("Error occurred please try again or contact developer");
        });
    }


    return (
        <form onSubmit={handleSubmit}>
            <label>Name: </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required></input><br />
            <label>Box Size: </label>
            <input type="number" min={1} max={59} value={boxSizeNumber} onChange={(e) => setBoxSizeNumber(e.target.value)} required></input>
            <select value={boxSizeUnit} onChange={(e) => setBoxSizeUnit(e.target.value)} required>
                <option value="min">Min</option>
                <option value="hr">Hour</option>
            </select><br />
            <label>End Date: </label>
            <select value={endDateNeeded} onChange={(e) => {setEndDateNeeded(e.target.value)}}>
                <option value={"none"}>None</option>
                <option value={"initial"}>Choose</option>
            </select>
            <input type="date" style={{display: endDateNeeded}} value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
            <br />
            <label>Average Wakeup Time: </label>
            <input type="time" value={wakeupTime} onChange={(e) => setWakeupTime(e.target.value)} required></input> <br />
            <button type="submit">Update</button>
            <button type="button" className="btn btn-danger" onClick={deleteSchedule}>Delete</button>
        </form>
    )
}