import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
export default function useGoalStatistics(schedule) {
    const dispatch = useDispatch();
    useEffect(() => {
        if(schedule && schedule.goalStatistics) {
            dispatch({type: 'goalStatistics/set', payload: {goalsActive: schedule.goalStatistics[0].goalsActive, goalsCompleted: schedule.goalStatistics[0].goalsCompleted}});
        }
    }, [schedule]);
}