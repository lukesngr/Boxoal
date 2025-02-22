import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export function useScheduleSetter(schedule) {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile.value);
    useEffect(() => {
        dispatch({type: 'profile/set', payload: {...profile, scheduleID: schedule.id}});
        dispatch({type: 'scheduleData/set', payload: {timeboxes: schedule.timeboxes, recordedTimeboxes: schedule.recordedTimeboxes, goals: schedule.goals}});
    }, []);

    useEffect(() => {
        dispatch({type: 'profile/set', payload: {...profile, scheduleID: schedule.id}});
        dispatch({type: 'scheduleData/set', payload: {timeboxes: schedule.timeboxes, recordedTimeboxes: schedule.recordedTimeboxes, goals: schedule.goals}});
    }, [schedule]);
}