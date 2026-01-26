import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useMutation } from "react-query";
import { queryClient } from "@/modules/queryClient";

export default function useCreateBoxMut(goalSelected) {
  const dispatch = useDispatch();	
  const {scheduleIndex} = useSelector(state => state.profile.value);
 
  return useMutation({
        mutationFn: (timeboxData) => axios.post('/api/createTimebox', timeboxData),
        onMutate: async (timeboxData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                const copyOfOld = structuredClone(old);
                copyOfOld[scheduleIndex].timeboxes.push({...timeboxData});
                if(!(timeboxData.isTimeblock)) {
                    const goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(goalSelected));
                    copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.push({...timeboxData})
                }
		if(Object.hasOwn(timeboxData, recordedTimeBox)) {
		  copyOfOld[scheduleIndex].recordedTimeBoxes.push(timeboxData.recordedTimeBox);
		}

                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            dispatch({type: 'alert/set', payload: {
                open: true,
                title: "Timebox",
                message: "Added timebox!"
            }});
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
            
        },
        onError: (error, goalData, context) => {
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
            queryClient.setQueryData(['schedule'], context.previousGoals);
            
            queryClient.invalidateQueries(['schedule']);
            
        }
    });
}
