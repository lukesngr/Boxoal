import { useState } from "react";
import axios from "axios";


export default function CreateGoalForm(props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('/api/createArea', {
            name,
            description,
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
            <label>Description: </label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required></input><br />
            <button type="submit">Create</button>
        </form>
    )
}