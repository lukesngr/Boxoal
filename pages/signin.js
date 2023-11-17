import UnSignedNav from "../components/nav/SignedOutNav"
import SignInCard from "../components/SignInCard"
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn() {
    const {data: session} = useSession();
    const router = useRouter();
    if(session) {
        router.push('/myschedules')
    }
    return ( <>
        <UnSignedNav />
        <SignInCard />
        </>
)
}