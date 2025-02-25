import CreateTimeboxForm from "../form/CreateTimeboxForm";
import { useState } from "react";

export default function TimeboxInCreation({date, time, day}) {
    const [createTimeboxFormVisible, setCreateTimeboxFormVisible] = useState(false);
    const [numberOfBoxes, setNumberOfBoxes] = useState('');
    const [title, setTitle] = useState("");
    function getHeightForBoxes (numberOfBoxes) { 
        if (numberOfBoxes === '') {
            return '0%';
        }else {
            return `calc(${(parseInt(numberOfBoxes) * 100)}% + ${(parseInt(numberOfBoxes) - 1) * 2}px)` 
        }
    }

    return <>
        <CreateTimeboxForm 
            visible={createTimeboxFormVisible} 
            close={() => setCreateTimeboxFormVisible(false)} 
            time={time} 
            date={date} 
            numberOfBoxes={numberOfBoxes} 
            setNumberOfBoxes={setNumberOfBoxes}
            day={day}
            title={title} 
            setTitle={setTitle}>
        </CreateTimeboxForm>
        <div onClick={() => setCreateTimeboxFormVisible(true)} style={{height: '100%'}}>
            <div className="timeboxInCreation" style={{height: getHeightForBoxes(numberOfBoxes), backgroundColor: 'blue', width: '100%', marginTop: '0px', zIndex: 999, position: 'relative'}}>
                <span style={{position: 'relative', fontSize: 'medium', left: '2px', top: '2px', zIndex: 998, overflow: 'hidden', color: 'black'}}>{title}</span>
            </div>
        </div>
    </>
}