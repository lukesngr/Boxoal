import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export function useProfile(userId, dispatch) {

    const {status, data, error, refetch} = useQuery({
        queryKey: ["XP"], 
        queryFn: async () => {
            const response = await axios.get("/api/getProfile", { params: {userUUID: userId}});
            return response.data;
        },
        enabled: true
    })

    useEffect(() => {
        if(data) {
            let {boxSizeUnit, boxSizeNumber, wakeupTime, scheduleID, scheduleIndex, goalLimit} = data;
            dispatch({type: 'profile/set', payload: {scheduleID, boxSizeUnit, boxSizeNumber, wakeupTime, scheduleIndex, goalLimit}});
        }
    }, [data]);
    
    return;
}