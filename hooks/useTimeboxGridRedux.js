import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useTimeboxGridRedux(schedule, selectedDate) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({type: 'timeboxGrid/set', payload: generateTimeBoxGrid(schedule, selectedDate)});
    }, []);
    
    useEffect(() => {
        dispatch({type: 'timeboxGrid/set', payload: generateTimeBoxGrid(schedule, selectedDate)});
    }, [schedule]);

}