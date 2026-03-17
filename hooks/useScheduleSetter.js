import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import DoubleKeyMap from "@/modules/doubleKeyMap";

export function useScheduleSetter(schedule) {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile.value);

    function manufactureMapsForImportantObjects() {
	dispatch({type: 'profile/set', payload: {...profile, scheduleID: schedule.id}});
	let timeboxesMap = new DoubleKeyMap();
	let recordedTimeboxesMap = new DoubleKeyMap();
	let goalsMap = new DoubleKeyMap();

	schedule.timeboxes.forEach((currentValue) => {
	  timeboxesMap.setEntry(currentValue.goalID, currentValue.objectUUID, currentValue)
	})

	schedule.recordedTimeboxes.forEach((currentValue) => {
	  recordedTimeboxesMap.setEntry(currentValue.timeboxUUID, currentValue.objectUUID, currentValue)
	})

	schedule.goals.forEach((currentValue) => {
	  goalsMap.setEntry(currentValue.scheduleID, currentValue.id, currentValue)
	})
	console.log(goalsMap.getFromK1(schedule.id), schedule.id, goalsMap.k1ToK2, goalsMap.k2ToValue) 
        dispatch({type: 'scheduleData/set', payload: {title: schedule.title, timeboxes: timeboxesMap, recordedTimeboxes: recordedTimeboxesMap, goals: goalsMap}});
     }

    useEffect(() => {
	manufactureMapsForImportantObjects()
    }, []);

    useEffect(() => {
        manufactureMapsForImportantObjects()
    }, [schedule]);
}
