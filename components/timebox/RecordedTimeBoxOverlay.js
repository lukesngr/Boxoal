import { useEffect, useState } from "react";
import { calculatePixelsFromTopOfGridBasedOnTime } from "@/modules/dateLogic";

export default function RecordedTimeBoxOverlay(props) {
    let {data, schedule, overlayDimensions} = props;
    const [recordedBoxes, setRecordedBoxes] = useState([]);

    useEffect(() => {
        if(data.length > 0) {
            let normalArrayFromState = [...recordedBoxes];
            data.forEach(element => {
                let marginFromTop = calculatePixelsFromTopOfGridBasedOnTime(schedule, overlayDimensions, new Date(element.recordedStartTime));
                let heightForBox = calculatePixelsFromTopOfGridBasedOnTime(schedule, overlayDimensions, new Date(element.recordedEndTime)) - marginFromTop;
                let notEitherZero = !(marginFromTop == 0 || heightForBox == 0); //due to overlay dimensions not being set at right time

                if(notEitherZero && !normalArrayFromState.some(item => item.id === element.id)) {
                    normalArrayFromState.push({id: element.id, heightForBox, marginFromTop, title: element.timeBox.title});
                }
            });
            setRecordedBoxes(normalArrayFromState);
        }
    }, [data]);
    
    return <>{recordedBoxes.map((recordedBoxes) => (
        <div className="recordedTimeBox" style={{width: props.overlayDimensions[0]+"px", 
        height: recordedBoxes.heightForBox, top: recordedBoxes.marginFromTop}}>{recordedBoxes.title}</div>
    ))}</>
}