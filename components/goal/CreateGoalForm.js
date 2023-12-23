import { useState } from "react";
import axios from "axios";


export default function CreateGoalForm(props) {
    const [name, setName] = useState("");
    const [priority, setPriority] = useState("");
    const [targetDate, setTargetDate] = useState(new Date());

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('/api/createArea', {
            name,
            priority,
            targetDate,
            schedule: {
                connect: {id: props.id}
            } 
        }).catch(function(error) {
            console.log(error);
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Name: </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required></input><br />
            <label>Priority: </label>
            <input type="number" min={1} value={priority} onChange={(e) => setPriority(e.target.value)} required></input><br />
            <label>Target Date: </label>
            <input type="datetime-local" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required></input><br />
            <button type="submit">Create Goal</button>
        </form>
    )
}