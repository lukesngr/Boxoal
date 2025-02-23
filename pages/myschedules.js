import Loading from "@/components/base/Loading";
import { useRouter } from "next/router";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import MySchedulesWhenAuthLoaded from "@/components/base/MySchedulesWhenAuthLoaded";

export default function MySchedules() {
    const router = useRouter();
    
    const { authStatus, user } = useAuthenticator((context) => [
            context.authStatus,
            context.user,
    ]);

    useEffect(() => {
        if(authStatus == 'unauthenticated') {
            router.push('/');
        }
    }, [authStatus]);

    if(authStatus == 'configuring' || authStatus == "idle") {
         return <Loading />
    }else if(authStatus == "authenticated") {
        return <MySchedulesWhenAuthLoaded user={user}/>
    }
    
    return <></>
    
}