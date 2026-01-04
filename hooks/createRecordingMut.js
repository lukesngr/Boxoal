import axios from "axios";
import { useMutation } from "react-query";
import { queryClient } from '../modules/queryClient.js';
import { useDispatch, useSelector } from "react-redux";

export default function createRecordingMut(timeboxData, close) { 
  const dispatch = useDispatch();
  const {scheduleIndex} = useSelector(state => state.profile.value);
  return useMutation({
    mutationFn: (recordingData) => axios.post('/api/createRecordedTimebox', recordingData),
    onMutate: async (recordingData) => {
      await queryClient.cancelQueries(['schedule']); 
            
      const previousSchedule = queryClient.getQueryData(['schedule']);
            
      queryClient.setQueryData(['schedule'], (old) => {
        if (!old) return old;
        //recordedTimeBoxes in schedule
        const copyOfOld = structuredClone(old);
        const recordingDataCopy = structuredClone(recordingData);
        recordingDataCopy.timeBox = timeboxData
        copyOfOld[scheduleIndex].recordedTimeboxes.push(recordingDataCopy);

        //recordedTimeboxes in timeboxes
        const timeboxIndex = copyOfOld[scheduleIndex].timeboxes.findIndex(element => element.objectUUID == timeboxData.objectUUID);
        copyOfOld[scheduleIndex].timeboxes[timeboxIndex].recordedTimeBoxes.push(recordingDataCopy);

        //recordedTimeBoxes in goals
        const goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(timeboxData.goalID));
        const timeboxGoalIndex = copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.findIndex(element => element.objectUUID == timeboxData.objectUUID);
                
        copyOfOld[scheduleIndex].goals[goalIndex].timeboxes[timeboxGoalIndex].recordedTimeBoxes.push(recordingDataCopy);
        return copyOfOld;
       }); 
            return { previousSchedule };
    },
    onSuccess: () => {
      close();
      dispatch({type: 'alert/set', payload: {
        open: true,
        title: "Timebox",
        message: "Added recorded timebox!"
      }});
        queryClient.invalidateQueries(['schedule']); // Refetch to get real data
      },
    onError: (error, goalData, context) => {
      queryClient.setQueryData(['schedule'], context.previousGoals);
      dispatch({type: 'alert/set', payload: { 
	open: true, 
	title: "Error", 
	message: "An error occurred, please try again or contact the developer" 
      }});
      queryClient.invalidateQueries(['schedule']);
      close();
    }
  });
}
