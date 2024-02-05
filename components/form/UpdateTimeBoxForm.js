import { useState } from "react";
import axios from "axios";
import { queryClient } from '../../pages/_app';
import {toast} from "react-toastify";

export default function UpdateTimeBoxForm(props) {
    const [title, setTitle] = useState(props.timebox.title);
    const [description, setDescription] = useState(props.timebox.description);

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('/api/updateTimeBox', {
            title,
            description, 
            id: props.timebox.id
        }).then(function() {
            queryClient.refetchQueries();
            toast.success("Updated timebox!", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(function(error) {
            toast.error("Error occurred please try again or contact developer");
            console.log(error); 
        })
    }

    function deleteTimeBox() {

        axios.post('/api/deleteTimebox', {
            id: props.timebox.id
        }).then(() => {
            const closeButton = document.querySelector(`#updateTimeBoxModal .close`);
            if (closeButton) {
                closeButton.click();
            }
            
            queryClient.refetchQueries();
            toast.success("Deleted timebox!", {
                position: toast.POSITION.TOP_RIGHT,
            });
            
        }).catch(function(error) {
            toast.error("Error occurred please try again or contact developer");
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Title: </label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required></input><br />
            <label>Description: </label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required></input><br />
            <button type="submit">Update</button>
            <button type="button" onClick={deleteTimeBox}>Delete</button>
        </form>
    )
}