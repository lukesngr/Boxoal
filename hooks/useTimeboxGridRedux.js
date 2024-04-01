import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useTimeboxGridRedux(schedule, selectedDate) {
    let timeBoxGrid = new Map();

    useEffect(() => {
        timeBoxGrid = generateTimeBoxGrid(schedule, selectedDate);
    }, []);
    
    useEffect(() => {
        timeBoxGrid = generateTimeBoxGrid(schedule, selectedDate);
    }, [props.data, selectedSchedule])

}