import CreateTimeboxForm from "../form/CreateTimeboxForm2";
import { useState } from "react";

export default function TimeboxInCreation({date, time}) {
    const [createTimeboxFormVisible, setCreateTimeboxFormVisible] = useState(false);
    const [numberOfBoxes, setNumberOfBoxes] = useState('');
    function getHeightForBoxes (numberOfBoxes) { 
        if (numberOfBoxes === '') {
            return '0%';
        }else {
            return `calc(${(parseInt(numberOfBoxes) * 100)}% + ${(parseInt(numberOfBoxes) - 1) * 2}px)` 
        }
    }

    console.log(createTimeboxFormVisible);

    return <>
        <CreateTimeboxForm 
            visible={createTimeboxFormVisible} 
            close={() => setCreateTimeboxFormVisible(false)} 
            time={time} 
            date={date} 
            numberOfBoxes={numberOfBoxes} 
            setNumberOfBoxes={setNumberOfBoxes}>
        </CreateTimeboxForm>
        <div onClick={() => setCreateTimeboxFormVisible(true)} style={{height: '100%'}}>
            <div className="timeboxInCreation" style={{height: getHeightForBoxes(numberOfBoxes), backgroundColor: 'blue', width: '100%', marginTop: '0px'}}></div>
        </div>
    </>
}