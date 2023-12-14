import { useEffect, useState } from "react";
import { calculatePixelsFromTopOfGridBasedOnTime } from "@/modules/dateLogic";

export default function RecordedTimeBoxOverlay(props) {
    let {data, schedule, overlayDimensions} = props;
    const [recordedBoxes, setRecordedBoxes] = useState([]);

    useEffect(() => {
        if(data.length > 0) {
            let normalArrayFromState = recordedBoxes;
            data.forEach(element => {
                let marginFromTop = calculatePixelsFromTopOfGridBasedOnTime(schedule, overlayDimensions, new Date(element.recordedStartTime));
                let heightForBox = calculatePixelsFromTopOfGridBasedOnTime(schedule, overlayDimensions, new Date(element.recordedEndTime)) - marginFromTop;
                if(data.some(item => item.marginFromTop != marginFromTop &&
                    item.heightForBox != heightForBox && item.title != element.timeBox.title)) {
                    normalArrayFromState.push({heightForBox, marginFromTop, title: element.timeBox.title});
                }
            });
            setRecordedBoxes(normalArrayFromState);
        }
    }, [data]);

    console.log(recordedBoxes);
    
    return <>{recordedBoxes.map((recordedBoxes) => (
        <div className="recordedTimeBox" style={{width: props.overlayDimensions[0]+"px", 
        height: recordedBoxes.heightForBox, top: recordedBoxes.marginFromTop}}></div>
    ))}</>
}