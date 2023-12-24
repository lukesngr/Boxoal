import { useContext, useState } from "react";
import { SessionContext, RefetchContext } from "@/pages/myschedules";
import axios from "axios";
import { queryClient } from './../../pages/_app';
import {toast} from "react-toastify";


export default function CreateScheduleForm() {
    const [name, setName] = useState("");
    const [boxSizeNumber, setBoxSizeNumber] = useState(1);
    const [boxSizeUnit, setBoxSizeUnit] = useState("min");
    const [endDate, setEndDate] = useState("");
    const [endDateNeeded, setEndDateNeeded] = useState("none");
    const [wakeupTime, setWakeupTime] = useState("07:30");
    const userEmail = useContext(SessionContext).user.email;

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('/api/createSchedule', {
            name,
            boxSizeNumber: parseInt(boxSizeNumber),
            boxSizeUnit,
            endDate,
            wakeupTime,
            userEmail, 
        }).then(() => {
            queryClient.refetchQueries();
            toast.success("Added schedule!", {
                position: toast.POSITION.TOP_RIGHT,
            });
            
        }).catch(function(error) {
            console.log(error);
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
            <button type="submit">Create</button>
        </form>
    )
}