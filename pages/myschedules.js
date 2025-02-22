import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/components/base/Loading";
import { useRouter } from "next/router";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useDispatch } from "react-redux";
import serverIP from "@/modules/serverIP";

export default function MySchedules() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { authStatus, user } = useAuthenticator((context) => [
            context.authStatus,
            context.user,
    ]);
    
    useEffect(() => {
        if(authStatus != 'authenticated') {
            router.push('/');
        }
    }, [authStatus])

    let userId = user?.userId;
    useProfile(user, dispatch);

    const {status, data, error, refetch} = useQuery({
        queryKey: ["schedule"], 
        queryFn: async () => {
            const response = await axios.get(serverIP+"/getSchedules", { params: {
                userUUID: userId
            }});
            return response.data;
        },
        enabled: true
    })

    /*if(status === 'pending') return <Loading />
    if(status === 'error') return <Text>Error: {error.message}</Text>
    if(data.length == 0) return <Welcome />*/

    return (<>
        <Loading />
    </>)
    
}