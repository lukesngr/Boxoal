import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getMaxNumberOfGoals } from '../modules/coreLogic';

export default function useGoalLimits(goals) {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile.value);
    const {goalsCompleted} = useSelector(state => state.goalStatistics.value);

    useEffect(() => {
        if (profile.goalLimit == -1) {
            const maxNumberOfGoalsAllowed = getMaxNumberOfGoals(goalsCompleted);
            dispatch({ type: "goalLimit/set", payload: maxNumberOfGoalsAllowed });
        }
    }, [goals]);
}