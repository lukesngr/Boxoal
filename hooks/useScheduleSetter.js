import { useDispatch } from "react-redux";

export function useScheduleSetter(schedule) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({type: 'scheduleEssentials/set', payload: {id: schedule.id, wakeupTime: schedule.wakeupTime, boxSizeUnit: schedule.boxSizeUnit, boxSizeNumber: schedule.boxSizeNumber}});
        dispatch({type: 'scheduleData/set', payload: {timeboxes: schedule.timeboxes, recordedTimeboxes: schedule.recordedTimeboxes, goals: schedule.goals}});
    }, []);

    useEffect(() => {
        dispatch({type: 'scheduleEssentials/set', payload: {id: schedule.id, wakeupTime: schedule.wakeupTime, boxSizeUnit: schedule.boxSizeUnit, boxSizeNumber: schedule.boxSizeNumber}});
        dispatch({type: 'scheduleData/set', payload: {timeboxes: schedule.timeboxes, recordedTimeboxes: schedule.recordedTimeboxes, goals: schedule.goals}});
    }, [schedule]);
}