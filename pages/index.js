import UnSignedNav from "../components/nav/SignedOutNav"
import SignedInNav from "@/components/nav/SignedInNav";
import Image from "next/image"
import "../styles/homecard.scss";
import { useSession } from "next-auth/react";
import localFont from 'next/font/local'
import Loading from "@/components/base/Loading";
import { signIn } from "next-auth/react";
const glitchFont = localFont({src: '../public/BlueScreen.ttf'});

export default function Home() {

    const {data: session, status} = useSession();
    
    if(status === "loading") {
        return <Loading />
    }

    return (
    <>
        {status === "authenticated" && <SignedInNav session={session}/>}
        <div className="text-center animatedText">
            <h1 className={glitchFont.className}>Timeboxing For The Everyman</h1>
            {!session && <button className="signInButton" onClick={() => signIn()}>Join Us</button>}
        </div>
    </>)
}