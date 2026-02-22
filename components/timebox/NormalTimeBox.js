import { useSelector } from "react-redux";
import { getPercentageOfBoxSizeFilled } from "@/modules/boxCalculations";
import TimeboxActionsForm from "../form/TimeboxActionsForm";
import { useEffect, useState } from "react";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/modules/queryClient";

export default function NormalTimeBox(props) {
    const {time, date, data} = props;
    const {boxSizeNumber, boxSizeUnit} = useSelector(state => state.profile.value);
    const [timeboxActionsFormVisible, setTimeboxActionsFormVisible] = useState(false);
    const [numberOfBoxes, setNumberOfBoxes] = useState(String(data.numberOfBoxes));
    const percentageOfBoxSizeFilled = getPercentageOfBoxSizeFilled(boxSizeUnit, boxSizeNumber, new Date(data.startTime), new Date(data.endTime));
    const calculatedHeight = `calc(${(Number(percentageOfBoxSizeFilled*100))}% + ${Number((percentageOfBoxSizeFilled-1)*2)}px)`
    
    useEffect(() => {
        setNumberOfBoxes(String(props.data.numberOfBoxes));
    }, [data.numberOfBoxes, props.data.numberOfBoxes]);
    
    return (<>
    <QueryClientProvider client={queryClient}>
        <TimeboxActionsForm 
            visible={timeboxActionsFormVisible} 
            closeModal={() => setTimeboxActionsFormVisible(false)} 
            data={data}
	    date={date}
            time={time}
            numberOfBoxes={[numberOfBoxes, setNumberOfBoxes]}></TimeboxActionsForm>
        <div style={{height: '100%'}} className={`${time}${date}TimeboxActionsForm`} onClick={() => setTimeboxActionsFormVisible(true)}>
            <div style={{height: `${calculatedHeight}`, backgroundColor: data.color, zIndex: 998, position: 'relative'}} id="timeBox" className="normalTimeBox">    
                <span className="timeboxText" style={data.isTimeblock ? ({color: 'white'}) : ({color: 'black'})}>{data.title}</span>
            </div>
        </div>
    </QueryClientProvider>
    </>)
}
