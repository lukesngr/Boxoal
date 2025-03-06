import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getProgressAndLevel } from "../modules/coreLogic";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import serverIP from "@/modules/serverIP";
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
            let {boxSizeUnit, boxSizeNumber, wakeupTime, scheduleID, scheduleIndex} = data;
            dispatch({type: 'profile/set', payload: {scheduleID, boxSizeUnit, boxSizeNumber, wakeupTime, scheduleIndex}});
        }else{
            dispatch({type: 'profile/set', payload: {scheduleID: 0, scheduleIndex: 0, boxSizeUnit: 'min', boxSizeNumber: 30, wakeupTime: '07:00'}});
        }
    }, [data]);
    
    return;
}