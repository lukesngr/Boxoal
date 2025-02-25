import { useSelector } from "react-redux";
import { getPercentageOfBoxSizeFilled } from "@/modules/boxCalculations";
import TimeboxActionsForm from "../form/TimeboxActionsForm";
import { useState } from "react";

export default function NormalTimeBox(props) {
    const {boxSizeNumber, boxSizeUnit} = useSelector(state => state.profile.value);
    const [timeboxActionsFormVisible, setTimeboxActionsFormVisible] = useState(false);
    let percentageOfBoxSizeFilled = getPercentageOfBoxSizeFilled(boxSizeUnit, boxSizeNumber, new Date(props.data.startTime), new Date(props.data.endTime));
    let calculatedHeight = `calc(${(Number(percentageOfBoxSizeFilled*100))}% + ${Number((percentageOfBoxSizeFilled-1)*2)}px)`
    return (<>
        <TimeboxActionsForm visible={timeboxActionsFormVisible} closeModal={() => setTimeboxActionsFormVisible(false)} data={props.data} date={props.date} time={props.time}></TimeboxActionsForm>
        <div style={{height: '100%'}} onClick={() => setTimeboxActionsFormVisible(true)}>
            <div style={{height: `${calculatedHeight}`, backgroundColor: props.data.color, zIndex: 999, position: 'relative'}} id="timeBox" data-testid="normalTimeBox">    
                <span className="timeboxText">{props.data.title}</span>
            </div>
        </div>
    </>)
}