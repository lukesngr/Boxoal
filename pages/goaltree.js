import Loading from "@/components/base/Loading";
import { useRouter } from "next/router";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import GoalTreeWhenAuthLoaded from "@/components/base/GoalTreeWhenAuthLoaded";
import '../styles/base.scss';

export default function GoalTree() {
    const router = useRouter();
    
    const { authStatus, user } = useAuthenticator((context) => [
            context.authStatus,
            context.user,
    ]);

    useEffect(() => {
        if(authStatus == 'unauthenticated') {
            router.push('/');
        }
    }, [authStatus, router]);

    if(authStatus == 'configuring' || authStatus == "idle") {
         return <Loading />
    }else if(authStatus == "authenticated") {
        return <GoalTreeWhenAuthLoaded user={user}/>
    }
    
    return <></>
    
}