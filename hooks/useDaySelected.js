import { useDispatch } from "react-redux";
import { useEffect } from "react";

export function useDaySelected(currentDay) {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({type: 'daySelected/set', payload: currentDay});
    }, []);

}