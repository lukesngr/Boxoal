import { useSelector } from "react-redux";
import { addBoxesToTime, getPercentageOfBoxSizeFilled } from "@/modules/boxCalculations";
import TimeboxActionsForm from "../form/TimeboxActionsForm";
import { useEffect, useState } from "react";
import { convertToTimeAndDate, convertToDayjs } from "@/modules/formatters";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/modules/queryClient";

export default function NormalTimeBox(props) {
    const {boxSizeNumber, boxSizeUnit} = useSelector(state => state.profile.value);
    const [timeboxActionsFormVisible, setTimeboxActionsFormVisible] = useState(false);
    const [numberOfBoxes, setNumberOfBoxes] = useState(String(props.data.numberOfBoxes));
    let [time, date] = convertToTimeAndDate(props.data.startTime);
    let endTime = convertToDayjs(...addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes, date)).utc().format();
    let percentageOfBoxSizeFilled = getPercentageOfBoxSizeFilled(boxSizeUnit, boxSizeNumber, new Date(props.data.startTime), new Date(endTime));
    let calculatedHeight = `calc(${(Number(percentageOfBoxSizeFilled*100))}% + ${Number((percentageOfBoxSizeFilled-1)*2)}px)`
    
    useEffect(() => {
        setNumberOfBoxes(String(props.data.numberOfBoxes));
    }, [props.data.numberOfBoxes]);
    return (<>
    <QueryClientProvider client={queryClient}>
        <TimeboxActionsForm 
            visible={timeboxActionsFormVisible} 
            closeModal={() => setTimeboxActionsFormVisible(false)} 
            data={props.data} 
            date={props.date} 
            time={props.time}
            numberOfBoxes={[numberOfBoxes, setNumberOfBoxes]}></TimeboxActionsForm>
        <div style={{height: '100%'}} onClick={() => setTimeboxActionsFormVisible(true)}>
            <div style={{height: `${calculatedHeight}`, backgroundColor: props.data.color, zIndex: 999, position: 'relative'}} id="timeBox" data-testid="normalTimeBox">    
                <span className="timeboxText" style={props.data.isTimeblock ? ({color: 'white'}) : ({color: 'black'})}>{props.data.title}</span>
            </div>
        </div>
    </QueryClientProvider>
    </>)
}