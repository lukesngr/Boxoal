import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";

export function useProfile(userId, dispatch) {

    const {status, data, error, refetch} = useQuery({
        queryKey: ["XP"], 
        queryFn: async () => {
	    const session = await fetchAuthSession();
            const accessToken = session.tokens?.accessToken.toString();
            const response = await axios.get("/api/getProfile", {
	      headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }});
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
