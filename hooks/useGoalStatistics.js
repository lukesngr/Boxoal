import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
export default function useGoalStatistics(schedule) {
    const dispatch = useDispatch();
    useEffect(() => {
        if(schedule.goalStatistics) {
            dispatch({type: 'goalStatistics/set', payload: {goalsActive: schedule.goalStatistics.goalsActive, goalsCompleted: schedule.goalStatistics.goalsCompleted}});
        }
    }, [schedule]);
}