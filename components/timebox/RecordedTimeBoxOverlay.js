import { useEffect, useState } from "react";
import { calculatePixelsFromTopOfGridBasedOnTime } from "@/modules/dateLogic";

export default function RecordedTimeBoxOverlay(props) {
    let {data, schedule, overlayDimensions} = props;
    const [recordedBoxes, setRecordedBoxes] = useState([]);

    useEffect(() => {
        if(data.length > 0) {
            let normalArrayFromState = [...recordedBoxes];
            data.forEach(element => {
                let fieldsForCalculation = [schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions];
                let marginFromTop = calculatePixelsFromTopOfGridBasedOnTime(...fieldsForCalculation, new Date(element.recordedStartTime));
                let heightForBox = calculatePixelsFromTopOfGridBasedOnTime(...fieldsForCalculation, new Date(element.recordedEndTime)) - marginFromTop;
                if(heightForBox < 30) {
                    heightForBox = 30;
                }//reasonable value which alllows it is visible
                let notEitherZero = !(marginFromTop == 0 || heightForBox == 0); //due to overlay dimensions not being set at right time
                if(notEitherZero && !normalArrayFromState.some(item => item.id === element.id)) {
                    normalArrayFromState.push({id: element.id, heightForBox, marginFromTop, title: element.timeBox.title});
                }
            });
            setRecordedBoxes(normalArrayFromState);
        }
    }, [data]);
    
    return <>{recordedBoxes.map((recordedBoxes) => (
        <div key={recordedBoxes} className="recordedTimeBox" style={{width: props.overlayDimensions[0]+"px", 
        height: `${recordedBoxes.heightForBox}px`, top: recordedBoxes.marginFromTop}}>{recordedBoxes.title}</div>
    ))}</>
}