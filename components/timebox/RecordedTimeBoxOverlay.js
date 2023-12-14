import { useEffect } from "react";
import { calculatePixelsFromTopOfGridBasedOnTime } from "@/modules/dateLogic";

export default function RecordedTimeBoxOverlay(props) {
    let {data, schedule, overlayDimensions} = props;
    let recordedBoxes = [];

    useEffect(() => {
        if(data.length > 0) {
            data.forEach(element => {
                let marginFromTop = calculatePixelsFromTopOfGridBasedOnTime(schedule, overlayDimensions, new Date(element.recordedStartTime));
                let heightForBox = calculatePixelsFromTopOfGridBasedOnTime(schedule, overlayDimensions, new Date(element.recordedEndTime)) - marginFromTop;
                console.log(heightForBox);
                recordedBoxes.push({heightForBox, marginFromTop, title: element.timeBox.title});
            });
        }
    }, [data]);


    
    return <>{recordedBoxes.map((recordedBoxes) => (
        <div className="recordedTimeBox" style={{width: props.overlayDimensions[0]+"px", 
        height: recordedBoxes.heightForBox, top: marginFromTop}}></div>
    ))}</>
}