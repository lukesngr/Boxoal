import UnSignedNav from "../components/nav/SignedOutNav"
import SignedInNav from "@/components/nav/SignedInNav";
import Image from "next/image"
import "../styles/homecard.scss";
import { useSession } from "next-auth/react";
import localFont from 'next/font/local'
const glitchFont = localFont({src: '../public/BlueScreen.ttf'});

export default function Home() {

    const {data: session, status} = useSession();
    

    if(status === "loading") {
        return <p>Loading</p>
    }

    return (
    <>
        {!session && <UnSignedNav /> }
        {status === "authenticated" && <SignedInNav session={session}/>}
        <div className="text-center animatedText">
            <p className={glitchFont.className}>Timeboxing</p>
            <p className={glitchFont.className}>For</p>
            <p className={glitchFont.className}>The</p>
            <p className={glitchFont.className}>Everyman</p>
        </div>
    </>)
}