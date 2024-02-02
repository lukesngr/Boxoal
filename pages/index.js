import UnSignedNav from "../components/nav/SignedOutNav"
import SignedInNav from "@/components/nav/SignedInNav";
import Image from "next/image"
import "../styles/homecard.scss";
import { useSession } from "next-auth/react";
import localFont from 'next/font/local'
import Loading from "@/components/base/Loading";
const glitchFont = localFont({src: '../public/BlueScreen.ttf'});

export default function Home() {

    const {data: session, status} = useSession();
    

    if(status === "loading") {
        return <Loading />
    }

    return (
    <>
        {!session && <UnSignedNav /> }
        {status === "authenticated" && <SignedInNav session={session}/>}
        <div className="text-center animatedText">
            <h1 className={glitchFont.className}>Timeboxing For The Everyman</h1>
        </div>
    </>)
}