import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import SignedInNav from "@/components/nav/SignedInNav";

export default function HabitTracker() {
    const {data: session, status} = useSession();
    const router = useRouter();

    if(status == "loading") {
        return <Loading />
    }else if(status === "authenticated"){
        return (<SignedInNav session={session}></SignedInNav>)
    }else if(status === "unauthenticated") {
        router.push('/');
    } 
}